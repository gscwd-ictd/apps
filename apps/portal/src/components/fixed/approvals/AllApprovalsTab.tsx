import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { PassSlip } from '../../../types/passslip.type';
import { LeaveApplication } from '../../../../src/types/leave.type';
import { useApprovalStore } from '../../../../src/store/approvals.store';

type AllApprovalListTabProps = {
  passslips: Array<PassSlip> | null;
  leaves: Array<LeaveApplication> | null;
  tab: number;
};

export const AllApprovalsTab = ({
  passslips,
  leaves,
  tab,
}: AllApprovalListTabProps) => {
  const modal = useApprovalStore((state) => state.modal);
  const setModal = useApprovalStore((state) => state.setModal);

  const setSelectedPassSlip = useApprovalStore(
    (state) => state.setSelectedPassSlip
  );

  const setSelectedPassSlipId = useApprovalStore(
    (state) => state.setSelectedPassSlipId
  );

  const setSelectedLeave = useApprovalStore((state) => state.setSelectedLeave);

  const setSelectedLeaveId = useApprovalStore(
    (state) => state.setSelectedLeaveId
  );

  const setAction = useApprovalStore((state) => state.setAction);

  const onSelectPassSlip = (passslip: PassSlip) => {
    setSelectedPassSlip(passslip);
    // setSelectedPassSlipId(passslip.id);
    if (tab === 1) {
      // PENDING APPROVAL PASS SLIP
      if (!modal.isOpen) {
        setAction('Apply Action');
        setModal({
          ...modal,
          page: 1,
          isOpen: true,
          title: 'Pass Slip Approval',
        });
      }
    } else if (tab === 3) {
      // APPROVED PASS SLIP
      if (!modal.isOpen) {
        setAction('View');
        setModal({
          ...modal,
          page: 2,
          isOpen: true,
          title: 'Approved Pass Slip',
        });
      }
    } else if (tab === 5) {
      // DISAPPROVED PASS SLIP
      if (!modal.isOpen) {
        setAction('View');
        setModal({
          ...modal,
          page: 2,
          isOpen: true,
          title: 'Disapproved Pass Slip',
        });
      }
    }
  };

  const onSelectLeave = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setSelectedLeaveId(leave.id);
    console.log(leave);
    if (tab === 2) {
      // PENDING APPROVAL LEAVES
      if (!modal.isOpen) {
        setAction('Apply Action');
        setModal({ ...modal, page: 3, isOpen: true, title: 'Leave Approval' });
      }
    } else if (tab === 4) {
      // APPROVED LEAVES
      if (!modal.isOpen) {
        setAction('View');
        setModal({ ...modal, page: 4, isOpen: true, title: 'Approved Leave' });
      }
    } else if (tab === 6) {
      // DISAPPROVED LEAVES
      if (!modal.isOpen) {
        setAction('View');
        setModal({
          ...modal,
          page: 4,
          isOpen: true,
          title: 'Disapproved Leave',
        });
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
                  <h1 className="font-medium text-xl text-gray-600">
                    {item.natureOfBusiness}
                  </h1>
                  {/* <p className="text-md text-gray-500"></p> */}
                  <p className="text-sm text-gray-500">
                    {/* Estimated Hours: {item.estimatedHours} */}
                  </p>
                  <p className="text-xs text-gray-500">
                    {/* Purpose: {item.purpose} */}
                  </p>
                  <p className="text-sm text-indigo-500">
                    {/* Fulfilled on {dayjs(item.date).format('MMMM d, YYYY')} */}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : leaves && leaves.length > 0 ? (
        <ul className="mt-4">
          {leaves.map((item: LeaveApplication, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelectLeave(item)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-xl text-gray-600">
                    {item.typeOfLeave}
                  </h1>
                  {/* <p className="text-md text-gray-500"></p> */}
                  <p className="text-sm text-gray-500">
                    Employee: {item.firstName} {item.middleName} {item.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Days: {item.numberOfWorkingDays}
                  </p>
                  <p className="text-sm text-indigo-500">
                    Filed on {dayjs(item.dateOfFiling).format('MMMM d, YYYY')}
                  </p>
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
              ? 'pending approval'
              : tab === 2
              ? 'pending approval'
              : 'data'}{' '}
            at the moment
          </h1>
        </div>
      )}
    </>
  );
};
