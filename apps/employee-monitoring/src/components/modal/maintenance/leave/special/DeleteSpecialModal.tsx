/* eslint-disable react/no-unescaped-entities */
import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { useLeaveBenefitStore } from 'apps/employee-monitoring/src/store/leave-benefits.store';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { LeaveBenefit } from 'libs/utils/src/lib/types/leave-benefits.type';
import { isEmpty } from 'lodash';
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: LeaveBenefit;
};

const DeleteSpecialModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const { handleSubmit } = useForm<LeaveBenefit>();

  const {
    IsLoading,
    DeleteLeaveBenefit,
    DeleteLeaveBenefitFail,
    DeleteLeaveBenefitSuccess,
  } = useLeaveBenefitStore((state) => ({
    LeaveBenefitPostResponse: state.leaveBenefit.deleteResponse,
    IsLoading: state.loading.loadingLeaveBenefit,
    Error: state.error.errorLeaveBenefit,

    DeleteLeaveBenefit: state.deleteLeaveBenefit,
    DeleteLeaveBenefitSuccess: state.deleteLeaveBenefitSuccess,
    DeleteLeaveBenefitFail: state.deleteLeaveBenefitFail,
  }));

  const onSubmit: SubmitHandler<LeaveBenefit> = () => {
    if (!isEmpty(rowData.id)) {
      // set to true
      DeleteLeaveBenefit(true);

      handleDeleteResult(rowData.id);
    }
  };

  const handleDeleteResult = async (id: string) => {
    const { error, result } = await deleteEmpMonitoring(`/leave-benefit/${id}`);

    if (error) {
      // request is done so set loading to false
      DeleteLeaveBenefitFail(result);
    } else {
      // request is done so set loading to false
      DeleteLeaveBenefitSuccess(result);

      // close modal
      closeModalAction();
    }
  };

  return (
    <>
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

      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} id="deletespecialmodal">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <span className="px-2 mt-5 text-xl font-medium text-center text-gray-600">
                  Delete Leave Benefit
                </span>
                <span className="px-2 text-lg text-center text-gray-400">
                  "{rowData.leaveName}"
                </span>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-row-reverse justify-between w-full gap-2">
            <button
              type="button"
              onClick={closeModalAction}
              className="w-full text-black bg-white border border-gray-200 rounded disabled:cursor-not-allowed active:bg-gray-200 hover:bg-gray-100"
              disabled={IsLoading ? true : false}
            >
              <span className="font-normal text-md">No</span>
            </button>
            <button
              type="submit"
              form="deletespecialmodal"
              className="w-full text-white h-[3rem] bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400 active:bg-red-300"
              disabled={IsLoading ? true : false}
            >
              <span className="font-normal text-md">Yes</span>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteSpecialModal;
