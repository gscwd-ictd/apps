import { Menu, Transition } from '@headlessui/react';
import { Fragment, useContext, useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithToken } from '../../../../utils/hoc/fetcher';
import { DRContext } from '../../../context/contexts';
import { useDrStore } from '../../../store/dr.store';
import { Competency, DutyResponsibility } from '../../../types/dr.type';

type CompetencyDropDownProps = {
  index: number;
};

export const CompetencyDropdown = ({ index }: CompetencyDropDownProps) => {
  const selectedPosition = useDrStore((state) => state.selectedPosition);

  const allCompetencyPool = useDrStore((state) => state.allCompetencyPool);

  const setAllCompetencyPool = useDrStore((state) => state.setAllCompetencyPool);

  const checkedDRCs = useDrStore((state) => state.checkedDRCs);

  const setCheckedDRCs = useDrStore((state) => state.setCheckedDRCs);

  const selectedDRCType = useDrStore((state) => state.selectedDRCType);

  // url for querying the competencies related to the selected position from HRIS
  const prodUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/competency-proficiency-level/single/functional/${selectedPosition.positionId}`;

  // query competencies data from HRIS using access token
  const { data } = useSWR(`${prodUrl}`, fetchWithToken);

  const handleSelectedDefaultCompetency = (index: number, item: Competency) => {
    if (selectedDRCType === 'core') {
      // create a copy of selected core dr
      const updatedCheckedCoreDRs = [...checkedDRCs.core];

      // set the state to the checked core drs
      updatedCheckedCoreDRs[index].competency = item;

      // map to change sequence
      updatedCheckedCoreDRs.map((dr: DutyResponsibility, index: number) => {
        dr.sequenceNo = index;
      });

      // update the selected core dr state
      setCheckedDRCs({ ...checkedDRCs, core: updatedCheckedCoreDRs });
    }
    if (selectedDRCType === 'support') {
      // create a copy of selected support dr
      const updatedCheckedSupportDRs = [...checkedDRCs.support];

      // set the state to the checked support drs
      updatedCheckedSupportDRs[index].competency = item;

      // map to change sequence
      updatedCheckedSupportDRs.map((dr: DutyResponsibility, index: number) => {
        dr.sequenceNo = index;
      });

      // update the selected support dr state
      setCheckedDRCs({ ...checkedDRCs, support: updatedCheckedSupportDRs });
    }
  };

  // yabo ang jollibee
  useEffect(() => {
    if (data && allCompetencyPool.length === 0) {
      // && allCompetencyPool.length === 0 //! Removed for checking
      setAllCompetencyPool(data.functional);
    }
  }, [data]);

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="h-full px-5 py-2 mr-1 text-gray-700 transition-colors ease-in-out border-2 whitespace-nowrap border-slate-100 bg-slate-100 hover:bg-slate-200 active:bg-slate-300">
            <p>Select Competency</p>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`shadow-gray absolute z-[100] mb-2 mt-2 w-[26rem] origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg shadow-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            {allCompetencyPool &&
              allCompetencyPool.map((item: Competency, idx: number) => {
                return (
                  <div key={idx}>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleSelectedDefaultCompetency(index, item)}
                          className={`${
                            active ? 'bg-indigo-200 text-gray-900' : 'text-gray-500'
                          } group flex w-full items-center text-left py-3 pl-4 pr-2`}
                        >
                          <div className="flex flex-row w-full gap-2 divide-x">
                            <div className="w-[10%] pr-1">{item.code}</div>
                            <div className="w-[60%] px-1">{item.name}</div>
                            <div className="w-[30%] pl-1">{item.level}</div>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                );
              })}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
