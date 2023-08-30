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
      <div
        className={`lg:h-auto lg:pt-0 lg:pb-10 h-full py-4 w-full px-5 overflow-y-auto`}
      >
        <ul className="flex flex-col md:flex-row lg:flex-col text-gray-500">
          <TabHeader
            tab={tab}
            tabIndex={1}
            onClick={() => {
              setTab(1);
            }}
            title="For Approval Leaves"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all for approval Leaves you applied for"
            notificationCount={leavesOnGoing ? leavesOnGoing.length : 0}
            className="bg-indigo-500"
          />
          <TabHeader
            tab={tab}
            tabIndex={2}
            onClick={() => {
              setTab(2);
            }}
            title="Completed Leaves"
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
