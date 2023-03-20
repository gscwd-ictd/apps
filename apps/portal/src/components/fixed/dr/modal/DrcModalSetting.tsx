/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { DrcTypes, useDnrStore } from 'apps/portal/src/store/dnr.store';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { Actions, useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { Competency } from 'apps/portal/src/types/competency.type';
import {
  DutiesResponsibilities,
  DutyResponsibility,
} from 'apps/portal/src/types/dr.type';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { HiPuzzle } from 'react-icons/hi';
import useSWR from 'swr';
import { Button } from '../../../modular/common/forms/Button';
import LoadingVisual from '../../loading/LoadingVisual';

export const DrcModalSetting = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // get from position store
  const { selectedPosition } = usePositionStore((state) => ({
    selectedPosition: state.selectedPosition,
  }));

  // get from employee store
  const employee = useEmployeeStore((state) => state.employeeDetails);

  // get from dnr store
  const {
    originalPoolOfDnrs, // get original pool of dnrs
    selectedDnrs, // get selected dnrs
    availableDnrs, // get available dnrs for selection
    filteredAvailableDnrs, // get filtered available dnrs for selection
    availableDnrsIsLoaded, // boolean if available dnrs is loaded
    existingDnrsIsLoaded, // boolean if existing dnrs is loaded
    selectedDrcType, // type of drc
    setOriginalPoolOfDnrs, // set original pool of dnrs
    setAvailableDnrs, // set available dnrs
    setFilteredAvailableDnrs, // set filtered available dnrs
    getAvailableDnrs, // initialize dnr on create
    getAvailableDnrsSuccess, // success dnrs on create
    getAvailableDnrsFail, // fail dnrs on create
    getExistingDnrs,
    getExistingDnrsSuccess,
    getExistingDnrsFail,
    setSelectedDnrs, // set the selected dnrs
    setSelectedDrcType, // set the selected drc type
  } = useDnrStore((state) => ({
    originalPoolOfDnrs: state.originalPoolOfDnrs,
    availableDnrs: state.availableDnrs,
    filteredAvailableDnrs: state.filteredAvailableDnrs,
    selectedDnrs: state.selectedDnrs,
    selectedDnrsOnLoad: state.selectedDnrsOnLoad,
    availableDnrsIsLoaded: state.availableDnrsIsLoaded,
    existingDnrsIsLoaded: state.existingDnrsIsLoaded,
    selectedDrcType: state.selectedDrcType,
    setSelectedDnrs: state.setSelectedDnrs,
    setOriginalPoolOfDnrs: state.setOriginalPoolOfDnrs,
    setAvailableDnrs: state.setAvailableDnrs,
    setSelectedDrcType: state.setSelectedDrcType,
    setFilteredAvailableDnrs: state.setFilteredAvailableDnrs,
    getAvailableDnrs: state.getAvailableDnrs,
    getAvailableDnrsSuccess: state.getAvailableDnrsSuccess,
    getAvailableDnrsFail: state.getAvailableDnrsFail,
    getExistingDnrs: state.getExistingDnrs,
    getExistingDnrsSuccess: state.getExistingDnrsSuccess,
    getExistingDnrsFail: state.getExistingDnrsFail,
  }));

  // get from modal store
  const { action, setModalPage } = useModalStore((state) => ({
    action: state.action,
    setModalPage: state.setModalPage,
  }));

  // useSWR available dnrs
  const {
    data: swrAvailableDnrs,
    error: swrAvailableDnrsError,
    isLoading: swrAvailableDnrsIsLoading,
    mutate: mutateAvailableDnrs,
  } = useSWR(
    `/occupational-group-duties-responsibilities/duties-responsibilities/${selectedPosition.positionId}`,
    fetcherHRIS,
    { shouldRetryOnError: false }
  );

  // useSWR existing dnrs
  const {
    data: swrExistingDnrs,
    error: swrExistingDnrsError,
    isLoading: swrExistingDnrsIsLoading,
    mutate: mutateExistingDnrs,
  } = useSWR(
    `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`,
    fetcherHRIS,
    { shouldRetryOnError: false }
  );

  // combine available and existing dnrs and returns an array of DutyResponsibility
  const combineAvailableAndExistingDnrs = (
    availableDnrs: Array<DutyResponsibility>,
    existingDnrs: DutiesResponsibilities
  ) => {
    // initialize the array
    const originalPool = [...availableDnrs];

    // map the existing core dnrs
    if (existingDnrs.core && existingDnrs.core.length > 0) {
      existingDnrs.core.map((dr: DutyResponsibility) => {
        originalPool.push(
          (({ competency, percentage, state, onEdit, ...rest }) => rest)(dr)
        );
      });
    }

    // map the existing support dnrs
    if (existingDnrs.support && existingDnrs.support.length > 0) {
      existingDnrs.support.map((dr: DutyResponsibility) => {
        originalPool.push(
          (({ competency, percentage, state, onEdit, ...rest }) => rest)(dr)
        );
      });
    }
    return originalPool.sort((a: DutyResponsibility, b: DutyResponsibility) =>
      a.description.localeCompare(b.description)
    );
  };

  // fires when core button is clicked
  const openDrcModalSelection = (drcType: DrcTypes) => {
    setSelectedDrcType(drcType);
    setModalPage(3);
    console.log(drcType);
  };

  // get available dnrs (Pool)
  useEffect(() => {
    if (!isEmpty(swrAvailableDnrs)) {
      // sort by description
      const poolOfDnrs = [
        ...swrAvailableDnrs.data.sort(
          (a: DutyResponsibility, b: DutyResponsibility) =>
            a.description.localeCompare(b.description)
        ),
      ];

      // set default empty values
      poolOfDnrs.map((dr: DutyResponsibility, index: number) => {
        // set default state value for dr on select
        dr.state = false;

        // set default state value for dr on edit
        dr.onEdit = false;

        // set default value state of sequence number
        dr.sequenceNo = index;

        // set default percentage to 0
        dr.percentage = 0;

        // set default competency
        dr.competency = {} as Competency;
      });

      getAvailableDnrsSuccess(poolOfDnrs);
    }
  }, [swrAvailableDnrs, swrAvailableDnrsError, selectedPosition]);

  // get existing dnrs (to remove from existing pool)
  useEffect(() => {
    if (
      !isEmpty(swrExistingDnrs) &&
      action === Actions.UPDATE &&
      availableDnrsIsLoaded === true &&
      existingDnrsIsLoaded === false
    ) {
      // assign a shallow copy of sorted core drcs
      const coreDrcs = [...swrExistingDnrs.data.core];

      // sort and map the core drcs
      if (coreDrcs && coreDrcs.length > 0) {
        // sort the array by description
        coreDrcs
          .sort((a: DutyResponsibility, b: DutyResponsibility) =>
            a.description.localeCompare(b.description)
          )

          // assign the selected state-wise values to the array
          .map((dr: DutyResponsibility, index: number) => {
            // set state value for dr on select
            dr.state = true;

            // set state value for dr on edit
            dr.onEdit = false;

            // set value state of sequence number
            dr.sequenceNo = index;
          });
      }

      // assign a shallow copy of sorted support drcs
      const supportDrcs = [...swrExistingDnrs.data.support];

      // sort and map the support drcs
      if (supportDrcs && supportDrcs.length > 0) {
        // sort the array by description
        supportDrcs
          .sort((a: DutyResponsibility, b: DutyResponsibility) =>
            a.description.localeCompare(b.description)
          )

          // assign the selected state-wise values to the array
          .map((dr: DutyResponsibility, index: number) => {
            // set state value for dr on select
            dr.state = true;

            // set state value for dr on edit
            dr.onEdit = false;

            // set value state of sequence number
            dr.sequenceNo = index;
          });
      }

      const existingDnrs: DutiesResponsibilities = {
        core: coreDrcs,
        support: supportDrcs,
      };

      // mutate the original pool based on the available and existing dnrs
      const pool = combineAvailableAndExistingDnrs(availableDnrs, existingDnrs);

      getExistingDnrsSuccess(existingDnrs, pool);
    } else if (swrExistingDnrsError) {
      getExistingDnrsFail(swrExistingDnrsError);
    }
  }, [
    swrExistingDnrs,
    swrExistingDnrsError,
    action,
    selectedPosition,
    availableDnrsIsLoaded,
    existingDnrsIsLoaded,
  ]);

  // trigger loading if useSWR is called for available dnrs
  useEffect(() => {
    if (swrAvailableDnrsIsLoading) {
      getAvailableDnrs(swrAvailableDnrsIsLoading);
    }
  }, [swrAvailableDnrsIsLoading]);

  // trigger loading if useSWR is called for existing dnrs
  useEffect(() => {
    if (swrExistingDnrsIsLoading) {
      getExistingDnrs(swrExistingDnrsIsLoading);
    }
  }, [swrExistingDnrsIsLoading]);

  return (
    <div className="h-auto px-5 rounded">
      <div className="flex flex-col pt-2 mb-8 font-semibold text-gray-500">
        <span className="text-xl text-slate-500">
          {selectedPosition.positionTitle}
        </span>
        <span className="text-sm font-normal">
          {selectedPosition.itemNumber}
        </span>
        <button
          className="px-3 py-2 text-center bg-blue-400"
          onClick={() => {
            console.log('Original Pool: ', originalPoolOfDnrs);
            console.log('Available Dnrs: ', availableDnrs);
            console.log('Filtered Dnrs: ', filteredAvailableDnrs);
            console.log('Existing Dnrs', selectedDnrs);
          }}
        >
          <span className="text-white"> Log</span>
        </button>
        {/** HERE */}
        <div className="flex flex-col mt-5">
          <section>
            <div className="flex items-end justify-between ">
              <p className="flex min-w-[22rem] max-w-[30rem] font-normal items-center ">
                Core Duties, Responsibilities, & Competencies
                <HiPuzzle />
              </p>

              {isLoading ? (
                <LoadingVisual size={5} />
              ) : (
                <Button
                  btnLabel={
                    availableDnrs.length === 0
                      ? 'No core duties available in pool, please contact HR to add more duties'
                      : '+ Add Core'
                  }
                  btnVariant="white"
                  className="min-w-[16rem] border-none text-indigo-600 "
                  isDisabled={availableDnrs.length === 0 ? true : false}
                  onClick={() => openDrcModalSelection(DrcTypes.CORE)}
                />
              )}
            </div>
            {/**Core Duties Box */}
            <div className="w-full  mt-2 mb-5 h-[14rem]  bg-slate-50 rounded  overflow-y-scroll overflow-x-hidden">
              <>
                {/* <h1 className="text-2xl font-normal text-gray-300">No selected core duties & responsibilities</h1> */}
                {isLoading ? (
                  <div className="flex justify-center w-full h-full place-items-center">
                    {<LoadingVisual size={12} />}{' '}
                  </div>
                ) : (
                  <>
                    {selectedDnrs.core.length === 0 ? (
                      <>
                        <div className="flex items-center justify-center h-full">
                          <h1 className="text-2xl font-normal text-gray-300">
                            No selected core duties, responsibilities, &
                            competencies
                          </h1>
                        </div>
                      </>
                    ) : (
                      <>{/* <SelectedCoreDRs /> */}</>
                    )}
                  </>
                )}
              </>
            </div>
          </section>
          <section>
            <div className="flex items-end justify-between ">
              <p className="flex min-w-[22rem] max-w-[30rem] font-normal items-center ">
                Support Duties, Responsibilities, & Competencies <HiPuzzle />
              </p>

              {isLoading ? (
                <LoadingVisual size={5} />
              ) : (
                <Button
                  btnLabel={
                    availableDnrs.length === 0
                      ? 'No support duties available in pool, please contact HR to add more duties'
                      : '+ Add Support'
                  }
                  btnVariant="white"
                  isDisabled={availableDnrs.length === 0 ? true : false}
                  className="min-w-[16rem] border-none text-indigo-600"
                  onClick={() => openDrcModalSelection(DrcTypes.SUPPORT)}
                />
              )}
            </div>
            {/** Support Duties Box */}
            <div className="w-full mt-2 mb-5 h-[14rem] bg-slate-50 rounded  overflow-y-scroll overflow-x-hidden">
              <>
                {/* <h1 className="text-2xl font-normal text-gray-300">No selected support duties & responsibilities</h1> */}
                {isLoading ? (
                  <div className="flex justify-center w-full h-full place-items-center">
                    {<LoadingVisual size={12} />}{' '}
                  </div>
                ) : (
                  <>
                    {selectedDnrs.support.length === 0 ? (
                      <>
                        <div className="flex items-center justify-center h-full">
                          <h1 className="text-2xl font-normal text-gray-300">
                            No selected support duties, responsibilities, &
                            competencies
                          </h1>
                        </div>
                      </>
                    ) : (
                      <>{/* <SelectedSupportDRs /> */}</>
                    )}
                  </>
                )}
              </>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
