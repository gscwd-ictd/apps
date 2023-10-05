import { HiOutlineCheckCircle, HiCheck } from 'react-icons/hi';
import { TabHeader } from '../tab/TabHeader';
import { useOvertimeAccomplishmentStore } from 'apps/portal/src/store/overtime-accomplishment.store';

type TabsProps = {
  tab: number;
};

export const OvertimeAccomplishmentTabs = ({ tab }: TabsProps) => {
  //zustand initialization to access leave store
  const { OvertimeForApproval, overtimeCompleted, setTab } = useOvertimeAccomplishmentStore((state) => ({
    OvertimeForApproval: state.overtime.forApproval,
    overtimeCompleted: state.overtime.completed,
    setTab: state.setTab,
  }));

  return (
    <>
      <div className={`lg:h-auto lg:pt-0 lg:pb-10 h-full py-4 w-full px-5 overflow-y-auto`}>
        <ul className="flex flex-col md:flex-row lg:flex-col text-gray-500">
          <TabHeader
            tab={tab}
            tabIndex={1}
            onClick={() => {
              setTab(1);
            }}
            title="Pending Accomplishments"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show pending Overtime Accomplishments"
            notificationCount={OvertimeForApproval ? OvertimeForApproval.length : 0}
            className="bg-indigo-500"
          />
          <TabHeader
            tab={tab}
            tabIndex={2}
            onClick={() => {
              setTab(2);
            }}
            title="Completed Accomplishments"
            icon={<HiCheck size={26} />}
            subtitle="Show fulfilled Overtime Accomplishments"
            notificationCount={overtimeCompleted ? overtimeCompleted.length : 0}
            className="bg-gray-500"
          />
        </ul>
      </div>
    </>
  );
};
