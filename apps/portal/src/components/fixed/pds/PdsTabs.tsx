import {
  HiOutlineEye,
  HiOutlinePencilAlt,
  HiOutlinePlusCircle,
} from 'react-icons/hi';
import { usePdsStore } from '../../../store/pds.store';
import { TabHeader } from '../tab/TabHeader';

type PdsTabsProps = {
  tab: number;
  userId: string;
};

export const PdsTabs = ({ tab, userId }: PdsTabsProps) => {
  return (
    <>
      <div className="w-full max-h-[44rem] px-5 overflow-y-auto">
        <div className="flex flex-col md:flex-row lg:flex-col text-gray-500">
          <TabHeader
            tab={tab}
            tabIndex={1}
            href={`${process.env.NEXT_PUBLIC_PDS}/pds/${userId}`}
            icon={<HiOutlinePlusCircle size={26} />}
            title="Open Personal Data Sheet"
            subtitle="Create or Update your PDS"
            notificationCount={0}
            className="bg-indigo-500"
          />
          {/* <TabHeader
                    tab={tab}
                    tabIndex={2}
                    onClick={() => setTab(2)}
                    icon={<HiOutlinePencilAlt size={26} />}
                    title="Update Personal Data Sheet"
                    subtitle="Update your PDS by section"
                    notificationCount={0}
                    className="bg-indigo-500"
                /> */}
          <TabHeader
            tab={tab}
            tabIndex={3}
            href={`${process.env.NEXT_PUBLIC_PDS}/pds/${userId}/view`}
            icon={<HiOutlineEye size={26} />}
            title="View in PDF"
            subtitle="View your Latest PDS in PDF Format"
            notificationCount={0}
            className="bg-indigo-500"
          />
        </div>
      </div>
    </>
  );
};
