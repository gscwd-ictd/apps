/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import { useApprovalStore } from '../../../../src/store/approvals.store';

import {
  EmployeeLeaveDetails,
  MonitoringLeave,
  SupervisorLeaveDetails,
} from '../../../../../../libs/utils/src/lib/types/leave-application.type';

type AllApprovalListTabProps = {
  leaves: Array<SupervisorLeaveDetails> | null;
  tab: number;
};

export const AllApprovalsTab = ({ leaves, tab }: AllApprovalListTabProps) => {
  const {
    pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen,

    setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen,

    setLeaveId,
  } = useApprovalStore((state) => ({
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen: state.approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen: state.disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen: state.cancelledLeaveModalIsOpen,

    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen: state.setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen: state.setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen: state.setCancelledLeaveModalIsOpen,

    setLeaveId: state.setLeaveId,
  }));

  const onSelectLeave = (leave: SupervisorLeaveDetails) => {
    setLeaveId(leave.id);
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
    }
  };

  return (
    <>
      {leaves && leaves.length > 0 ? (
        <ul className="mt-4">
          {leaves.map((item: SupervisorLeaveDetails, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelectLeave(item)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-lg text-gray-600">
                    {/* {item.leaveName} - {item.fullName} */}
                  </h1>
                  {/* <p className="text-md text-gray-500"></p> */}
                  <p className="text-sm text-gray-500">
                    Employee: {item.employee.employeeName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {/* Days: {item.leaveDates} */}
                  </p>
                  <p className="text-sm text-indigo-500">
                    Date Applied:{' '}
                    {dayjs(item.dateOfFiling).format('MMMM DD, YYYY')}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300">
            No {tab === 1 ? 'pending approval' : 'data'} at the moment
          </h1>
        </div>
      )}
    </>
  );
};
