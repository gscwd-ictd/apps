import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { LeaveBenefit, LeaveType } from 'libs/utils/src/lib/types/leave-benefits.type';
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LabelInput } from '../../../inputs/LabelInput';
import { SelectListRF } from '../../../inputs/SelectListRF';
import { adjustmentEntryType } from 'libs/utils/src/lib/constants/leave-ledger-adjustment.const';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { useLeaveBenefitStore } from 'apps/employee-monitoring/src/store/leave-benefits.store';
import { MutatedLeaveBenefit } from 'apps/employee-monitoring/src/store/leave-ledger.store';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { LeaveAdjustmentForm } from 'libs/utils/src/lib/types/leave-ledger-entry.type';

type LeaveLedgerAdjModalProps = {
  employeeId: string;
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type MutatedLeaveBenefitOption = {
  label: string;
  value: string;
  leaveType: LeaveType | null;
  maximumCredits: number | null;
};

const LeaveLedgerAdjModal: FunctionComponent<LeaveLedgerAdjModalProps> = ({
  employeeId,
  modalState,
  setModalState,
  closeModalAction,
}) => {
  // SWR fetch list of leave benefits
  const {
    data: swrLeaveBenefits,
    isLoading: isLoadingLeaveBenefits,
    error: errorLeaveBenefits,
  } = useSWR(modalState ? '/leave-benefits' : null, fetcherEMS);

  // zustand store initialization
  const { GetLeaveBenefitsSuccess, GetLeaveBenefitsFail } = useLeaveBenefitStore((state) => ({
    GetLeaveBenefitsSuccess: state.getLeaveBenefitsSuccess,
    GetLeaveBenefitsFail: state.getLeaveBenefitsFail,
  }));

  // react hook form initialization
  const {
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isValid, defaultValues },
  } = useForm<LeaveAdjustmentForm>({
    defaultValues: {
      category: '',
      leaveBenefitsId: '',
      value: 0,
      employeeId: employeeId,
      remarks: null,
    },
  });

  // form submission
  const onSubmit = (data: LeaveAdjustmentForm) => {
    console.log(data);

    // handlePostResult()
  };

  // asynchronous request to post user and roles
  const handlePostResult = async (data: LeaveAdjustmentForm) => {
    const { error, result } = await postEmpMonitoring('/user-roles', data); // REPLACE postHRIS to postEmpMonitoring

    if (error) {
      // SetErrorUser(result);
    } else {
      // SetPostUser(result);

      reset();
      closeModalAction();
    }
  };

  // state transformed leave benefits
  const [transformedLeaves, setTransformedLeaves] = useState<Array<MutatedLeaveBenefitOption>>([]);

  // selected leave benefit
  const [selectedLeaveBenefit, setSelectedLeaveBenefit] = useState<MutatedLeaveBenefit>({
    id: null,
    leaveName: null,
    leaveType: null,
    maximumCredits: null,
  } as MutatedLeaveBenefit);

  // show remarks
  const [showRemarks, setShowRemarks] = useState<boolean>(false);

  // transform leave benefits
  const transformLeaveBenefits = (leaveBenefits: Array<LeaveBenefit>) => {
    const tempLeaveBenefits = leaveBenefits.map((leave) => {
      return {
        label: leave.leaveName,
        value: leave.id,
        leaveType: leave.leaveType,
        maximumCredits: leave.maximumCredits ?? null,
      };
    });

    setTransformedLeaves(tempLeaveBenefits);
  };

  // select leave benefits by id
  const getLeaveBenefitById = (id: string) => {
    const tempLeave = transformedLeaves.find((leave) => leave.value === id);

    setSelectedLeaveBenefit({
      id: tempLeave.value,
      leaveName: tempLeave.label,
      leaveType: tempLeave.leaveType,
      maximumCredits: tempLeave.maximumCredits,
    });
  };

  // close modal function
  const closeModal = () => {
    setSelectedLeaveBenefit({} as MutatedLeaveBenefit);
    reset();
    closeModalAction();
  };

  // handle remarks
  const handleRemarks = () => {
    setShowRemarks(!showRemarks);
    setValue('remarks', null);
  };

  // If modal is open, set action to fetch for leave benefits
  useEffect(() => {
    if (!modalState) {
      reset();
    }
  }, [modalState]);

  // set to zustand
  useEffect(() => {
    // success
    if (swrLeaveBenefits) {
      GetLeaveBenefitsSuccess(swrLeaveBenefits.data);

      // transform
      transformLeaveBenefits(swrLeaveBenefits.data);
    }

    // fail
    if (errorLeaveBenefits) {
      GetLeaveBenefitsFail(errorLeaveBenefits.message);
    }
  }, [swrLeaveBenefits, errorLeaveBenefits]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="sm" steady>
        <Modal.Header>
          <div className="flex justify-end">
            <div className="px-2 text-2xl font-medium text-gray-700">Leave Adjustment</div>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModal}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          {/* Notifications */}
          {errorLeaveBenefits ? (
            <AlertNotification alertType="info" notifMessage={errorLeaveBenefits} dismissible={true} />
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="adjModal">
            <div className="flex flex-col gap-5">
              {/** action type */}
              <SelectListRF
                id="category"
                selectList={adjustmentEntryType}
                controller={{
                  ...register('category'),
                }}
                label="Category"
                isError={errors.category ? true : false}
                errorMessage={errors.category?.message}
              />

              <SelectListRF
                id="leaveBenefitsId"
                selectList={transformedLeaves}
                controller={{
                  ...register('leaveBenefitsId', {
                    onChange: (e) => {
                      getLeaveBenefitById(e.target.value);
                    },
                  }),
                }}
                label="Leave Benefit"
                isError={errors.leaveBenefitsId ? true : false}
                errorMessage={errors.leaveBenefitsId?.message}
                isLoading={isLoadingLeaveBenefits}
              />

              <LabelInput
                id="creditValue"
                label="Credit/Debit Value"
                controller={{ ...register('value') }}
                helper={
                  selectedLeaveBenefit.leaveType === LeaveType.SPECIAL ? (
                    <span className="flex items-center px-2 text-xs font-light text-white rounded bg-amber-500">
                      {selectedLeaveBenefit.leaveType === LeaveType.SPECIAL
                        ? ` Maximum credit is ${selectedLeaveBenefit.maximumCredits}`
                        : ''}
                    </span>
                  ) : null
                }
                max={selectedLeaveBenefit.leaveType === LeaveType.SPECIAL ? selectedLeaveBenefit.maximumCredits : null}
                min={0}
                type="number"
                step="0.001"
              />

              <div className="flex flex-col gap-2">
                <div>
                  <button type="button" onClick={handleRemarks}>
                    {!showRemarks ? (
                      <span className="items-center text-xs font-medium text-blue-700">+Add Remarks</span>
                    ) : (
                      <span className="items-center text-xs font-medium text-red-700">-Remove Remarks</span>
                    )}
                  </button>
                </div>
                {showRemarks ? (
                  <LabelInput id="remarks" label="Remarks" controller={{ ...register('remarks') }} />
                ) : null}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="adjModal"
              className="disabled:cursor-not-allowed"
              disabled={isLoadingLeaveBenefits ? true : !isValid ? true : false}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveLedgerAdjModal;
