import { Modal } from '@gscwd-apps/oneui';
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
import Select from 'react-select';

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
  particulars: string;
  leaveBenefitId: string;
  leaveBenefitType: LeaveType;
  leaveBenefitName: string;
  value: number;
  maxCreditValue: number;
};

type MutatedLeaveBenefitOption = {
  label: string;
  value: string;
  leaveType: string;
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
    handleSubmit,
    formState: { errors },
  } = useForm<LeaveLedgerForm>({
    defaultValues: { employeeId: employeeId },
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

  const onSubmit = () => {
    //
  };

  // state transformed leave benefits
  const [transformedLeaves, setTransformedLeaves] = useState<
    Array<MutatedLeaveBenefitOption>
  >([]);

  // selected leave benefit
  const [selectedLeaveBenefit, setSelectedLeaveBenefit] =
    useState<MutatedLeaveBenefitOption>({
      label: '',
      leaveType: '',
      maximumCredits: null,
      value: null,
    } as MutatedLeaveBenefitOption);

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

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} size="sm" steady>
        <Modal.Header>
          <div className="flex justify-end">
            <div className="px-2 text-2xl font-medium text-gray-700">
              Leave Ledger Adjustment
            </div>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-md text-xl p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={closeModalAction}
            >
              <i className="bx bx-x"></i>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} id="adjModal">
            <div className="flex flex-col gap-4">
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
                radiusClassName="rounded"

                // disabled={IsLoading ? true : false}
              />

              <Select
                id="customReactSchedule"
                name="schedules"
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                options={transformedLeaves}
                className="z-50 w-full basic-multi-select"
                classNamePrefix="select2-selection-leave"
                value={selectedLeaveBenefit}
                menuPosition="fixed"
                menuPlacement="auto"
                menuShouldScrollIntoView
                onChange={(newValue) => setSelectedLeaveBenefit(newValue)}
              />

              <LabelInput
                id="creditValue"
                label="Credit/Debit Value"
                max={
                  selectedLeaveBenefit.leaveType === LeaveType.SPECIAL
                    ? selectedLeaveBenefit.maximumCredits
                    : null
                }
                type="number"
                radiusClassName="rounded"
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LeaveLedgerAdjModal;
