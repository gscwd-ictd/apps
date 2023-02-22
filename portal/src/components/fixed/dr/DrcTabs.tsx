import { HiCheck, HiOutlineCheckCircle } from "react-icons/hi"
import { useDrStore } from "../../../store/dr.store"
import { TabHeader } from "../tab/TabHeader"

type DrcTabsProps = {
    tab: number
}

export const DrcTabs = ({ tab }: DrcTabsProps) => {

    const setTab = useDrStore(state => state.setTab)

    const pendingPositions = useDrStore((state) => state.pendingPositions)

    const fulfilledPositions = useDrStore((state) => state.fulfilledPositions)

    return (<>
        <div className="w-full h-[44rem] px-5 overflow-y-auto">
            <ul className="flex flex-col text-gray-500">
                <TabHeader
                    tab={tab}
                    tabIndex={1}
                    onClick={() => {
                        // setIsLoading(true);
                        setTab(1);
                    }}
                    title="Positions for selection"
                    icon={<HiOutlineCheckCircle size={26} />}
                    subtitle="Show all positions that are for DRC setting"

                    notificationCount={pendingPositions ? pendingPositions.length : 0}
                    className='bg-red-500'
                />
                <TabHeader
                    tab={tab}
                    tabIndex={2}
                    onClick={() => {
                        // setIsLoading(true);
                        setTab(2);
                    }}
                    title="Fulfilled positions"
                    icon={<HiCheck size={26} />}
                    subtitle="Show all fulfilled positions with DRCs"
                    notificationCount={fulfilledPositions ? fulfilledPositions.length : 0}
                    className="bg-gray-500"
                />
            </ul>
        </div>
    </>)
}