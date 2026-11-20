/* eslint-disable @nx/enforce-module-boundaries */
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { Actions, useModalStore } from 'apps/portal/src/store/modal.store';
import { Competency } from 'apps/portal/src/types/competency.type';
import { DutiesResponsibilities, DutyResponsibility } from 'apps/portal/src/types/dr.type';
import { Position } from 'apps/portal/src/types/position.type';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import LoadingVisual from '../../loading/LoadingVisual';

type Filter = 'all' | 'selected' | 'available';

const hasCompetency = (dr: DutyResponsibility) => !!dr.competency && !isEmpty(dr.competency) && !!dr.competency.pcplId;

/**
 * Core duties, responsibilities & competencies of a position on one screen:
 * left = searchable duty pool (select / unselect), right = one row per selected duty with its competency and
 * percentage, live total (must be exactly 100%) and checks. Support duties are not used yet (not shown).
 */
export const DrcCoreEditor = () => {
  const { selectedPosition, positions, filledPositions } = usePositionStore((state) => ({
    selectedPosition: state.selectedPosition,
    positions: state.positions,
    filledPositions: state.filledPositions,
  }));
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const action = useModalStore((state) => state.action);
  const readOnly = action === Actions.VIEW || selectedPosition.hasOngoingPrf === 1;

  const { availableDnrs, selectedDnrs, setAvailableDnrs, setFilteredAvailableDnrs, setSelectedDnrs } = useDnrStore(
    (state) => ({
      availableDnrs: state.availableDnrs,
      selectedDnrs: state.selectedDnrs,
      setAvailableDnrs: state.setAvailableDnrs,
      setFilteredAvailableDnrs: state.setFilteredAvailableDnrs,
      setSelectedDnrs: state.setSelectedDnrs,
    })
  );

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [copyFrom, setCopyFrom] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  // competencies (with proficiency level) assigned to this position
  const isManagerial = !!selectedPosition.salaryGrade && selectedPosition.salaryGrade > 20;
  const { data: swrCompetencies, isLoading: loadingCompetencies } = useSWR(
    selectedPosition.positionId
      ? `/competency-proficiency-level/single/${isManagerial ? 'managerial' : 'functional'}/${selectedPosition.positionId}/`
      : null,
    fetcherHRIS,
    { shouldRetryOnError: false }
  );
  const competencies: Array<Competency> = useMemo(
    () => (isManagerial ? swrCompetencies?.data?.managerial : swrCompetencies?.data?.functional) ?? [],
    [swrCompetencies, isManagerial]
  );

  // ---- helpers that keep the store shape the save step expects ----
  const commit = (core: Array<DutyResponsibility>, available: Array<DutyResponsibility>) => {
    const sortedAvailable = [...available].sort((a, b) => a.description.localeCompare(b.description));
    core.forEach((dr, index) => (dr.sequenceNo = index));
    setSelectedDnrs({ ...selectedDnrs, core } as DutiesResponsibilities);
    setAvailableDnrs(sortedAvailable);
    setFilteredAvailableDnrs(sortedAvailable);
  };

  const select = (dr: DutyResponsibility) => {
    if (readOnly) return;
    const picked = { ...dr, state: true, onEdit: false, percentage: dr.percentage || 0, competency: dr.competency ?? ({} as Competency) };
    commit(
      [...selectedDnrs.core, picked],
      availableDnrs.filter((a) => a.odrId !== dr.odrId)
    );
  };

  // back to the pool; an already saved duty keeps its ogdrId so the save step deletes it
  const unselect = (dr: DutyResponsibility) => {
    if (readOnly) return;
    commit(
      selectedDnrs.core.filter((c) => c.odrId !== dr.odrId),
      [...availableDnrs, { ...dr, state: false, onEdit: false, percentage: 0, competency: {} as Competency }]
    );
  };

  const updateSelected = (odrId: string, change: Partial<DutyResponsibility>) => {
    if (readOnly) return;
    commit(
      selectedDnrs.core.map((c) => (c.odrId === odrId ? { ...c, ...change, onEdit: false } : c)),
      availableDnrs
    );
  };

  const spreadEvenly = () => {
    const n = selectedDnrs.core.length;
    if (!n || readOnly) return;
    const base = Math.floor(100 / n);
    commit(
      selectedDnrs.core.map((c, i) => ({ ...c, percentage: base + (i < 100 - base * n ? 1 : 0) })),
      availableDnrs
    );
  };

  // ---- copy from another position with the same title ----
  const sameTitlePositions: Array<Position> = useMemo(() => {
    const all = [...(filledPositions ?? []), ...(positions ?? [])];
    const seen = new Set<string>();
    return all.filter((p) => {
      if (!p || seen.has(p.positionId) || p.positionId === selectedPosition.positionId) return false;
      seen.add(p.positionId);
      return (
        (p.positionTitle ?? '').trim().toLowerCase() === (selectedPosition.positionTitle ?? '').trim().toLowerCase() &&
        p.hasDuties !== 0
      );
    });
  }, [filledPositions, positions, selectedPosition]);

  const { data: swrSource, isLoading: loadingSource } = useSWR(
    copyFrom ? `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${copyFrom}` : null,
    fetcherHRIS,
    { shouldRetryOnError: false, revalidateOnFocus: false }
  );

  useEffect(() => {
    if (!copyFrom || !swrSource?.data) return;
    const sourceCore: Array<DutyResponsibility> = swrSource.data.core ?? [];
    const pool = [...availableDnrs, ...selectedDnrs.core];
    const byOdr = new Map(pool.map((d) => [d.odrId, d]));
    const byCode = new Map(competencies.map((c) => [c.code, c]));
    let skipped = 0;
    const core: Array<DutyResponsibility> = [];
    sourceCore.forEach((src) => {
      const target = byOdr.get(src.odrId);
      if (!target) {
        skipped++;
        return;
      }
      core.push({
        ...target,
        state: true,
        onEdit: false,
        percentage: src.percentage ?? 0,
        competency: (src.competency?.code && byCode.get(src.competency.code)) || ({} as Competency),
      });
    });
    const chosen = new Set(core.map((c) => c.odrId));
    commit(
      core,
      pool.filter((d) => !chosen.has(d.odrId)).map((d) => ({ ...d, state: false, percentage: 0, competency: {} as Competency }))
    );
    setCopyMessage(
      `Copied ${core.length} duties${skipped ? ` (${skipped} not in this position's duty pool were skipped)` : ''}. Review the competencies and percentages, then confirm.`
    );
    setCopyFrom('');
  }, [swrSource]);

  // ---- derived ----
  const total = selectedDnrs.core.reduce((sum, dr) => sum + (Number(dr.percentage) || 0), 0);
  const missingCompetency = selectedDnrs.core.filter((dr) => !hasCompetency(dr)).length;
  const missingPercentage = selectedDnrs.core.filter((dr) => !(Number(dr.percentage) > 0)).length;

  const term = search.trim().toLowerCase();
  const matches = (dr: DutyResponsibility) => !term || dr.description.toLowerCase().includes(term);
  const listSelected = filter === 'available' ? [] : selectedDnrs.core.filter(matches);
  const listAvailable = filter === 'selected' ? [] : availableDnrs.filter(matches);

  const problems: string[] = [];
  if (selectedDnrs.core.length === 0) problems.push('Select at least one core duty.');
  if (missingCompetency) problems.push(`${missingCompetency} duty(ies) without a competency.`);
  if (missingPercentage) problems.push(`${missingPercentage} duty(ies) without a percentage.`);
  if (selectedDnrs.core.length && total !== 100) problems.push(`Total is ${total}% — it must be exactly 100%.`);

  const DutyItem = ({ dr, selected }: { dr: DutyResponsibility; selected: boolean }) => (
    <button
      type="button"
      disabled={readOnly}
      onClick={() => (selected ? unselect(dr) : select(dr))}
      title={dr.description}
      className={`flex items-start w-full gap-3 px-3 py-2.5 text-left border-b border-gray-100 transition-colors disabled:cursor-default ${
        selected ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded border ${
          selected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 bg-white'
        }`}
      >
        {selected ? <i className="text-sm bx bx-check" /> : null}
      </span>
      <span className="text-sm text-gray-700 line-clamp-2">{dr.description}</span>
    </button>
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {/* LEFT: duty pool */}
      <section className="flex flex-col border rounded-lg lg:col-span-2">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">Core Duties</span>
            <span className="text-xs text-gray-500">
              {selectedDnrs.core.length} selected of {selectedDnrs.core.length + availableDnrs.length}
            </span>
          </div>
          <div className="relative">
            <i className="absolute text-gray-400 -translate-y-1/2 bx bx-search left-3 top-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a duty"
              className="w-full py-2 pr-3 text-sm border rounded-md outline-none pl-9 focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="flex gap-1 mt-2">
            {(['all', 'selected', 'available'] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-full border capitalize ${
                  filter === f ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f === 'available' ? 'Not selected' : f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto max-h-[28rem]">
          {listSelected.map((dr) => (
            <DutyItem key={dr.odrId} dr={dr} selected />
          ))}
          {listAvailable.map((dr) => (
            <DutyItem key={dr.odrId} dr={dr} selected={false} />
          ))}
          {listSelected.length + listAvailable.length === 0 ? (
            <div className="p-6 text-sm text-center text-gray-400">No duties found</div>
          ) : null}
        </div>
      </section>

      {/* RIGHT: selected duties */}
      <section className="flex flex-col lg:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-sm font-semibold text-gray-600">Selected core duties</span>
          {!readOnly ? (
            <div className="flex items-center gap-2">
              {sameTitlePositions.length > 0 ? (
                <select
                  value={copyFrom}
                  onChange={(e) => {
                    setCopyMessage('');
                    if (
                      e.target.value &&
                      (selectedDnrs.core.length === 0 ||
                        window.confirm('Replace the selected duties with the ones of that position?'))
                    )
                      setCopyFrom(e.target.value);
                  }}
                  className="py-1.5 pl-2 pr-8 text-xs border rounded-md"
                  title="Copy duties, competencies and percentages from a position with the same title"
                >
                  <option value="">Copy from same title…</option>
                  {sameTitlePositions.map((p) => (
                    <option key={p.positionId} value={p.positionId}>
                      {p.itemNumber} {p.employeeName ? `· ${p.employeeName}` : ''}
                    </option>
                  ))}
                </select>
              ) : null}
              <button
                type="button"
                onClick={spreadEvenly}
                disabled={selectedDnrs.core.length === 0}
                className="px-3 py-1.5 text-xs text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 disabled:opacity-40"
              >
                Split 100% evenly
              </button>
            </div>
          ) : null}
        </div>

        {loadingSource ? <LoadingVisual size={5} /> : null}
        {copyMessage ? <div className="px-3 py-2 mb-2 text-xs text-indigo-700 rounded bg-indigo-50">{copyMessage}</div> : null}

        <div className="flex-1 border rounded-lg">
          {selectedDnrs.core.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              Pick duties from the list on the left
            </div>
          ) : (
            <div className="divide-y max-h-[24rem] overflow-y-auto">
              {selectedDnrs.core.map((dr, index) => (
                <div key={dr.odrId} className="grid grid-cols-12 gap-2 p-3">
                  <div className="col-span-12 text-sm text-gray-700 md:col-span-6">
                    <span className="mr-1 text-gray-400">{index + 1}.</span>
                    {dr.description}
                  </div>
                  <div className="col-span-8 md:col-span-4">
                    {loadingCompetencies ? (
                      <LoadingVisual size={5} />
                    ) : (
                      <select
                        value={dr.competency?.pcplId ?? ''}
                        disabled={readOnly}
                        onChange={(e) =>
                          updateSelected(dr.odrId, {
                            competency: competencies.find((c) => c.pcplId === e.target.value) ?? ({} as Competency),
                          })
                        }
                        className={`w-full py-1.5 pl-2 pr-7 text-xs border rounded-md ${
                          hasCompetency(dr) ? 'border-gray-300' : 'border-red-300 bg-red-50'
                        }`}
                      >
                        <option value="">Select competency…</option>
                        {competencies.map((c) => (
                          <option key={c.pcplId} value={c.pcplId}>
                            {c.code} · {c.name} ({c.level})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="flex items-center col-span-4 gap-1 md:col-span-2">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      disabled={readOnly}
                      value={dr.percentage || ''}
                      onChange={(e) => updateSelected(dr.odrId, { percentage: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                      className={`w-full py-1.5 px-2 text-xs text-right border rounded-md ${
                        Number(dr.percentage) > 0 ? 'border-gray-300' : 'border-red-300 bg-red-50'
                      }`}
                    />
                    <span className="text-xs text-gray-500">%</span>
                    {!readOnly ? (
                      <button type="button" onClick={() => unselect(dr)} title="Remove" className="ml-1 text-gray-400 hover:text-red-500">
                        <i className="bx bx-x" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* total + checks */}
        <div className="mt-3">
          <div className="flex justify-between mb-1 text-xs text-gray-600">
            <span>Total</span>
            <span className={total === 100 ? 'text-green-600 font-semibold' : total > 100 ? 'text-red-600 font-semibold' : ''}>
              {total}% / 100%
            </span>
          </div>
          <div className="w-full h-2 overflow-hidden bg-gray-100 rounded-full">
            <div
              className={`h-2 rounded-full ${total === 100 ? 'bg-green-500' : total > 100 ? 'bg-red-500' : 'bg-indigo-400'}`}
              style={{ width: `${Math.min(total, 100)}%` }}
            />
          </div>
          {!readOnly && problems.length > 0 ? (
            <ul className="mt-2 text-xs text-red-600 list-disc list-inside">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : !readOnly ? (
            <div className="mt-2 text-xs text-green-600">Ready — click Confirm to review and save.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
};
