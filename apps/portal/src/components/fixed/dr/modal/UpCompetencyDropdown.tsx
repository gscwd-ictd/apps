/* eslint-disable @nx/enforce-module-boundaries */
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { useCompetencyStore } from 'apps/portal/src/store/competency.store';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { DutyResponsibility, UpdatedDutyResponsibility } from 'apps/portal/src/types/dr.type';
import { Competency } from 'apps/portal/src/types/competency.type';
import { isEmpty } from 'lodash';
import { useUpdatedDrcStore } from 'apps/portal/src/store/updated-drc.store';

type CompetencyDropDownProps = {
  index: number;
};

export const UpCompetencyDropdown = ({ index }: CompetencyDropDownProps) => {
  // use competency store
  const { competencies, getCompetencies, getCompetenciesFail, getCompetenciesSuccess } = useCompetencyStore(
    (state) => ({
      competencies: state.competencies,
      getCompetenciesFail: state.getCompetenciesFail,
      getCompetenciesSuccess: state.getCompetenciesSuccess,
      getCompetencies: state.getCompetencies,
    })
  );

  // use position store
  const { selectedPosition } = usePositionStore((state) => ({
    selectedPosition: state.selectedPosition,
  }));

  // use updated drc store
  const { selectedDrcType, setTempAddedDrcs, tempAddedDrcs } = useUpdatedDrcStore((state) => ({
    tempAddedDrcs: state.tempAddedDrcs,
    selectedDrcType: state.selectedDrcType,
    setTempAddedDrcs: state.setTempAddedDrcs,
  }));

  // const prodUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/competency-proficiency-level/single/functional/${selectedPosition.positionId}`;

  // query competencies data from HRIS using access token
  const {
    data: swrCompetencies,
    isLoading: swrIsLoadingCompetencies,
    error: swrErrorCompetencies,
    mutate: swrMutateCompetencies,
  } = useSWR(`/competency-proficiency-level/single/functional/${selectedPosition.positionId}/`, fetcherHRIS, {
    shouldRetryOnError: false,
  });

  const handleSelectedDefaultCompetency = (index: number, item: Competency) => {
    if (selectedDrcType === 'core') {
      // create a copy of selected core dr
      const updatedCheckedCoreDnrs = [...tempAddedDrcs.core];

      // set the state to the checked core drs
      updatedCheckedCoreDnrs[index].competency = item;

      // map to change sequence
      updatedCheckedCoreDnrs.map((dr: UpdatedDutyResponsibility, index: number) => {
        dr.sequenceNo = index;
      });

      // update the selected core dr state
      setTempAddedDrcs({ ...tempAddedDrcs, core: updatedCheckedCoreDnrs });
    }
    if (selectedDrcType === 'support') {
      // create a copy of selected support dr
      const updatedCheckedSupportDnrs = [...tempAddedDrcs.support];

      // set the state to the checked support drs
      updatedCheckedSupportDnrs[index].competency = item;

      // map to change sequence
      updatedCheckedSupportDnrs.map((dr: UpdatedDutyResponsibility, index: number) => {
        dr.sequenceNo = index;
      });

      // update the selected support dr state
      setTempAddedDrcs({ ...tempAddedDrcs, support: updatedCheckedSupportDnrs });
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
          <Menu.Button
            className={`-full px-5 py-2 text-indigo-700 transition-colors ease-in-out  rounded-l text-md whitespace-nowrap bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200  
             `}
          >
            <p className="font-medium">Select Competency</p>
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
            {competencies && competencies.length > 0 ? (
              competencies.map((item: Competency, idx: number) => {
                return (
                  <div key={idx}>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            handleSelectedDefaultCompetency(index, item);
                          }}
                          className={`${
                            active ? 'bg-indigo-200/50 text-gray-900' : 'text-gray-500'
                          } group flex w-full items-center text-left py-3 pl-4 pr-2`}
                        >
                          <div className="flex flex-row w-full gap-2 divide-x-2">
                            <div className="w-[10%] pr-1">{item.code}</div>
                            <div className="w-[55%] px-1">{item.name}</div>
                            <div className="w-[35%] pl-1">{item.level}</div>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-[4rem]">No competency assigned.</div>
            )}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
