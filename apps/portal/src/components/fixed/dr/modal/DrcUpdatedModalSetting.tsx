/* eslint-disable @nx/enforce-module-boundaries */
import { DrcTypes, useDnrStore } from 'apps/portal/src/store/dnr.store';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { Actions, useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { Competency } from 'apps/portal/src/types/competency.type';
import {
  DutiesResponsibilities,
  DutyResponsibility,
  UpdatedDutiesResponsibilities,
} from 'apps/portal/src/types/dr.type';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { HiPuzzle } from 'react-icons/hi';
import useSWR from 'swr';
import { Button } from '../../../modular/common/forms/Button';
import LoadingVisual from '../../loading/LoadingVisual';
import { SelectedCoreDrcs } from './DrcSelectedCores';
import { SelectedSupportDrcs } from './DrcSelectedSupports';
import { useUpdatedDrcStore } from 'apps/portal/src/store/updated-drc.store';
import { UpdatedSelectedCoreDrcs } from './UpdatedSelectedCoreDrcs';
import { UpdatedSelectedSupportDrcs } from './UpdatedSelectedSupportDrcs';

export const DrcUpdatedModalSetting = () => {
  // get from position store
  const { selectedPosition, postResponse } = usePositionStore((state) => ({
    selectedPosition: state.selectedPosition,
    postResponse: state.position.postResponse,
  }));

  // get from employee store
  const employee = useEmployeeStore((state) => state.employeeDetails);

  // get from updated drc store
  const {
    addedDrcs,
    initialDrcsOnLoad,
    existingDrcsIsLoaded,
    selectedDrcType,
    postDrcResponse,
    shouldMutate,
    setAddedDrcs,
    setSelectedDrcType,
    getExistingDnrs,
    getExistingDnrsSuccess,
    getExistingDnrsFail,
    setShouldMutateFalse,
    setTempAddedDrcs,
  } = useUpdatedDrcStore((state) => ({
    addedDrcs: state.addedDrcs,
    initialDrcsOnLoad: state.initialDrcsOnLoad,
    existingDrcsIsLoaded: state.existingDrcsIsLoaded,
    selectedDrcType: state.selectedDrcType,
    postDrcResponse: state.positionExistingDrcsOnPosting.postResponse,
    shouldMutate: state.shouldMutate,
    setAddedDrcs: state.setAddedDrcs,
    setSelectedDrcType: state.setSelectedDrcType,
    getExistingDnrs: state.getExistingDrcs,
    getExistingDnrsSuccess: state.getExistingDrcsSuccess,
    getExistingDnrsFail: state.getExistingDrcsFail,
    setShouldMutateFalse: state.setShouldMutateFalse,
    setTempAddedDrcs: state.setTempAddedDrcs,
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
  } = useSWR(
    `/occupational-group-duties-responsibilities/duties-responsibilities/${selectedPosition.positionId}`,
    fetcherHRIS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    }
  );

  // useSWR existing dnrs
  const {
    data: swrExistingDnrs,
    error: swrExistingDnrsError,
    isLoading: swrExistingDnrsIsLoading,
  } = useSWR(
    `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`,
    fetcherHRIS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    }
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
        originalPool.push((({ competency, percentage, state, onEdit, ...rest }) => rest)(dr));
      });
    }

    // map the existing support dnrs
    if (existingDnrs.support && existingDnrs.support.length > 0) {
      existingDnrs.support.map((dr: DutyResponsibility) => {
        originalPool.push((({ competency, percentage, state, onEdit, ...rest }) => rest)(dr));
      });
    }
    return originalPool.sort((a: DutyResponsibility, b: DutyResponsibility) =>
      a.description.localeCompare(b.description)
    );
  };

  // fires when core button is clicked
  const openDrcModalSelection = (drcType: DrcTypes) => {
    setTempAddedDrcs({
      core: addedDrcs.core.map((drc) => {
        return { ...drc, onEdit: false };
      }),
      support: addedDrcs.support.map((drc) => {
        return { ...drc, onEdit: false };
      }),
    });
    setSelectedDrcType(drcType);
    setModalPage(3);
  };

  // get available dnrs (Pool)
  // useEffect(() => {
  //   if (!isEmpty(swrAvailableDnrs) && availableDnrsIsLoaded === false) {
  //     // sort by description
  //     const poolOfDnrs = [
  //       ...swrAvailableDnrs.data.sort((a: DutyResponsibility, b: DutyResponsibility) =>
  //         a.description.localeCompare(b.description)
  //       ),
  //     ];

  //     // set default empty values
  //     poolOfDnrs.map((dr: DutyResponsibility, index: number) => {
  //       // set default state value for dr on select
  //       dr.state = false;

  //       // set default state value for dr on edit
  //       dr.onEdit = false;

  //       // set default value state of sequence number
  //       dr.sequenceNo = index;

  //       // set default percentage to 0
  //       dr.percentage = 0;

  //       // set default competency
  //       dr.competency = {} as Competency;
  //     });

  //     getAvailableDnrsSuccess(poolOfDnrs);
  //   }
  // }, [swrAvailableDnrs, swrAvailableDnrsError, selectedPosition, availableDnrsIsLoaded]);

  // get existing dnrs (to remove from existing pool)
  useEffect(() => {
    if (!isEmpty(swrExistingDnrs) && action === Actions.UPDATE && existingDrcsIsLoaded === false) {
      // assign a shallow copy of sorted core drcs
      const coreDrcs = [...swrExistingDnrs.data.core];

      // sort and map the core drcs
      if (coreDrcs && coreDrcs.length > 0) {
        // sort the array by description
        coreDrcs
          .sort((a: DutyResponsibility, b: DutyResponsibility) => a.description.localeCompare(b.description))

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
            a.competency.competencyDescription.localeCompare(b.competency.competencyDescription)
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

      const existingDnrs: UpdatedDutiesResponsibilities = {
        core: coreDrcs,
        support: supportDrcs,
      };

      // mutate the original pool based on the available and existing dnrs
      //! const pool = combineAvailableAndExistingDnrs(availableDnrs, existingDnrs);

      getExistingDnrsSuccess(existingDnrs);
    } else if (swrExistingDnrsError) {
      getExistingDnrsFail(swrExistingDnrsError);
    }
  }, [swrExistingDnrs, swrExistingDnrsError, action, selectedPosition, existingDrcsIsLoaded]);

  //! trigger loading if useSWR is called for available dnrs
  // useEffect(() => {
  //   if (swrAvailableDnrsIsLoading) {
  //     getAvailableDnrs(swrAvailableDnrsIsLoading);
  //   }
  // }, [swrAvailableDnrsIsLoading]);

  //! trigger loading if useSWR is called for existing dnrs
  // useEffect(() => {
  //   if (swrExistingDnrsIsLoading) {
  //     getExistingDnrs(swrExistingDnrsIsLoading);
  //   }
  // }, [swrExistingDnrsIsLoading]);

  // set the default values
  useEffect(() => {
    setSelectedDrcType(null);
  }, []);

  return (
    <div className="h-auto px-5 rounded">
      <div className="flex flex-col pt-2 mb-8 font-semibold text-gray-500">
        <span className="text-xl text-slate-500">{selectedPosition.positionTitle}</span>
        <span className="text-sm font-normal">{selectedPosition.itemNumber}</span>
        <span className="text-xs font-normal">{selectedPosition.designation}</span>

        {/** HERE */}
        <div className="flex flex-col w-full mt-5">
          <section>
            <div className="flex flex-col items-center justify-between md:flex-row ">
              <div className="flex w-full md:min-w-[22rem] md:max-w-[30rem] font-normal items-center select-none">
                Core Duties, Responsibilities, & Competencies
                <HiPuzzle />
              </div>

              {swrAvailableDnrsIsLoading ? (
                <LoadingVisual size={5} />
              ) : (
                <>
                  <Button
                    btnLabel={addedDrcs.core.length > 0 ? 'Edit Core' : '+ Add Core'}
                    btnVariant="white"
                    className="w-auto lg:min-w-[16rem] border-none text-indigo-600 "
                    // isDisabled={availableDnrs.length === 0 ? true : false}
                    onClick={() => openDrcModalSelection(DrcTypes.CORE)}
                  />
                </>
              )}
            </div>
            {/**Core Duties Box */}
            <div className="w-full  mt-2 mb-5 h-[14rem]  bg-slate-50 rounded  overflow-y-scroll overflow-x-auto">
              <>
                {/* <h1 className="text-2xl font-normal text-gray-300">No selected core duties & responsibilities</h1> */}
                {swrExistingDnrsIsLoading ? (
                  <div className="flex justify-center w-full h-full place-items-center">
                    {<LoadingVisual size={12} />}{' '}
                  </div>
                ) : (
                  <>
                    {addedDrcs.core.length === 0 ? (
                      <>
                        <div className="flex items-center justify-center h-full">
                          <h1 className="text-2xl font-normal text-gray-300">
                            No selected core duties, responsibilities, & competencies
                          </h1>
                        </div>
                      </>
                    ) : (
                      <div className="w-full">
                        {/* <SelectedCoreDrcs /> */}
                        <UpdatedSelectedCoreDrcs />
                      </div>
                    )}
                  </>
                )}
              </>
            </div>
          </section>
          <section>
            <div className="flex flex-col items-center justify-between md:flex-row ">
              <div className="flex w-full md:min-w-[22rem] md:max-w-[30rem] font-normal items-center select-none">
                Support Duties, Responsibilities, & Competencies <HiPuzzle />
              </div>

              {swrAvailableDnrsIsLoading ? (
                <LoadingVisual size={5} />
              ) : (
                <Button
                  btnLabel={addedDrcs.support.length > 0 ? 'Edit Support' : '+ Add Support'}
                  btnVariant="white"
                  // isDisabled={availableDnrs.length === 0 ? true : false}
                  className="w-auto lg:min-w-[16rem] border-none text-indigo-600"
                  onClick={() => openDrcModalSelection(DrcTypes.SUPPORT)}
                />
              )}
            </div>
            {/** Support Duties Box */}
            <div className="w-full mt-2 mb-5 h-[14rem] bg-slate-50 rounded  overflow-y-scroll overflow-x-auto">
              <>
                {/* <h1 className="text-2xl font-normal text-gray-300">No selected support duties & responsibilities</h1> */}
                {swrExistingDnrsIsLoading ? (
                  <div className="flex justify-center w-full h-full place-items-center">
                    {<LoadingVisual size={12} />}{' '}
                  </div>
                ) : (
                  <>
                    {addedDrcs.support.length === 0 ? (
                      <>
                        <div className="flex items-center justify-center h-full">
                          <h1 className="text-2xl font-normal text-gray-300">
                            No selected support duties, responsibilities, & competencies
                          </h1>
                        </div>
                      </>
                    ) : (
                      <div className="w-full">
                        {/* <SelectedSupportDrcs /> */}
                        <UpdatedSelectedSupportDrcs />
                      </div>
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
