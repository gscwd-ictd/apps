/* eslint-disable react/no-unescaped-entities */
import { AlertNotification, LoadingSpinner, Modal } from '@gscwd-apps/oneui';

// store and type
import { useOfficerOfTheDayStore } from 'apps/employee-monitoring/src/store/officer-of-the-day.store';
import { OfficerOfTheDay } from 'apps/employee-monitoring/src/utils/types/officer-of-the-day.type';

import { deleteEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';

import { isEmpty } from 'lodash';
import { FunctionComponent } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type DeleteModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
  rowData: OfficerOfTheDay;
};

const DeleteOfficerOfTheDayModal: FunctionComponent<DeleteModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
  rowData,
}) => {
  const { handleSubmit } = useForm<OfficerOfTheDay>();

  const { IsLoading, DeleteOfficerOfTheDay, DeleteeOfficerOfTheDayFail, DeleteeOfficerOfTheDaySuccess } =
    useOfficerOfTheDayStore((state) => ({
      IsLoading: state.loading.loadingOfficerOfTheDay,
      DeleteResponse: state.officerOfTheDay.deleteResponse,
      DeleteOfficerOfTheDay: state.deleteOfficerOfTheDay,
      DeleteeOfficerOfTheDaySuccess: state.deleteOfficerOfTheDaySuccess,
      DeleteeOfficerOfTheDayFail: state.deleteOfficerOfTheDayFail,
    }));

  const onSubmit: SubmitHandler<OfficerOfTheDay> = () => {
    if (!isEmpty(rowData._id)) {
      // set to true
      DeleteOfficerOfTheDay();

      handleDeleteResult(rowData._id);
    }
  };

  const handleDeleteResult = async (id: string) => {
    const { error, result } = await deleteEmpMonitoring(`/officer-of-the-day/${id}`);

    if (error) {
      // request is done so set loading to false
      DeleteeOfficerOfTheDayFail(result);
    } else {
      // request is done so set loading to false
      DeleteeOfficerOfTheDaySuccess(result);

      // close modal
      closeModalAction();
    }
  };

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="xs">
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)} id="deletestationschedmodal">
            <div className="w-full">
              <div className="flex flex-col w-full gap-5">
                <span className="px-2 mt-5 text-xl font-medium text-center text-gray-600">
                  Delete Officer Of The Day
                </span>
                <span className="px-2 text-lg text-center text-gray-400">"{rowData.name}"</span>
              </div>
            </div>
          </form>
          {IsLoading ? (
            <div className="flex justify-center w-full">
              <AlertNotification
                logo={<LoadingSpinner size="xs" />}
                alertType="info"
                notifMessage="Submitting request"
                dismissible={false}
              />
            </div>
          ) : null}
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
              form="deletestationschedmodal"
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

export default DeleteOfficerOfTheDayModal;
