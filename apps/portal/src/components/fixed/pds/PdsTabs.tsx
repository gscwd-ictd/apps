import { useEffect, useState } from 'react';
import { HiOutlineEye, HiOutlinePlusCircle } from 'react-icons/hi';
import { TabHeader } from '../tab/TabHeader';

type PdsTabsProps = {
  tab: number;
  userId: string;
};

export const PdsTabs = ({ tab, userId }: PdsTabsProps) => {
  const [openPdsIsClicked, setOpenPdsIsClicked] = useState<boolean>(false);

  // delay
  useEffect(() => {
    if (openPdsIsClicked) {
      setTimeout(() => {
        setOpenPdsIsClicked(false);
      }, 2000);
    }
  }, [openPdsIsClicked]);

  return (
    <>
      <div className="w-full max-h-[44rem] px-5 overflow-y-auto">
        <div className="flex flex-col md:flex-row lg:flex-col text-gray-500">
          <TabHeader
            tab={tab}
            tabIndex={1}
            href={`${process.env.NEXT_PUBLIC_PDS}/pds/${userId}`}
            // onClick={() => setOpenPdsIsClicked(true)}
            icon={<HiOutlinePlusCircle size={26} />}
            title="Open Personal Data Sheet"
            subtitle="Create or Update your PDS"
            notificationCount={0}
            className="bg-indigo-500"
          />

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
