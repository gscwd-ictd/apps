import { useLeaveStore } from '../../../../src/store/leave.store';
import { HiOutlineCheckCircle, HiCheck } from 'react-icons/hi';
import { TabHeader } from '../tab/TabHeader';

type LeavesTabsProps = {
  tab: number;
};

export const LeavesTabs = ({ tab }: LeavesTabsProps) => {
  const setTab = useLeaveStore((state) => state.setTab);
  const pendingLeaveList = useLeaveStore((state) => state.pendingLeaveList);

  const fulfilledLeaveList = useLeaveStore((state) => state.fulfilledLeaveList);

  return (
    <>
      <div className="w-full h-[44rem] px-5 overflow-y-auto">
        <ul className="flex flex-col text-gray-500">
          <TabHeader
            tab={tab}
            tabIndex={1}
            onClick={() => {
              // setIsLoading(true);
              setTab(1);
            }}
            title="Pending Leave Application"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all pendings Leaves you applied for"
            notificationCount={pendingLeaveList ? pendingLeaveList.length : 0}
            className="bg-indigo-500"
          />
          <TabHeader
            tab={tab}
            tabIndex={2}
            onClick={() => {
              // setIsLoading(true);
              setTab(2);
            }}
            title="Completed Leave Applications"
            icon={<HiCheck size={26} />}
            subtitle="Show all fulfilled Leave applications"
            notificationCount={
              fulfilledLeaveList ? fulfilledLeaveList.length : 0
            }
            className="bg-gray-500"
          />
        </ul>
      </div>
    </>
  );
};

{
  /* <div className="flex justify-center pt-20"><h1 className="text-4xl text-gray-300">No pending endorsement list at the moment</h1></div> */
}
