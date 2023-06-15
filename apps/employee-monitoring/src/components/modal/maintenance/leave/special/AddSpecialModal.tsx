import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { useLeaveBenefitStore } from 'apps/employee-monitoring/src/store/leave-benefits.store';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import {
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

const AddSpecialModal: FunctionComponent<AddModalProps> = ({
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
    getValues,
    register,
    reset,
    formState: { errors },
  } = useForm<LeaveBenefit>({
    resolver: yupResolver(LeaveBenefitSchema),
    mode: 'onChange',
    defaultValues: {
      leaveName: '',
      accumulatedCredits: null,
      canBeCarriedOver: false,
      maximumCredits: undefined,
      creditDistribution: null,
      isMonetizable: false,
      leaveType: LeaveType.SPECIAL,
    },
  });

  const onSubmit: SubmitHandler<LeaveBenefit> = (leave: LeaveBenefit) => {
    // set loading to true
    PostLeaveBenefit(true);
    handlePostLeave(leave);
  };

  // cancel or close action
  const onCancel = () => {
    reset();
    closeModalAction();
  };

  const handlePostLeave = async (leave: LeaveBenefit) => {
    const { error, result } = await postEmpMonitoring('/leave-benefits', leave);

    if (error) {
      // request is done so set loading to false and set value for error message
      PostLeaveBenefitFail(result);
    } else {
      // request is done so set loading to false and set value from returned response
      PostLeaveBenefitSuccess(result);

      // reset the form and call the close modal action
      onCancel();
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="sm">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">
              New Special Leave Benefit
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

          <form onSubmit={handleSubmit(onSubmit)} id="addSpecialModal">
            <div className="w-full mt-5">
              <div className="flex flex-col w-full gap-5">
                {/* special Name */}
                <LabelInput
                  id={'specialName'}
                  label={'Leave Name'}
                  controller={{ ...register('leaveName', { required: true }) }}
                  isError={errors.leaveName ? true : false}
                  errorMessage={errors.leaveName?.message}
                  disabled={IsLoading ? true : false}
                />

                {/* special Credits */}
                <LabelInput
                  id="specialMaximumCredits"
                  label="Credit Ceiling"
                  controller={{
                    ...register('maximumCredits'),
                  }}
                  isError={errors.maximumCredits ? true : false}
                  errorMessage={errors.maximumCredits?.message}
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
              form="addSpecialModal"
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

export default AddSpecialModal;
