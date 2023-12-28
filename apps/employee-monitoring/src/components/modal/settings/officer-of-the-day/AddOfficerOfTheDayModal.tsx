/* eslint-disable react-hooks/exhaustive-deps */
import { AlertNotification, Button, LoadingSpinner, Modal } from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { useOfficerOfTheDayStore } from 'apps/employee-monitoring/src/store/officer-of-the-day.store';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { OfficerOfTheDay } from 'apps/employee-monitoring/src/utils/types/officer-of-the-day.type';
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const OfficerOfTheDaySchema = yup.object().shape({
  //   id: yup.string().notRequired().trim(),
  name: yup.string().nullable(false).required().label('Name'),
  assignment: yup.string().nullable(false).required().label('Assignment'),
  dateFrom: yup.string().nullable(false).required().label('Date From'),
  dateTo: yup.string().nullable(false).required().label('Date To'),
});

const AddOfficerOfTheDayModal: FunctionComponent<AddModalProps> = ({ modalState, setModalState, closeModalAction }) => {
  const { IsLoading, PostOfficerOfTheDay, PostOfficerOfTheDayFail, PostOfficerOfTheDaySuccess } =
    useOfficerOfTheDayStore((state) => ({
      OfficerOfTheDayPostResponse: state.officerOfTheDay.postResponse,
      IsLoading: state.loading.loadingOfficerOfTheDay,
      Error: state.error.errorOfficerOfTheDay,

      PostOfficerOfTheDay: state.postOfficerOfTheDay,
      PostOfficerOfTheDaySuccess: state.postOfficerOfTheDaySuccess,
      PostOfficerOfTheDayFail: state.postOfficerOfTheDayFail,
    }));

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid },
  } = useForm<OfficerOfTheDay>({
    resolver: yupResolver(OfficerOfTheDaySchema),
    mode: 'onChange',
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
      assignment: '',
      dateFrom: '',
      dateTo: '',
    },
  });

  // reset all values
  const resetToDefaultValues = () => {
    reset();
  };

  const onSubmit: SubmitHandler<OfficerOfTheDay> = (officerOfTheDay: OfficerOfTheDay) => {
    // set loading to true
    PostOfficerOfTheDay();

    handlePostResult(officerOfTheDay);
  };

  const handlePostResult = async (data: OfficerOfTheDay) => {
    const { error, result } = await postEmpMonitoring('/officer-of-the-day', data);

    if (error) {
      // set value for error message
      PostOfficerOfTheDayFail(result);
    } else {
      // set value from returned response
      PostOfficerOfTheDaySuccess(result);
      //   mutate('/holidays');

      reset();
      closeModalAction();
    }
  };

  useEffect(() => {
    if (modalState === true) resetToDefaultValues();
  }, [modalState]);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-xl font-medium">New Officer Of The Day</span>
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

          <form onSubmit={handleSubmit(onSubmit)} id="addofficerofthedaymodal">
            <div className="flex flex-col w-full gap-5">
              {/** name */}
              <LabelInput
                id={'name'}
                label={'Name'}
                controller={{ ...register('name') }}
                isError={errors.name ? true : false}
                errorMessage={errors.name?.message}
                disabled={IsLoading ? true : false}
              />

              <LabelInput
                id={'assignment'}
                label={'Assignment'}
                controller={{ ...register('assignment') }}
                isError={errors.assignment ? true : false}
                errorMessage={errors.assignment?.message}
                disabled={IsLoading ? true : false}
              />

              {/** Date From */}
              <LabelInput
                id={'dateFrom'}
                type="date"
                label={'Date From'}
                controller={{ ...register('dateFrom') }}
                isError={errors.dateFrom ? true : false}
                errorMessage={errors.dateFrom?.message}
                disabled={IsLoading ? true : false}
              />

              {/** Date To */}
              <LabelInput
                id={'dateTo'}
                type="date"
                label={'Date To'}
                controller={{ ...register('dateTo') }}
                isError={errors.dateTo ? true : false}
                errorMessage={errors.dateTo?.message}
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
              form="addofficerofthedaymodal"
              className="disabled:cursor-not-allowed"
              disabled={IsLoading ? true : !isValid ? true : false}
            >
              <span className="text-xs font-normal">Submit</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddOfficerOfTheDayModal;
