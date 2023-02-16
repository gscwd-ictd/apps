import { useRouter } from 'next/router';
import { LeaveApplication } from '../../../../src/types/leave.type';
import { useLeaveStore } from '../../../../src/store/leave.store';

type AllLeaveListTabProps = {
  leaves: Array<LeaveApplication>;
  tab: number;
};

export const AllLeavesListTab = ({ leaves, tab }: AllLeaveListTabProps) => {
  const router = useRouter();

  const modal = useLeaveStore((state) => state.modal);

  const setSelectedLeave = useLeaveStore((state) => state.setSelectedLeave);

  const setModal = useLeaveStore((state) => state.setModal);

  const setSelectedLeaveId = useLeaveStore((state) => state.setSelectedLeaveId);

  const selectedLeaveId = useLeaveStore((state) => state.selectedLeaveId);

  const setAction = useLeaveStore((state) => state.setAction);

  const onSelect = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setSelectedLeaveId(leave.id);
    if (tab === 1) {
      if (!modal.isOpen) {
        setAction('Cancel Leave Application');
        setModal({ ...modal, page: 1, isOpen: true });
      }
    } else if (tab === 2) {
      if (!modal.isOpen) {
        setAction('View');
        setModal({ ...modal, page: 1, isOpen: true });
      }
    }
  };

  return (
    <>
      {leaves && leaves.length > 0 ? (
        <ul className="mt-4">
          {leaves.map((leave: LeaveApplication, index: number) => {
            return (
              <li
                key={index}
                onClick={() => onSelect(leave)}
                className="flex bg-white rounded-xl rounded-tr-none rounded-bl-none border-b border-b-gray-200 hover:bg-indigo-50 cursor-pointer items-center justify-between px-5 py-4 transition-colors ease-in-out"
              >
                <div className=" w-full py-2 px-1 ">
                  <h1 className="font-medium text-xl text-gray-600">
                    {leave.typeOfLeave}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Date of Filing: {leave.dateOfFiling}
                  </p>
                  <p className="text-xs text-gray-500">
                    Working Days: {leave.numberOfWorkingDays}
                  </p>
                  <p className="text-xs text-gray-500">
                    Location: {leave.detailsOfLeave.location}
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
