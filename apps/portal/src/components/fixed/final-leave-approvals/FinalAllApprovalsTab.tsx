/* eslint-disable @nx/enforce-module-boundaries */
import { SupervisorLeaveDetails } from '../../../../../../libs/utils/src/lib/types/leave-application.type';
import { useFinalLeaveApprovalStore } from 'apps/portal/src/store/final-leave-approvals.store';
import { LeaveName } from 'libs/utils/src/lib/enums/leave.enum';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type AllApprovalListTabProps = {
  leaves: Array<SupervisorLeaveDetails> | null;
  tab: number;
};

export const FinalAllApprovalsTab = ({ leaves, tab }: AllApprovalListTabProps) => {
  const {
    pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen,

    setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen,

    setLeaveIndividualDetail,
  } = useFinalLeaveApprovalStore((state) => ({
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen: state.approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen: state.disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen: state.cancelledLeaveModalIsOpen,

    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen: state.setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen: state.setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen: state.setCancelledLeaveModalIsOpen,

    setLeaveIndividualDetail: state.setLeaveIndividualDetail,
  }));

  const onSelectLeave = (leave: SupervisorLeaveDetails) => {
    setLeaveIndividualDetail(leave);
    if (tab === 1) {
      // PENDING APPROVAL LEAVES
      if (!pendingLeaveModalIsOpen) {
        setPendingLeaveModalIsOpen(true);
      }
    } else if (tab === 2) {
      // APPROVED LEAVES
      if (!approvedLeaveModalIsOpen) {
        setApprovedLeaveModalIsOpen(true);
      }
    } else if (tab === 3) {
      // DISAPPROVED LEAVES
      if (!disapprovedLeaveModalIsOpen) {
        setDisapprovedLeaveModalIsOpen(true);
      }
    } else if (tab === 4) {
      // DISAPPROVED LEAVES
      if (!cancelledLeaveModalIsOpen) {
        setCancelledLeaveModalIsOpen(true);
      }
    }
  };

  return (
    <>
      {leaves && leaves.length > 0 ? (
        <ul className={'mt-4 lg:mt-0'}>
          {leaves.map((item: SupervisorLeaveDetails, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelectLeave(item)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-lg text-gray-600">
                    {item.leaveName} - {item.employee.employeeName}
                  </h1>
                  <p className="text-sm text-gray-500">No. of Days: {item.leaveDates.length}</p>
                  <p className="text-sm text-gray-500">
                    Dates:{' '}
                    {item.leaveName === LeaveName.MATERNITY ||
                    item.leaveName === LeaveName.STUDY ||
                    item.leaveName === LeaveName.REHABILITATION ||
                    item.leaveName === LeaveName.SPECIAL_LEAVE_BENEFITS_FOR_WOMEN ||
                    item.leaveName === LeaveName.ADOPTION
                      ? `${item.leaveDates[0]} - ${item.leaveDates[item.leaveDates.length - 1]}`
                      : item.leaveDates.join(', ')}
                  </p>
                  <p className="text-sm text-indigo-500">Date Applied: {DateFormatter(item.dateOfFiling)}</p>
                  <p className="text-sm text-indigo-500">Status: {item.status.toUpperCase()}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">No {tab === 1 ? 'pending approval' : 'data'} at the moment</h1>
        </div>
      )}
    </>
  );
};
