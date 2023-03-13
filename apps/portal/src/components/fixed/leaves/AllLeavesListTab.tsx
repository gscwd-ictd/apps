import { useRouter } from 'next/router';
import { Leave, LeaveContents } from '../../../../src/types/leave.type';
import { useLeaveStore } from '../../../../src/store/leave.store';

type AllLeaveListTabProps = {
  leaves: Array<Leave>;
  tab: number;
};

export const AllLeavesListTab = ({ leaves, tab }: AllLeaveListTabProps) => {
  //zustand initialization to access pass slip store
  const {
    pendingLeaveModalIsOpen,
    completedLeaveModalIsOpen,
    getLeaveIndividual,
    setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen,
  } = useLeaveStore((state) => ({
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    completedLeaveModalIsOpen: state.completedLeaveModalIsOpen,
    getLeaveIndividual: state.getLeaveIndividual,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen: state.setCompletedLeaveModalIsOpen,
  }));

  const onSelect = (leave: Leave) => {
    // getLeaveIndividual(leave);
    if (tab === 1) {
      if (!pendingLeaveModalIsOpen) {
        setPendingLeaveModalIsOpen(true);
      }
    } else if (tab === 2) {
      if (!completedLeaveModalIsOpen) {
        setCompletedLeaveModalIsOpen(true);
      }
    }
  };

  return (
    <>
      {leaves && leaves.length > 0 ? (
        <ul className="mt-4">
          {leaves.map((leave: Leave, index: number) => {
            return (
              <li
                key={index}
                // onClick={() => onSelect(leaves)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-xl text-gray-600">
                    {leave.leaveName}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Date of Filing: {leave.dateOfFiling}
                  </p>
                  <p className="text-xs text-gray-500">
                    Working Days: {leave.leaveDates}
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {leave.status}
                  </p>
                  {/* <p className="text-sm text-indigo-500">Fulfilled on {dayjs(item.postingDate).format('MMMM d, YYYY')}</p> */}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">
            No{' '}
            {tab === 1
              ? 'pending leave application list'
              : tab === 2
              ? 'completed leave application list'
              : ''}{' '}
            at the moment
          </h1>
        </div>
      )}
    </>
  );
};
