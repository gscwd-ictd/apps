import { HiOutlineCheckCircle, HiCheck } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { TabHeader } from '../tab/TabHeader';
// eslint-disable-next-line @nx/enforce-module-boundaries

type PassSlipTabsProps = {
  tab: number;
};

export const PassSlipTabs = ({ tab }: PassSlipTabsProps) => {
  //zustand initialization to access pass slip store
  const { passSlipsforApproval, passSlipsCompleted, setTab } = usePassSlipStore(
    (state) => ({
      passSlipsforApproval: state.passSlips.forApproval,
      passSlipsCompleted: state.passSlips.completed,
      setTab: state.setTab,
    })
  );

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
            title="For Approval Pass Slips"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all for approval Pass Slips you applied for"
            notificationCount={
              passSlipsforApproval ? passSlipsforApproval.length : 0
            }
            className="bg-indigo-500"
          />
          <TabHeader
            tab={tab}
            tabIndex={2}
            onClick={() => {
              setTab(2);
            }}
            title="Completed Pass Slips"
            icon={<HiCheck size={26} />}
            subtitle="Show all fulfilled Pass Slip applications"
            notificationCount={
              passSlipsCompleted ? passSlipsCompleted.length : 0
            }
            className="bg-gray-500"
          />
        </ul>
      </div>
    </>
  );
};
