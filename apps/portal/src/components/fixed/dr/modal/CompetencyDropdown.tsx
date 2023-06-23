/* eslint-disable @nx/enforce-module-boundaries */
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import useSWR from 'swr';
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { useCompetencyStore } from 'apps/portal/src/store/competency.store';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { DutyResponsibility } from 'apps/portal/src/types/dr.type';
import { Competency } from 'apps/portal/src/types/competency.type';
import { isEmpty } from 'lodash';

type CompetencyDropDownProps = {
  index: number;
};

export const CompetencyDropdown = ({ index }: CompetencyDropDownProps) => {
  // use competency store
  const {
    competencies,
    getCompetencies,
    getCompetenciesFail,
    getCompetenciesSuccess,
  } = useCompetencyStore((state) => ({
    competencies: state.competencies,
    getCompetenciesFail: state.getCompetenciesFail,
    getCompetenciesSuccess: state.getCompetenciesSuccess,
    getCompetencies: state.getCompetencies,
  }));

  // use position store
  const { selectedPosition } = usePositionStore((state) => ({
    selectedPosition: state.selectedPosition,
  }));

  // use dnr store
  const { checkedDnrs, setCheckedDnrs, selectedDrcType } = useDnrStore(
    (state) => ({
      checkedDnrs: state.checkedDnrs,
      selectedDrcType: state.selectedDrcType,
      setCheckedDnrs: state.setCheckedDnrs,
    })
  );

  // const prodUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/competency-proficiency-level/single/functional/${selectedPosition.positionId}`;

  // query competencies data from HRIS using access token
  const {
    data: swrCompetencies,
    isLoading: swrIsLoadingCompetencies,
    error: swrErrorCompetencies,
    mutate: swrMutateCompetencies,
  } = useSWR(
    `/competency-proficiency-level/single/functional/${selectedPosition.positionId}/`,
    fetcherHRIS,
    { shouldRetryOnError: false }
  );

  const handleSelectedDefaultCompetency = (index: number, item: Competency) => {
    if (selectedDrcType === 'core') {
      // create a copy of selected core dr
      const updatedCheckedCoreDnrs = [...checkedDnrs.core];

      // set the state to the checked core drs
      updatedCheckedCoreDnrs[index].competency = item;

      // map to change sequence
      updatedCheckedCoreDnrs.map((dr: DutyResponsibility, index: number) => {
        dr.sequenceNo = index;
      });

      // update the selected core dr state
      setCheckedDnrs({ ...checkedDnrs, core: updatedCheckedCoreDnrs });
    }
    if (selectedDrcType === 'support') {
      // create a copy of selected support dr
      const updatedCheckedSupportDnrs = [...checkedDnrs.support];

      // set the state to the checked support drs
      updatedCheckedSupportDnrs[index].competency = item;

      // map to change sequence
      updatedCheckedSupportDnrs.map((dr: DutyResponsibility, index: number) => {
        dr.sequenceNo = index;
      });

      // update the selected support dr state
      setCheckedDnrs({ ...checkedDnrs, support: updatedCheckedSupportDnrs });
    }
  };

  // swr get success or fail
  useEffect(() => {
    if (!isEmpty(swrCompetencies)) {
      getCompetenciesSuccess(swrCompetencies.data.functional);
    }
    if (swrErrorCompetencies) {
      getCompetenciesFail(swrErrorCompetencies);
    }
  }, [swrCompetencies, swrErrorCompetencies]);

  // swr loading
  useEffect(() => {
    if (swrIsLoadingCompetencies) {
      getCompetencies(swrIsLoadingCompetencies);
    }
  }, [swrIsLoadingCompetencies]);

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="h-full px-5 py-2 text-gray-700 transition-colors ease-in-out border rounded-l whitespace-nowrap border-slate-200 border-r-none bg-slate-100 hover:bg-slate-200 active:bg-slate-300">
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
            {competencies &&
              competencies.map((item: Competency, idx: number) => {
                return (
                  <div key={idx}>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() =>
                            handleSelectedDefaultCompetency(index, item)
                          }
                          className={`${
                            active
                              ? 'bg-indigo-200 text-gray-900'
                              : 'text-gray-500'
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
