/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Alert, Button } from '@gscwd-apps/oneui';
import { useAlertConfirmationStore } from 'apps/portal/src/store/alert.store';
import {
  DutyResponsibilityList,
  useDnrStore,
} from 'apps/portal/src/store/dnr.store';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { postHRIS } from 'apps/portal/src/utils/helpers/fetchers/HRIS-axios-helper';
import { HiExclamationCircle } from 'react-icons/hi';
import { UpdateFinalDrcs } from '../utils/drcFunctions';

export const DrcAlertConfirmation = () => {
  // use alert confirmation store
  const { confirmationIsOpen, setConfIsOpen, closeConf, openConf } =
    useAlertConfirmationStore((state) => ({
      confirmationIsOpen: state.isOpen,
      setConfIsOpen: state.setIsOpen,
      closeConf: state.setClose,
      openConf: state.setOpen,
    }));

  // use dnr store
  const { selectedDrcType, selectedDnrs } = useDnrStore((state) => ({
    selectedDnrs: state.selectedDnrs,
    selectedDrcType: state.selectedDrcType,
  }));

  // use modal store
  const action = useModalStore((state) => state.action);

  // use position store
  const {
    selectedPosition,
    postPosition,
    postPositionFail,
    postPositionSuccess,
  } = usePositionStore((state) => ({
    selectedPosition: state.selectedPosition,
    postPosition: state.postPosition,
    postPositionSuccess: state.postPositionSuccess,
    postPositionFail: state.postPositionFail,
  }));

  // use employee store
  const employee = useEmployeeStore((state) => state.employeeDetails);

  const onSubmitConfirm = async () => {
    closeConf();
    if (selectedDrcType === 'core') {
      const drcsForPosting = await UpdateFinalDrcs(selectedDnrs);
      postPosition();
      handlePostData(drcsForPosting);
    }
  };

  const handlePostData = async (data: {
    core: Array<DutyResponsibilityList>;
    support: Array<DutyResponsibilityList>;
  }) => {
    // axios request for post
    const { error, result } = await postHRIS(
      `/occupational-group-duties-responsibilities/${employee.employmentDetails.assignment.positionId}/${selectedPosition.positionId}`,
      {
        core: data.core,
        support: data.support,
      }
    );

    if (error) {
      // set value for error message
      postPositionFail(result);
    } else {
      // set value from returned response
      postPositionSuccess(result);

      // open alert success
      closeConf();
    }
  };

  return (
    <>
      <Alert open={confirmationIsOpen} setOpen={setConfIsOpen}>
        <Alert.Description>
          <div className="flex-row items-center w-full h-auto p-5">
            <div className="w-full text-lg font-normal text-left text-slate-700 ">
              <div className="flex gap-2 place-items-center">
                <HiExclamationCircle size={30} className="text-yellow-400" />
                <div className="text-3xl font-semibold text-gray-700">
                  Action
                </div>
              </div>
              {action === 'create' ? (
                'This action cannot be undone.'
              ) : action === 'update' ? (
                <div className="flex gap-2 font-light text-left text-md">
                  <div>
                    This will update the existing duties, responsibilities, and
                    competencies.
                  </div>
                </div>
              ) : null}
            </div>
            <div className="w-full mt-5 text-lg font-light text-left text-slate-700 ">
              Do you want to proceed?
            </div>
          </div>
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <button
              onClick={closeConf}
              className="w-[6rem] px-3 py-2 bg-indigo-400 rounded text-white"
            >
              <span>No</span>
            </button>

            <button
              onClick={onSubmitConfirm}
              className="w-[6rem] px-3 py-2 bg-indigo-400 rounded text-white"
            >
              <span>Yes</span>
            </button>
          </div>
        </Alert.Footer>
      </Alert>
    </>
  );
};
