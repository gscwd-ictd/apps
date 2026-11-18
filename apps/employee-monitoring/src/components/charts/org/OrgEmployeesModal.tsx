/* eslint-disable @nx/enforce-module-boundaries */
import { useMemo } from 'react';
import useSWR from 'swr';
import { LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import fetcherEMS from '../../../utils/fetcher/FetcherEMS';
import { ChartTabConfig, EmployeeCount, OrgLevel, PASS_SLIP_CATEGORIES } from './chart-config';
import { EmployeeCountTable, toEmployeeRows } from './EmployeeCountTable';

export type SelectedOrg = { orgId: string; orgCode: string; orgName: string; category?: string | null };

type Props = {
  config: ChartTabConfig;
  level: OrgLevel;
  levelLabel: string;
  year: number;
  org: SelectedOrg | null;
  setOrg: (org: SelectedOrg | null) => void;
};

/** clicked bar -> number of <unit> per employee of that office / department / division */
export const OrgEmployeesModal = ({ config, level, levelLabel, year, org, setOrg }: Props) => {
  const params = new URLSearchParams({ level, year: String(year) });
  if (org) params.set('orgId', org.orgId);
  if (org?.category) params.set('category', org.category);

  const { data, isLoading, error } = useSWR(org ? `/stats/charts/${config.type}/employees?${params}` : null, fetcherEMS, {
    revalidateOnFocus: false,
  });

  const rows = useMemo(() => toEmployeeRows((data?.data ?? []) as EmployeeCount[]), [data]);
  const categoryLabel = org?.category ? PASS_SLIP_CATEGORIES.find((c) => c.value === org.category)?.label ?? org.category : '';
  const what = `${categoryLabel ? `${org?.category} ` : ''}${config.unit}`;

  return (
    <Modal open={!!org} setOpen={(open: boolean) => !open && setOrg(null)} size="lg">
      <Modal.Header withCloseBtn>
        <div className="flex justify-between text-2xl font-semibold text-gray-800">
          <span className="px-5">
            {what} — {org?.orgCode}
            <span className="block text-sm font-normal text-gray-500">
              {org?.orgName} · {year}
            </span>
          </span>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center"
            onClick={() => setOrg(null)}
          >
            <i className="bx bx-x"></i>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="w-full min-h-[14rem] px-5 py-2">
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : error ? (
            <p className="text-sm text-red-500">Could not load the employees. Please try again.</p>
          ) : (
            <EmployeeCountTable
              rows={rows}
              countLabel={`No. of ${what}`}
              orgLabel={levelLabel}
              excelTitle={[`${what.toUpperCase()} PER EMPLOYEE`, `${org?.orgName ?? ''} (${org?.orgCode ?? ''})`, `Year ${year}`]}
              excelFileName={`${what} ${org?.orgCode ?? ''} ${year}`}
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <></>
      </Modal.Footer>
    </Modal>
  );
};
