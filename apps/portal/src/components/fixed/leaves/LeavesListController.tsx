import LeaveApplicationModal from './LeaveApplicationModal';
import LeaveInfoModal from './LeaveInfoModal';

type LeavesModalControllerProps = {
  page: number;
};

export const LeavesModalController = ({ page }: LeavesModalControllerProps) => {
  return (
    <div className="max-h-[90%] overflow-x-hidden overflow-y-auto">
      <>
        {page === 2 && <LeaveApplicationModal />}
        {page === 1 && <LeaveInfoModal />}
        {page === 3 && <LeaveInfoModal />}
      </>
    </div>
  );
};
