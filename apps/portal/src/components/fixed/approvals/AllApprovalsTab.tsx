/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import { useApprovalStore } from '../../../../src/store/approvals.store';

import {
  EmployeeLeaveDetails,
  MonitoringLeave,
  SupervisorLeaveDetails,
} from '../../../../../../libs/utils/src/lib/types/leave-application.type';

import { PassSlip, PassSlipApplicationForm } from '../../../../../../libs/utils/src/lib/types/pass-slip.type';
import { LeaveName } from 'libs/utils/src/lib/enums/leave.enum';

type AllApprovalListTabProps = {
  passslips: Array<PassSlipApplicationForm> | null;
  leaves: Array<SupervisorLeaveDetails> | null;
  tab: number;
};

export const AllApprovalsTab = ({ passslips, leaves, tab }: AllApprovalListTabProps) => {
  const {
    pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen,
    pendingPassSlipModalIsOpen,
    approvedPassSlipModalIsOpen,
    disapprovedPassSlipModalIsOpen,
    cancelledPassSlipModalIsOpen,

    setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen,
    setPendingPassSlipModalIsOpen,
    setApprovedPassSlipModalIsOpen,
    setDisapprovedPassSlipModalIsOpen,
    setCancelledPassSlipModalIsOpen,

    setPassSlipIndividualDetail,
    setLeaveIndividualDetail,
  } = useApprovalStore((state) => ({
    pendingLeaveModalIsOpen: state.pendingLeaveModalIsOpen,
    approvedLeaveModalIsOpen: state.approvedLeaveModalIsOpen,
    disapprovedLeaveModalIsOpen: state.disapprovedLeaveModalIsOpen,
    cancelledLeaveModalIsOpen: state.cancelledLeaveModalIsOpen,

    pendingPassSlipModalIsOpen: state.pendingPassSlipModalIsOpen,
    approvedPassSlipModalIsOpen: state.approvedPassSlipModalIsOpen,
    disapprovedPassSlipModalIsOpen: state.disapprovedPassSlipModalIsOpen,
    cancelledPassSlipModalIsOpen: state.cancelledPassSlipModalIsOpen,

    setPendingLeaveModalIsOpen: state.setPendingLeaveModalIsOpen,
    setApprovedLeaveModalIsOpen: state.setApprovedLeaveModalIsOpen,
    setDisapprovedLeaveModalIsOpen: state.setDisapprovedLeaveModalIsOpen,
    setCancelledLeaveModalIsOpen: state.setCancelledLeaveModalIsOpen,

    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    setApprovedPassSlipModalIsOpen: state.setApprovedPassSlipModalIsOpen,
    setDisapprovedPassSlipModalIsOpen: state.setDisapprovedPassSlipModalIsOpen,
    setCancelledPassSlipModalIsOpen: state.setCancelledPassSlipModalIsOpen,
    setPassSlipIndividualDetail: state.setPassSlipIndividualDetail,
    setLeaveIndividualDetail: state.setLeaveIndividualDetail,
  }));

  const onSelectPassSlip = (passslip: PassSlip) => {
    setPassSlipIndividualDetail(passslip);
    // setSelectedPassSlipId(passslip.id);
    if (tab === 1) {
      // PENDING APPROVAL PASS SLIP
      if (!pendingPassSlipModalIsOpen) {
        setPendingPassSlipModalIsOpen(true);
      }
    } else if (tab === 3) {
      // APPROVED PASS SLIP
      if (!approvedPassSlipModalIsOpen) {
        setApprovedPassSlipModalIsOpen(true);
      }
    } else if (tab === 5) {
      // DISAPPROVED PASS SLIP
      if (!disapprovedPassSlipModalIsOpen) {
        setDisapprovedPassSlipModalIsOpen(true);
      }
    } else if (tab === 7) {
      // DISAPPROVED PASS SLIP
      if (!cancelledPassSlipModalIsOpen) {
        setCancelledPassSlipModalIsOpen(true);
      }
    }
  };

  const onSelectLeave = (leave: SupervisorLeaveDetails) => {
    setLeaveIndividualDetail(leave);
    if (tab === 2) {
      // PENDING APPROVAL LEAVES
      if (!pendingLeaveModalIsOpen) {
        setPendingLeaveModalIsOpen(true);
      }
    } else if (tab === 4) {
      // APPROVED LEAVES
      if (!approvedLeaveModalIsOpen) {
        setApprovedLeaveModalIsOpen(true);
      }
    } else if (tab === 6) {
      // DISAPPROVED LEAVES
      if (!disapprovedLeaveModalIsOpen) {
        setDisapprovedLeaveModalIsOpen(true);
      }
    } else if (tab === 8) {
      // DISAPPROVED LEAVES
      if (!cancelledLeaveModalIsOpen) {
        setCancelledLeaveModalIsOpen(true);
      }
    }
  };

  return (
    <>
      {passslips && passslips.length > 0 ? (
        <ul className="mt-4">
          {passslips.map((item: PassSlip, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelectPassSlip(item)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-lg text-gray-600">
                    {item.natureOfBusiness} - {item.employeeName}
                  </h1>
                  <p className="text-sm text-gray-500">Estimated Hours: {item.estimateHours}</p>
                  <p className="text-sm text-gray-500 break-words w-96">Purpose: {item.purposeDestination}</p>
                  <p className="text-sm text-gray-500">
                    Date Applied: {dayjs(item.dateOfApplication).format('MMMM DD, YYYY')}
                  </p>
                  <p className="text-sm text-indigo-500">Status: {item.status.toUpperCase()}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : leaves && leaves.length > 0 ? (
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
                  <p className="text-sm text-gray-500">
                    Date Applied: {dayjs(item.dateOfFiling).format('MMMM DD, YYYY')}
                  </p>
                  <p className="text-sm text-indigo-500">Status: {item.status.toUpperCase()}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex justify-center pt-20">
          <h1 className="text-4xl text-gray-300 text-center">
            No {tab === 1 ? 'pending approval' : tab === 2 ? 'pending approval' : 'data'} at the moment
          </h1>
        </div>
      )}
    </>
  );
};
