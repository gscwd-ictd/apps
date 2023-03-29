import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';
import { useLeaveBenefitStore } from 'apps/employee-monitoring/src/store/leave-benefits.store';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import {
  CreditDistribution,
  LeaveBenefit,
  LeaveCategory,
} from 'libs/utils/src/lib/types/leave-benefits.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type EditModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: LeaveBenefit;
};

// mock
const distributionSelection: Array<SelectOption> = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

const EditRecurringModal: FunctionComponent<EditModalProps> = ({
  rowData,
  modalState,
  closeModalAction,
  setModalState,
}) => {
  const {
    LeaveBenefitPostResponse,
    Error,
    IsLoading,
    UpdateLeaveBenefit,
    UpdateLeaveBenefitFail,
    UpdateLeaveBenefitSuccess,
  } = useLeaveBenefitStore((state) => ({
    LeaveBenefitPostResponse: state.leaveBenefit.postResponse,
    IsLoading: state.loading.loadingLeaveBenefit,
    Error: state.error.errorLeaveBenefit,

    UpdateLeaveBenefit: state.updateLeaveBenefit,
    UpdateLeaveBenefitSuccess: state.updateLeaveBenefitSuccess,
    UpdateLeaveBenefitFail: state.updateLeaveBenefitFail,
  }));

  const {
    setValue,
    handleSubmit,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<LeaveBenefit>({
    mode: 'onChange',
    defaultValues: {
      id: rowData.id,
      leaveName: rowData.leaveName,
      accumulatedCredits: rowData.accumulatedCredits,
      canBeCarriedOver: false,
      category: LeaveCategory.RECURRING,
      creditDistribution: rowData.creditDistribution,
      isMonetizable: false,
      maximumCredits: rowData.maximumCredits,
    },
  });

  // load default values
  const loadNewDefaultValues = (leave: LeaveBenefit) => {
    setValue('id', leave.id);
    setValue('leaveName', leave.leaveName);
    setValue('accumulatedCredits', leave.accumulatedCredits);
    setValue('category', leave.category);
    setValue('canBeCarriedOver', leave.canBeCarriedOver);
    setValue('creditDistribution', leave.creditDistribution);
    setValue('isMonetizable', leave.isMonetizable);
    setValue('maximumCredits', leave.maximumCredits);
  };

  const onSubmit: SubmitHandler<LeaveBenefit> = (leave: LeaveBenefit) => {
    // console.log(leave);

    // set loading to true
    UpdateLeaveBenefit(true);

    handleEditLeave(leave);
  };

  const handleEditLeave = async (leave: LeaveBenefit) => {
    const { error, result } = await postEmpMonitoring('/leave-benefits', leave);

    if (error) {
      // request is done so set loading to false and set value for error message
      UpdateLeaveBenefitFail(result);
    } else {
      // request is done so set loading to false and set value from returned response
      UpdateLeaveBenefitSuccess(result);

      // call the close modal action
      closeModalAction();
    }
  };

  useEffect(() => {
    if (modalState === true) loadNewDefaultValues(rowData);
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">
              Edit Recurring Leave Benefit
            </span>
            <button
              className="w-[1.5rem] h-[1.5rem] items-center text-center text-white bg-gray-400 rounded"
              type="button"
              onClick={closeModalAction}
            >
              x
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          {/* Notification */}
          {IsLoading ? (
            <div className="fixed z-50 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={false}
              />
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="editrecurringmodal">
            <div className="w-full mt-5">
              <div className="flex flex-col w-full gap-5">
                {/* Recurring Name */}
                <LabelInput
                  id={'recurringName'}
                  label={'Leave Name'}
                  controller={{ ...register('leaveName', { required: true }) }}
                  isError={errors.leaveName ? true : false}
                  errorMessage={errors.leaveName?.message}
                  disabled={IsLoading ? true : false}
                />

                {/* Recurring Credits */}
                <LabelInput
                  id="recurringAccumulatedCredits"
                  label="Credits"
                  controller={{
                    ...register('accumulatedCredits', { required: true }),
                  }}
                  isError={errors.accumulatedCredits ? true : false}
                  errorMessage={errors.accumulatedCredits?.message}
                  disabled={IsLoading ? true : false}
                />

                {/* Recurring Distribution */}
                <SelectListRF
                  id="recurringDistribution"
                  label="Credit Distribution"
                  selectList={distributionSelection}
                  controller={{
                    ...register('creditDistribution', { required: true }),
                  }}
                  isError={errors.creditDistribution ? true : false}
                  disabled={IsLoading ? true : false}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="editrecurringmodal"
              className="disabled:cursor-not-allowed"
            >
              <span className="text-xs font-normal">Update</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditRecurringModal;
