/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import { isEmpty } from 'lodash';
import { FunctionComponent } from 'react';
import { CardMiniStats } from './CardMiniStats';
import { useChartsStore } from '../../store/chart.store';

export const CardOvertimeRequests: FunctionComponent<{ isLoading: boolean }> = ({ isLoading }) => {
  // Zustand init
  const { OvertimeApplications } = useChartsStore((state) => ({
    OvertimeApplications: state.getDashboardStats.overtimeApplications,
  }));

  return (
    <>
      <CardMiniStats
        className="border rounded-md shadow hover:bg-slate-200 hover:cursor-pointer"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-10 h-10 rounded-full fill-white hover:bg-gradient-to-r bg-gradient-to-tl from-sky-800/90 via-sky-500/90 to-sky-800/90 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
              clipRule="evenodd"
            />
          </svg>
        }
        title="Overtime Applications"
        value={!isEmpty(OvertimeApplications) ? OvertimeApplications : 0}
        isLoading={isLoading}
      />
    </>
  );
};
