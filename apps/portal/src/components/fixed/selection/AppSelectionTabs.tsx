import {
  HiBadgeCheck,
  HiOutlineBadgeCheck,
  HiOutlineTag,
} from 'react-icons/hi';
import { useAppSelectionStore } from '../../../store/selection.store';
import { TabHeader } from '../tab/TabHeader';

type AppSelectionTabsProps = {
  tab: number;
};

export const AppSelectionTabs = ({ tab }: AppSelectionTabsProps) => {
  const setTab = useAppSelectionStore((state) => state.setTab);
  const pendingPublicationList = useAppSelectionStore(
    (state) => state.pendingPublicationList
  );
  const fulfilledPublicationList = useAppSelectionStore(
    (state) => state.fulfilledPublicationList
  );

  return (
    <>
      <div
        className={`lg:h-auto lg:pt-0 lg:pb-10 max-h-[44rem] py-4 w-full px-5 overflow-y-auto`}
      >
        <ul className="flex flex-col text-gray-500">
          <TabHeader
            tab={tab}
            tabIndex={1}
            onClick={() => setTab(1)}
            icon={<HiOutlineBadgeCheck size={26} />}
            title="For Selection"
            subtitle="Show all publications that are for selection"
            notificationCount={
              pendingPublicationList ? pendingPublicationList.length : 0
            }
            className="bg-indigo-500"
          />
          <TabHeader
            tab={tab}
            tabIndex={2}
            onClick={() => setTab(2)}
            title="Fulfilled"
            icon={<HiBadgeCheck size={26} />}
            subtitle="Show all publications that are already fulfilled"
            notificationCount={
              fulfilledPublicationList ? fulfilledPublicationList.length : 0
            }
            className="bg-orange-500"
          />
        </ul>
      </div>
    </>
  );
};
