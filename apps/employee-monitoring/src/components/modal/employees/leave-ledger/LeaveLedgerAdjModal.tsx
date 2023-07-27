import { Button, Modal } from '@gscwd-apps/oneui';
import {
  LeaveBenefit,
  LeaveType,
} from 'libs/utils/src/lib/types/leave-benefits.type';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { LabelInput } from '../../../inputs/LabelInput';
import { SelectListRF } from '../../../inputs/SelectListRF';
import { adjustmentEntryType } from 'libs/utils/src/lib/constants/leave-ledger-adjustment.const';
import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import {
  MutatedLeaveBenefit,
  useLeaveLedgerStore,
} from 'apps/employee-monitoring/src/store/leave-ledger.store';

enum ActionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

type LeaveLedgerAdjModalProps = {
  employeeId: string;
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  closeModalAction: () => void;
};

type LeaveLedgerForm = {
  employeeId: string;
  actionType: ActionType;
  particulars?: string;
  leaveBenefitId: string;
  leaveBenefitType: LeaveType;
  leaveBenefitName: string;
  value: number;
  maximumCredits: number;
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
  const {
    register,
    reset,
    getValues,
    handleSubmit,
    formState: { errors, isValid, defaultValues },
  } = useForm<LeaveLedgerForm>({
    defaultValues: {
      employeeId: employeeId,
      leaveBenefitId: null,
      leaveBenefitName: null,
      actionType: null,
    },
  });

  // store
  const {
    getLeaveLedger,
    getLeaveLedgerSuccess,
    getLeaveLedgerFail,
    getLeaveBenefits,
    getLeaveBenefitsFail,
    getLeaveBenefitsSuccess,
  } = useLeaveLedgerStore((state) => ({
    getLeaveBenefits: state.getLeaveBenefits,
    getLeaveBenefitsSuccess: state.getLeaveBenefitsSuccess,
    getLeaveBenefitsFail: state.getLeaveBenefitsFail,
    getLeaveLedger: state.getLeaveLedger,
    getLeaveLedgerSuccess: state.getLeaveLedgerSuccess,
    getLeaveLedgerFail: state.getLeaveLedgerFail,
  }));

  const onSubmit = (data: LeaveLedgerForm) => {
    console.log(data);
    //
  };

  // state transformed leave benefits
  const [transformedLeaves, setTransformedLeaves] = useState<
    Array<MutatedLeaveBenefitOption>
  >([]);

  // selected leave benefit
  const [selectedLeaveBenefit, setSelectedLeaveBenefit] =
    useState<MutatedLeaveBenefit>({
      id: null,
      leaveName: null,
      leaveType: null,
      maximumCredits: null,
    } as MutatedLeaveBenefit);

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

  // swr
  const {
    data: swrLeaveBenefits,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR('/leave-benefits', fetcherEMS);

  // loading
  useEffect(() => {
    if (swrIsLoading) {
      getLeaveBenefits();
    }
  }, [swrIsLoading]);

  // set
  useEffect(() => {
    // success
    if (swrLeaveBenefits) {
      getLeaveBenefitsSuccess(swrLeaveBenefits.data);

      // transform
      transformLeaveBenefits(swrLeaveBenefits.data);
    }

    // fail
    if (swrError) {
      getLeaveBenefitsFail(swrError.message);
    }
  }, [swrLeaveBenefits, swrError]);

  // on open
  useEffect(() => {
    if (modalState) {
      register('leaveBenefitName');
      register('leaveBenefitType');
      register('maximumCredits');
    } else if (!modalState) closeModal();
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="sm" steady>
        <Modal.Header>
          <div className="flex justify-end">
            <div className="px-2 text-2xl font-medium text-gray-700">
              Leave Adjustment
            </div>
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
          <form onSubmit={handleSubmit(onSubmit)} id="adjModal">
            <div className="flex flex-col gap-5">
              {/** action type */}
              <SelectListRF
                id="actionType"
                selectList={adjustmentEntryType}
                controller={{
                  ...register('actionType'),
                }}
                label="Category"
                isError={errors.actionType ? true : false}
                errorMessage={errors.actionType?.message}

                // disabled={IsLoading ? true : false}
              />

              <SelectListRF
                id="leaveBenefitId"
                selectList={transformedLeaves}
                controller={{
                  ...register('leaveBenefitId', {
                    onChange: (e) => {
                      getLeaveBenefitById(e.target.value);
                    },
                  }),
                }}
                label="Leave Benefit"
                isError={errors.leaveBenefitId ? true : false}
                errorMessage={errors.leaveBenefitId?.message}
              />

              <LabelInput
                id="creditValue"
                label="Credit/Debit Value"
                controller={{ ...register('value') }}
                helper={
                  selectedLeaveBenefit.leaveType === LeaveType.SPECIAL
                    ? ` Maximum credit is ${selectedLeaveBenefit.maximumCredits}`
                    : ''
                }
                max={
                  selectedLeaveBenefit.leaveType === LeaveType.SPECIAL
                    ? selectedLeaveBenefit.maximumCredits
                    : null
                }
                min={1}
                type="number"
              />
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
              disabled={swrIsLoading ? true : !isValid ? true : false}
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
