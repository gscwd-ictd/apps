// import LeaveApplicationModal from './LeaveApplicationModal';
<<<<<<< HEAD
// import LeaveInfoModal from './LeaveInfoModal';
=======
import LeaveInfoModal from './LeaveInfoModal';
>>>>>>> 95a8bdda4e29f2b3edb9f1385df961ceca883fee

type LeavesModalControllerProps = {
  page: number;
};

export const LeavesModalController = ({ page }: LeavesModalControllerProps) => {
  return (
    <div className="max-h-[90%] overflow-x-hidden overflow-y-auto">
      <>
<<<<<<< HEAD
        {/* {page === 1 && <LeaveApplicationModal />}
=======
        {/* {page === 1 && <LeaveApplicationModal />} */}
>>>>>>> 95a8bdda4e29f2b3edb9f1385df961ceca883fee
        {page === 2 && <LeaveInfoModal />}
        {page === 3 && <LeaveInfoModal />} */}
      </>
    </div>
  );
};
