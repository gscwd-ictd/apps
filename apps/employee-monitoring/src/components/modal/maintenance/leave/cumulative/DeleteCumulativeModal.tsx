import { Modal } from '@gscwd-apps/oneui';
import { useLeaveBenefitStore } from 'apps/employee-monitoring/src/store/leave-benefits.store';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { LeaveBenefit } from 'libs/utils/src/lib/types/leave-benefits.type';
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: LeaveBenefit;
};

const DeleteCumulativeModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const { handleSubmit, setValue } = useForm<LeaveBenefit>({
    mode: 'onChange',
    defaultValues: { id: rowData.id },
  });

  useEffect(() => {
    setValue('id', rowData.id);
  }, [modalState]);

  const {
    LeaveBenefitPostResponse,
    Error,
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

  const onSubmit: SubmitHandler<LeaveBenefit> = (sched: LeaveBenefit) => {
    // set to true
    DeleteLeaveBenefit(true);

    handleDeleteResult(sched.id);
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
      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Header withCloseBtn>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">Confirm Deletion</span>
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
          <form onSubmit={handleSubmit(onSubmit)} id="deletecumulativemodal">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <span className="px-2 text-lg">{rowData.leaveName}</span>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              type="button"
              onClick={closeModalAction}
              className="disabled:cursor-not-allowed w-[4rem] text-black bg-white active:bg-gray-200 hover:bg-gray-100 rounded border border-gray-200"
              disabled={IsLoading ? true : false}
            >
              <span className="text-xs font-normal">No</span>
            </button>
            <button
              type="submit"
              form="deletecumulativemodal"
              className="disabled:cursor-not-allowed w-[4rem] bg-red-500 hover:bg-red-400 active:bg-red-300 rounded text-white"
              disabled={IsLoading ? true : false}
            >
              <span className="text-xs font-normal">Yes</span>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteCumulativeModal;
