/* eslint-disable @nx/enforce-module-boundaries */
import { isEmpty } from 'lodash';
import { CardLeaveRequests } from '../cards/CardLeaveRequests';
import { CardOvertimeRequests } from '../cards/CardOvertimeRequests';
import { CardPassSlipRequests } from '../cards/CardPassSlipRequests';
import { ToastNotification } from '@gscwd-apps/oneui';
import { useChartsStore } from '../../store/chart.store';

export const PendingDashboard = () => {
  // Zustand init
  const { ErrorDashboardStats, isLoading } = useChartsStore((state) => ({
    ErrorDashboardStats: state.errorDashboardStats,
    isLoading: state.loadingDashboardStats,
  }));

  return (
    <>
      {/* Error Notifications */}
      {!isEmpty(ErrorDashboardStats) ? (
        <ToastNotification toastType="error" notifMessage={'Network Error: Failed to retrieve data'} />
      ) : null}

      <div className="w-full grid-cols-3 gap-5 sm:flex sm:flex-col lg:flex lg:flex-row">
        {/**Card Leave Applications */}
        <div className="w-full h-[6rem] col-span-1">
          <CardLeaveRequests isLoading={isLoading} />
        </div>

        {/**Card Pending Overtime */}
        <div className="w-full h-[6rem] col-span-1">
          <CardOvertimeRequests isLoading={isLoading} />
        </div>

        {/**Card Pending Pass Slip */}
        <div className="w-full h-[6rem] col-span-1">
          <CardPassSlipRequests isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};
