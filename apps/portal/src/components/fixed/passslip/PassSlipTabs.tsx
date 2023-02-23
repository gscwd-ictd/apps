import { HiOutlineCheckCircle, HiCheck } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { TabHeader } from '../tab/TabHeader';

type PassSlipTabsProps = {
  tab: number;
};

export const PassSlipTabs = ({ tab }: PassSlipTabsProps) => {
  const setTab = usePassSlipStore((state) => state.setTab);
  const pendingPassSlipList = usePassSlipStore(
    (state) => state.pendingPassSlipList
  );

  const fulfilledPassSlipList = usePassSlipStore(
    (state) => state.fulfilledPassSlipList
  );

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
            title="Pending Pass Slips"
            icon={<HiOutlineCheckCircle size={26} />}
            subtitle="Show all pending Pass Slips you applied for"
            notificationCount={
              pendingPassSlipList ? pendingPassSlipList.length : 0
            }
            className="bg-indigo-500"
          />
          <TabHeader
            tab={tab}
            tabIndex={2}
            onClick={() => {
              // setIsLoading(true);
              setTab(2);
            }}
            title="Completed Pass Slips"
            icon={<HiCheck size={26} />}
            subtitle="Show all fulfilled Pass Slip applications"
            notificationCount={
              fulfilledPassSlipList ? fulfilledPassSlipList.length : 0
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
