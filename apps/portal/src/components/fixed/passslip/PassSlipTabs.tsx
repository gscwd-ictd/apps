import { HiOutlineCheckCircle, HiCheck } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { TabHeader } from '../tab/TabHeader';

type PassSlipTabsProps = {
  tab: number;
};

export const PassSlipTabs = ({ tab }: PassSlipTabsProps) => {
  //zustand initialization to access pass slip store
  const { passSlipsOnGoing, passSlipsCompleted, setTab } = usePassSlipStore(
    (state) => ({
      passSlipsOnGoing: state.passSlips.onGoing,
      passSlipsCompleted: state.passSlips.completed,
      setTab: state.setTab,
    })
  );

  return (
    <>
      <div className="w-full h-[44rem] px-5 overflow-y-auto">
        <ul className="flex flex-col text-gray-500">
          <TabHeader
            tab={tab}
            tabIndex={1}
            onClick={() => {
              setTab(1);
            }}
            title="Ongoing Pass Slips"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all ongoing Pass Slips you applied for"
            notificationCount={passSlipsOnGoing ? passSlipsOnGoing.length : 0}
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
