/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { FunctionComponent } from 'react';
import { isEmpty } from 'lodash';
import { SubmitHandler, useForm } from 'react-hook-form';
import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { TravelOrder } from 'libs/utils/src/lib/types/travel-order.type';
import { useTravelOrderStore } from 'apps/employee-monitoring/src/store/travel-order.store';

import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: TravelOrder;
};

const DeleteTravelOrderModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  // zustand store initialization
  const {
    IsLoading,

    DeleteTravelOrder,
    DeleteTravelOrderSuccess,
    DeleteTravelOrderFail,
  } = useTravelOrderStore((state) => ({
    IsLoading: state.loading.loadingTravelOrder,

    DeleteTravelOrder: state.deleteTravelOrder,
    DeleteTravelOrderSuccess: state.deleteTravelOrderSuccess,
    DeleteTravelOrderFail: state.deleteTravelOrderFail,
  }));

  const { handleSubmit } = useForm<TravelOrder>();

  const onSubmit: SubmitHandler<TravelOrder> = () => {
    if (!isEmpty(rowData.id)) {
      // DeleteTravelOrder();

      // handleDeleteResult();
      console.log(rowData.id);
    }
  };

  const handleDeleteResult = async () => {
    const { error, result } = await deleteEmpMonitoring(
      `/travel-order/${rowData.id}`
    );

    if (error) {
      DeleteTravelOrderFail(result);
    } else {
      DeleteTravelOrderSuccess(result);

      closeModalAction();
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Body>
          {/* Notifications */}
          {IsLoading ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="deleteTravelOrderForm">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <p className="px-2 mt-5 text-md font-medium text-center text-gray-600">
                  Are you sure you want to delete entry
                  <span className="px-2 text-md text-center font-bold">
                    {JSON.stringify(rowData.travelOrderNo)}
                  </span>
                  ?
                </p>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full gap-2">
            <button
              type="submit"
              form="deleteTravelOrderForm"
              className="w-full text-white h-[3rem] bg-red-500 rounded disabled:cursor-not-allowed hover:bg-red-400 active:bg-red-300"
              disabled={IsLoading ? true : false}
            >
              <span className="text-sm font-normal">Confirm</span>
            </button>

            <button
              type="button"
              className="w-full text-black bg-white border border-gray-200 rounded disabled:cursor-not-allowed active:bg-gray-200 hover:bg-gray-100"
              onClick={closeModalAction}
            >
              <span className="text-sm font-normal">Cancel</span>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteTravelOrderModal;
