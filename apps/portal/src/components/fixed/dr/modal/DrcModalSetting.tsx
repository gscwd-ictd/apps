/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useDnrStore } from 'apps/portal/src/store/dnr.store';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { Actions, useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { Competency } from 'apps/portal/src/types/competency.type';
import { DutyResponsibility } from 'apps/portal/src/types/dr.type';
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

    setOriginalPoolOfDnrs, // set original pool of dnrs

    setAvailableDnrs, // set available dnrs

    setFilteredAvailableDnrs, // set filtered available dnrs

    getDnrsOnCreate, // initialize dnr on create

    getDnrsOnCreateSuccess, // success dnrs on create

    getDnrsOnCreateFail, // fail dnrs on create
  } = useDnrStore((state) => ({
    originalPoolOfDnrs: state.originalPoolOfDnrs,
    availableDnrs: state.availableDnrs,
    filteredAvailableDnrs: state.filteredAvailableDnrs,
    selectedDnrs: state.selectedDnrs,
    setOriginalPoolOfDnrs: state.setOriginalPoolOfDnrs,
    setAvailableDnrs: state.setAvailableDnrs,
    setFilteredAvailableDnrs: state.setFilteredAvailableDnrs,
    getDnrsOnCreate: state.getDnrsOnCreate,
    getDnrsOnCreateSuccess: state.getDnrsOnCreateSuccess,
    getDnrsOnCreateFail: state.getDnrsOnCreateFail,
  }));

  // get from modal store
  const action = useModalStore((state) => state.action);

  // useSWR
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

  // useSWR
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

  // add existing drns and available dnrs
  const appendOrigAndExistingDnrs = (availableDnrs: any, existingDnrs: any) => {
    //
  };

  // trigger loading if useSWR is called for create
  useEffect(() => {
    if (swrAvailableDnrsIsLoading) {
      getDnrsOnCreate(swrAvailableDnrsIsLoading);
    }
  }, [swrAvailableDnrsIsLoading]);

  // trigger loading if useSWR if called for update
  useEffect(() => {
    if (swrExistingDnrsIsLoading) {
      // getDnrsOnUpdate(swrExistingDnrsIsLoading);
    }
  }, [swrExistingDnrsIsLoading]);

  useEffect(() => {
    if (!isEmpty(swrAvailableDnrs) && action === Actions.CREATE) {
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

      // set original pool
      // setOriginalPoolOfDnrs(poolOfDnrs);

      // set available dnrs
      // setAvailableDnrs(poolOfDnrs);

      // set filtered drns to sorted
      // setFilteredAvailableDnrs(poolOfDnrs);
      getDnrsOnCreateSuccess(poolOfDnrs);
    } else if (!isEmpty(swrAvailableDnrs) && action === Actions.UPDATE) {
      //
    }
  }, [swrAvailableDnrs, swrAvailableDnrsError, action]);

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
          }}
        >
          Log
        </button>
        {/** HERE */}
        <div className="flex flex-col mt-5">
          <section>
            <div className="flex items-end justify-between ">
              <p className="flex w-[22rem] font-normal items-center ">
                Core Duties & Responsibilities <HiPuzzle />
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
                  // onClick={onClickCoreBtn}
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
              <p className="flex w-[22rem] font-normal items-center ">
                Support Duties & Responsibilities <HiPuzzle />
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
                  // onClick={onClickSupportBtn}
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
