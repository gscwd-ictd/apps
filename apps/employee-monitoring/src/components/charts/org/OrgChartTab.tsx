/* eslint-disable @nx/enforce-module-boundaries */
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ActiveElement,
  ChartEvent,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { LoadingSpinner } from '@gscwd-apps/oneui';
import { LabelInput } from '../../inputs/LabelInput';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import {
  CHART_COLORS,
  ChartTabConfig,
  EmployeeCount,
  ORG_LEVELS,
  OrgCount,
  OrgLevel,
  selectClass,
} from './chart-config';
import { OrgEmployeesModal, SelectedOrg } from './OrgEmployeesModal';
import { EmployeeCountTable, toEmployeeRows } from './EmployeeCountTable';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const fmt = (d: string) => dayjs(d).format('MMM DD, YYYY');

type OrgBar = { orgId: string; orgCode: string; orgName: string; total: number; byCategory: Record<string, number> };

/** one tab of the Charts page: filters, interactive bar chart, optional modal and top-employees table */
export const OrgChartTab = ({ config }: { config: ChartTabConfig }) => {
  const [level, setLevel] = useState<OrgLevel>('department');
  // default: January 1 of this year to today
  const [dateFrom, setDateFrom] = useState<string>(dayjs().startOf('year').format('YYYY-MM-DD'));
  const [dateTo, setDateTo] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const validRange = !!dateFrom && !!dateTo && dateFrom <= dateTo;
  const period = validRange ? `${fmt(dateFrom)} - ${fmt(dateTo)}` : '';
  const [sort, setSort] = useState<'count' | 'name'>('count');
  const [topCategory, setTopCategory] = useState<string>('');
  const [selectedOrg, setSelectedOrg] = useState<SelectedOrg | null>(null);
  const levelLabel = ORG_LEVELS.find((l) => l.value === level)?.label ?? '';

  const query = `level=${level}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
  const { data, isLoading, error } = useSWR(validRange ? `/stats/charts/${config.type}?${query}` : null, fetcherEMS, {
    revalidateOnFocus: false,
  });
  const { data: topData, isLoading: topLoading } = useSWR(
    config.topTable && validRange ? `/stats/charts/${config.type}/employees?${query}` : null,
    fetcherEMS,
    { revalidateOnFocus: false }
  );

  // per org (categories summed for the total)
  const bars: OrgBar[] = useMemo(() => {
    const map = new Map<string, OrgBar>();
    ((data?.data ?? []) as OrgCount[]).forEach((r) => {
      const bar = map.get(r.orgId) ?? {
        orgId: r.orgId,
        orgCode: r.orgCode,
        orgName: r.orgName,
        total: 0,
        byCategory: {},
      };
      bar.total += r.count;
      const cat = config.stacked ? r.category ?? '' : ''; // unstacked: one bar per org (LWOP rows carry a category)
      bar.byCategory[cat] = (bar.byCategory[cat] ?? 0) + r.count;
      map.set(r.orgId, bar);
    });
    return Array.from(map.values()).sort((a, b) =>
      sort === 'count' ? b.total - a.total || a.orgCode.localeCompare(b.orgCode) : a.orgCode.localeCompare(b.orgCode)
    );
  }, [data, sort, config.stacked]);

  // stacked: one dataset per category (configured order first, then by total)
  const categories: string[] = useMemo(() => {
    if (!config.stacked) return [''];
    const totals: Record<string, number> = {};
    bars.forEach((b) => Object.entries(b.byCategory).forEach(([c, n]) => (totals[c] = (totals[c] ?? 0) + n)));
    const fixed = (config.categories ?? []).map((c) => c.value).filter((c) => totals[c]);
    return [
      ...fixed,
      ...Object.keys(totals)
        .filter((c) => !fixed.includes(c))
        .sort((a, b) => totals[b] - totals[a]),
    ];
  }, [bars, config]);

  const chartData = {
    labels: bars.map((b) => b.orgCode),
    datasets: categories.map((cat, i) => ({
      label: cat || `No. of ${config.unit}`,
      data: bars.map((b) => b.byCategory[cat] ?? 0),
      borderColor: `rgb(${CHART_COLORS[i % CHART_COLORS.length]})`,
      backgroundColor: `rgba(${CHART_COLORS[i % CHART_COLORS.length]},0.95)`,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: !!config.stacked, ticks: { autoSkip: false, maxRotation: 60, minRotation: 0 } },
      y: { stacked: !!config.stacked, beginAtZero: true, ticks: { precision: 0 } },
    },
    plugins: {
      legend: { position: 'top', display: !!config.stacked },
      title: { display: true, text: `${config.unit} per ${levelLabel} (${period})` },
      tooltip: {
        callbacks: {
          title: (items) =>
            items[0] ? `${bars[items[0].dataIndex]?.orgName} (${bars[items[0].dataIndex]?.orgCode})` : '',
          footer: (items) => (config.stacked && items[0] ? `Total: ${bars[items[0].dataIndex]?.total ?? 0}` : ''),
        },
      },
    },
    onHover: (event: ChartEvent, elements: ActiveElement[]) => {
      const target = event.native?.target as HTMLElement | undefined;
      if (target) target.style.cursor = config.clickModal && elements.length ? 'pointer' : 'default';
    },
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      if (!config.clickModal || !elements.length) return;
      const bar = bars[elements[0].index];
      if (!bar) return;
      const category = config.stacked ? categories[elements[0].datasetIndex] : null;
      setSelectedOrg({ orgId: bar.orgId, orgCode: bar.orgCode, orgName: bar.orgName, category });
    },
  };

  const topRows = useMemo(
    () => toEmployeeRows((topData?.data ?? []) as EmployeeCount[], topCategory || undefined),
    [topData, topCategory]
  );
  const topCategoryLabel = config.categories?.find((c) => c.value === topCategory)?.label;

  return (
    <div className="flex flex-col gap-5">
      {/* filters */}
      <div className="flex flex-row flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">{config.note}</p>
        <div className="flex flex-row flex-wrap items-end gap-2">
          <select
            title="Group by"
            value={level}
            onChange={(e) => setLevel(e.target.value as OrgLevel)}
            className={selectClass}
          >
            {ORG_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                Per {l.label}
              </option>
            ))}
          </select>
          <select
            title="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as 'count' | 'name')}
            className={selectClass}
          >
            <option value="count">Highest count first</option>
            <option value="name">Alphabetical (code)</option>
          </select>
          <LabelInput
            id="dateFrom"
            label="Date from"
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <LabelInput
            id="dateTo"
            label="Date to"
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {/* chart */}
      <div className="flex flex-col w-full p-5 bg-white border rounded shadow">
        {!validRange ? (
          <p className="text-sm text-red-500">Date from must be on or before date to.</p>
        ) : isLoading ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <p className="text-sm text-red-500">Could not load the chart. Please try again.</p>
        ) : bars.length === 0 ? (
          <p className="py-10 text-sm text-center text-gray-500">
            No {config.unit.toLowerCase()} from {period}.
          </p>
        ) : (
          <>
            {/* fills the screen below the tabs and filters (never shorter than 26rem) */}
            <div className="relative w-full h-[calc(100vh-18rem)] min-h-[26rem]">
              <Bar data={chartData} options={options} />
            </div>
            {config.clickModal ? (
              <p className="mt-2 text-xs text-center text-gray-400">
                <i className="bx bx-pointer"></i> Click a bar to see the count per employee.
              </p>
            ) : null}
          </>
        )}
      </div>

      {/* top employees */}
      {config.topTable ? (
        <div className="flex flex-col w-full gap-2 p-5 bg-white border rounded shadow">
          <div className="flex flex-row flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-gray-700">
              Employees with the Highest {topCategoryLabel ? `${topCategory} ` : ''}
              {config.unit} ({period})
            </span>
            {config.categories?.length ? (
              <select
                title="Sort by"
                value={topCategory}
                onChange={(e) => setTopCategory(e.target.value)}
                className={selectClass}
              >
                <option value="">Sort by Total</option>
                {config.categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    Sort by {c.label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
          {topLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <EmployeeCountTable
              rows={topRows}
              countLabel={`No. of ${config.unit}`}
              orgLabel={levelLabel}
              categories={config.categories}
              excelTitle={[
                `EMPLOYEES WITH THE HIGHEST ${(topCategory ? `${topCategory} ` : '') + config.unit.toUpperCase()}`,
                period,
              ]}
              excelFileName={`Top ${topCategoryLabel ? `${topCategoryLabel} ` : ''}${
                config.unit
              } ${dateFrom} to ${dateTo}`}
            />
          )}
        </div>
      ) : null}

      {config.clickModal ? (
        <OrgEmployeesModal
          config={config}
          level={level}
          levelLabel={levelLabel}
          dateFrom={dateFrom}
          dateTo={dateTo}
          period={period}
          org={selectedOrg}
          setOrg={setSelectedOrg}
        />
      ) : null}
    </div>
  );
};
