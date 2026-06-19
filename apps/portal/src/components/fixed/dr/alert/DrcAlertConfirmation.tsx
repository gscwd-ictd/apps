/* eslint-disable @nx/enforce-module-boundaries */
import { Alert } from '@gscwd-apps/oneui';
import { useAlertConfirmationStore, useAlertSuccessStore } from 'apps/portal/src/store/alert.store';
import { DutiesResponsibilitiesList, DutyResponsibilityList, useDnrStore } from 'apps/portal/src/store/dnr.store';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { Actions, useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { UpdatedDRCD } from 'apps/portal/src/types/dr.type';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { patchHRIS, postHRIS } from 'apps/portal/src/utils/helpers/fetchers/HRIS-axios-helper';
import { isEmpty } from 'lodash';
import { HiExclamationCircle } from 'react-icons/hi';
import { useSWRConfig } from 'swr';
import { AssignUpdatedDrcs, UpdateFinalDrcs } from '../utils/drcFunctions';
import { useEffect, useState } from 'react';
import { SpinnerCircular } from 'spinners-react';

export const DrcAlertConfirmation = () => {
  // use alert confirmation store
  const { confirmationIsOpen, setConfIsOpen, closeConf, openConf } = useAlertConfirmationStore((state) => ({
    confirmationIsOpen: state.isOpen,
    setConfIsOpen: state.setIsOpen,
    closeConf: state.setClose,
    openConf: state.setOpen,
  }));

  // use dnr store
  const {
    selectedDrcType,
    selectedDnrs,
    existingDrcsOnPost,
    availableDnrs,
    postDrcs,
    postDrcsFail,
    postDrcsSuccess,
    cancelDrcPage,
  } = useDnrStore((state) => ({
    selectedDnrs: state.selectedDnrs,
    selectedDrcType: state.selectedDrcType,
    existingDrcsOnPost: state.positionExistingDrcsOnPosting,
    availableDnrs: state.availableDnrs,
    postDrcs: state.postDrcs,
    postDrcsSuccess: state.postDrcsSuccess,
    postDrcsFail: state.postDrcsFail,
    cancelDrcPage: state.cancelDrcPage,
  }));

  // use modal store
  const { action, closeModal } = useModalStore((state) => ({
    action: state.action,
    closeModal: state.closeModal,
  }));

  // use alert success store
  const openAlertSuccess = useAlertSuccessStore((state) => state.setOpen);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // use position store
  const { selectedPosition, postPosition, postPositionFail, postPositionSuccess, emptySelectedPosition } =
    usePositionStore((state) => ({
      selectedPosition: state.selectedPosition,
      postPosition: state.postPosition,
      postPositionSuccess: state.postPositionSuccess,
      postPositionFail: state.postPositionFail,
      emptySelectedPosition: state.emptySelectedPosition,
    }));

  const { mutate } = useSWRConfig();

  useEffect(() => {
    setIsLoading(false);
  }, [confirmationIsOpen]);

  // use employee store
  const employee = useEmployeeStore((state) => state.employeeDetails);

  const onSubmitConfirm = async () => {
    if (action === Actions.CREATE) {
      setIsLoading(true);
      const drcsForPosting = await UpdateFinalDrcs(selectedDnrs);
      postPosition();
      const postDrcs = await handlePostData(drcsForPosting);

      if (postDrcs.error === true) {
        // set value for error message
        postPositionFail(postDrcs.result);

        postDrcsFail(postDrcs.result);
        setIsLoading(false);
      } else {
        // set value from returned response
        // post drcs success
        postDrcsSuccess(postDrcs.result);

        // mutate available drcs
        await mutate(
          `/occupational-group-duties-responsibilities/duties-responsibilities/${selectedPosition.positionId}`,
          fetcherHRIS,
          { revalidate: true }
        );

        // mutate existing drcs
        await mutate(
          `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`,
          fetcherHRIS,
          { revalidate: true }
        );

        // mutate unfilled positions
        await mutate(
          `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/pending`,
          fetcherHRIS,
          { revalidate: true }
        );

        // mutate filled positions
        await mutate(
          `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/finished`,
          fetcherHRIS,
          { revalidate: true }
        );

        // close
        closeConf();

        // closeModal
        closeModal();
        setIsLoading(false);
        // empty selected position upon success
        emptySelectedPosition();

        // open alert success
        openAlertSuccess();

        // set the default values in dnr
        cancelDrcPage();
      }
    } else if (action === Actions.UPDATE) {
      setIsLoading(true);
      // handleUpdateData(selectedDnrs.core,selectedDnrs.support, availableDnrs)
      const drcsForUpdate = await AssignUpdatedDrcs(selectedDnrs.core, selectedDnrs.support, availableDnrs);

      const updateDrcs = await handleUpdateData(drcsForUpdate);
      if (updateDrcs.error === true) {
        setIsLoading(false);
        //asdasd
      } else {
        // mutate available drcs
        await mutate(
          `/occupational-group-duties-responsibilities/duties-responsibilities/${selectedPosition.positionId}`,
          fetcherHRIS,
          { revalidate: true }
        );

        // mutate existing drcs
        await mutate(
          `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`,
          fetcherHRIS,
          { revalidate: true }
        );

        // mutate unfilled positions
        await mutate(
          `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/pending`,
          fetcherHRIS,
          { revalidate: true }
        );

        // mutate filled positions
        await mutate(
          `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/finished`,
          fetcherHRIS,
          { revalidate: true }
        );

        // close
        closeConf();

        // closeModal
        closeModal();
        setIsLoading(false);
        // empty selected position upon success
        emptySelectedPosition();

        // open alert success
        openAlertSuccess();

        // set the default values in dnr
        cancelDrcPage();
      }
    }
  };

  // call this for positions where there are no existing drcs
  const handlePostData = async (data: {
    core: Array<DutyResponsibilityList>;
    support: Array<DutyResponsibilityList>;
  }) => {
    // initialize loading to trues
    postDrcs();

    // axios request for post
    const { error, result } = await postHRIS(
      `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`,
      {
        core: data.core,
        support: data.support,
      }
    );

    return { error, result };
  };

  // call this for positions where there are existing drcs
  const handleUpdateData = async (drcds: { forUpdating: UpdatedDRCD; forPosting: DutiesResponsibilitiesList }) => {
    const { error, result } = await patchHRIS(
      `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`, //! Change employee
      { add: drcds.forPosting, update: drcds.forUpdating }
    );

    return { error, result };
  };

  return (
    <>
      <Alert open={confirmationIsOpen} setOpen={setConfIsOpen} closeOnBackdrop={false}>
        <Alert.Description>
          <div className="flex-row items-center w-full h-auto p-5">
            <div className="w-full text-lg font-normal text-left text-slate-700 ">
              <div className="flex gap-2 place-items-center">
                <HiExclamationCircle size={30} className="text-yellow-400" />
                <div className="text-3xl font-semibold text-gray-700">Action</div>
              </div>
              {action === 'create' ? (
                'This action cannot be undone.'
              ) : action === 'update' ? (
                <div className="flex gap-2 font-light text-left text-md">
                  <div>This will update the existing duties, responsibilities, and competencies.</div>
                </div>
              ) : null}
            </div>
            <div className="w-full mt-5 text-lg font-light text-left text-slate-700 ">Do you want to proceed?</div>
          </div>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <button
              disabled={isLoading ? true : false}
              onClick={closeConf}
              className="w-[6rem] px-3 py-2 bg-white border border-gray-300 rounded text-gray-700 active:bg-gray-100"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? <SpinnerCircular className="text-white w-5 h-5" /> : 'No'}
              </span>
            </button>

            <button
              onClick={onSubmitConfirm}
              disabled={isLoading ? true : false}
              className={`w-[6rem] px-3 py-2 ${
                isLoading ? 'bg-indigo-200' : 'bg-indigo-400'
              } rounded text-white active:bg-indigo-500`}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? <SpinnerCircular className="text-white w-5 h-5" /> : 'Yes'}
              </span>
            </button>
          </div>
        </Alert.Footer>
      </Alert>
    </>
  );
};
