import { HiOutlineTag, HiCheckCircle, HiOutlineCheckCircle, HiCheck } from 'react-icons/hi';
import { useAppEndStore } from '../../../store/endorsement.store';
import { TabHeader } from '../tab/TabHeader';

type AppEndTabsProps = {
    tab: number;
};

export const AppEndTabs = ({ tab }: AppEndTabsProps) => {
    const setTab = useAppEndStore((state) => state.setTab);
    const pendingPublicationList = useAppEndStore((state) => state.pendingPublicationList);

    const fulfilledPublicationList = useAppEndStore((state) => state.fulfilledPublicationList);

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
                        title="For Selection"
                        icon={<HiOutlineCheckCircle size={26} />}
                        subtitle="Show all endorsed publications that are for selection"
                        notificationCount={pendingPublicationList ? pendingPublicationList.length : 0}
                        className="bg-indigo-500"
                    />
                    <TabHeader
                        tab={tab}
                        tabIndex={2}
                        onClick={() => {
                            // setIsLoading(true);
                            setTab(2);
                        }}
                        title="Fulfilled"
                        icon={<HiCheck size={26} />}
                        subtitle="Show all fulfilled endorsed publications"
                        notificationCount={fulfilledPublicationList ? fulfilledPublicationList.length : 0}
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
