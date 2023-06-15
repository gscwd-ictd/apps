import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';
import { useLeaveBenefitStore } from 'apps/employee-monitoring/src/store/leave-benefits.store';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import {
  CreditDistribution,
  LeaveBenefit,
  LeaveType,
} from 'libs/utils/src/lib/types/leave-benefits.type';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LeaveBenefitSchema from '../LeaveBenefitSchema';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

// mock
const distributionSelection: Array<SelectOption> = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

const AddRecurringModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  const {
    IsLoading,
    PostLeaveBenefit,
    PostLeaveBenefitFail,
    PostLeaveBenefitSuccess,
  } = useLeaveBenefitStore((state) => ({
    LeaveBenefitPostResponse: state.leaveBenefit.postResponse,
    IsLoading: state.loading.loadingLeaveBenefit,
    Error: state.error.errorLeaveBenefit,

    PostLeaveBenefit: state.postLeaveBenefit,
    PostLeaveBenefitSuccess: state.postLeaveBenefitSuccess,
    PostLeaveBenefitFail: state.postLeaveBenefitFail,
  }));

  const {
    handleSubmit,

    register,
    formState: { errors },
  } = useForm<LeaveBenefit>({
    resolver: yupResolver(LeaveBenefitSchema),
    mode: 'onChange',
    defaultValues: {
      leaveName: '',
      accumulatedCredits: undefined,
      canBeCarriedOver: false,
      leaveType: LeaveType.RECURRING,
      creditDistribution: CreditDistribution.YEARLY,
      isMonetizable: false,
    },
  });

  const onSubmit: SubmitHandler<LeaveBenefit> = (leave: LeaveBenefit) => {
    // console.log(leave);

    // set loading to true
    PostLeaveBenefit(true);

    handlePostLeave(leave);
  };

  const handlePostLeave = async (leave: LeaveBenefit) => {
    const { error, result } = await postEmpMonitoring('/leave-benefits', leave);

    if (error) {
      // request is done so set loading to false and set value for error message
      PostLeaveBenefitFail(result);
    } else {
      // request is done so set loading to false and set value from returned response
      PostLeaveBenefitSuccess(result);

      // call the close modal action
      closeModalAction();
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">
              New Recurring Leave Benefit
            </span>
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

          <form onSubmit={handleSubmit(onSubmit)} id="addrecurringmodal">
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
                errorMessage={errors.creditDistribution?.message}
                disabled={IsLoading ? true : false}
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="addrecurringmodal"
              className="disabled:cursor-not-allowed"
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddRecurringModal;
