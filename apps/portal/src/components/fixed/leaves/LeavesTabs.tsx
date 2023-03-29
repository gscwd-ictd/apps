import { useLeaveStore } from '../../../../src/store/leave.store';
import { HiOutlineCheckCircle, HiCheck } from 'react-icons/hi';
import { TabHeader } from '../tab/TabHeader';

type LeavesTabsProps = {
  tab: number;
};

export const LeavesTabs = ({ tab }: LeavesTabsProps) => {
  //zustand initialization to access leave store
  const { leavesOnGoing, leavesCompleted, setTab } = useLeaveStore((state) => ({
    leavesOnGoing: state.leaves.onGoing,
    leavesCompleted: state.leaves.completed,
    setTab: state.setTab,
  }));

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
            title="Ongoing Leave Application"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all ongoing Leaves you applied for"
            notificationCount={leavesOnGoing ? leavesOnGoing.length : 0}
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
            notificationCount={leavesCompleted ? leavesCompleted.length : 0}
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
