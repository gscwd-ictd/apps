/* eslint-disable @nx/enforce-module-boundaries */
import { useLeaveStore } from '../../../../src/store/leave.store';
import { EmployeeLeave } from '../../../../../../libs/utils/src/lib/types/leave-application.type';
import dayjs from 'dayjs';
import { LeaveName, LeaveStatus } from 'libs/utils/src/lib/enums/leave.enum';

type AllLeaveListTabProps = {
  leaves: Array<EmployeeLeave>;
  tab: number;
};

export const AllLeavesListTab = ({ leaves, tab }: AllLeaveListTabProps) => {
  //zustand initialization to access pass slip store
  const {
    pendingLeaveModalIsOpen,
    completedLeaveModalIsOpen,
    setLeaveId,

    setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen,
  } = useLeaveStore((state) => ({
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    completedLeaveModalIsOpen: state.completedLeaveModalIsOpen,

    setLeaveId: state.setLeaveId,
    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setCompletedLeaveModalIsOpen: state.setCompletedLeaveModalIsOpen,
  }));

  const OnSelect = (leaveId: string) => {
    setLeaveId(leaveId);
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
        <ul className={'mt-4 lg:mt-0'}>
          {leaves.map((leave: EmployeeLeave, index: number) => {
            return (
              <li
                key={index}
                onClick={() => OnSelect(leave.id)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-lg text-gray-600">{leave.leaveName}</h1>

                  <p className="text-sm text-gray-500">No. of Days: {leave.leaveDates.length}</p>
                  <p className="text-sm text-gray-500">
                    Dates:{' '}
                    {leave.leaveName === LeaveName.MATERNITY ||
                    leave.leaveName === LeaveName.STUDY ||
                    leave.leaveName === LeaveName.REHABILITATION ||
                    leave.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                    leave.leaveName === LeaveName.ADOPTION
                      ? `${leave.leaveDates[0]} - ${leave.leaveDates[leave.leaveDates.length - 1]}`
                      : leave.leaveDates.join(', ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date Applied: {dayjs(leave.dateOfFiling).format('MMMM DD, YYYY')}
                  </p>
                  <p className="text-sm text-indigo-500">Status: {leave.status.toUpperCase()}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">
            No {tab === 1 ? 'pending leave application list' : tab === 2 ? 'completed leave application list' : ''} at
            the moment
          </h1>
        </div>
      )}
    </>
  );
};
