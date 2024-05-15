import { CardLeaveRequests } from '../cards/CardLeaveRequests';
import { CardOvertimeRequests } from '../cards/CardOvertimeRequests';
import { CardPassSlipRequests } from '../cards/CardPassSlipRequests';

export const PendingDashboard = () => {
  return (
    <div className="w-full grid-cols-3 gap-5 sm:flex sm:flex-col lg:flex lg:flex-row">
      {/**Card Leave Applications */}
      <div className="w-full h-[6rem] col-span-1">
        <CardLeaveRequests />
      </div>

      {/**Card Pending Overtime */}
      <div className="w-full h-[6rem] col-span-1">
        <CardOvertimeRequests />
      </div>

      {/**Card Pending Pass Slip */}
      <div className="w-full h-[6rem] col-span-1">
        <CardPassSlipRequests />
      </div>
    </div>
  );
};
