/* eslint-disable react-hooks/exhaustive-deps */
import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { yupResolver } from '@hookform/resolvers/yup';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { useOfficerOfTheDayStore } from 'apps/employee-monitoring/src/store/officer-of-the-day.store';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import {
  FormPostOfficerOfTheDay,
  OfficerOfTheDay,
} from 'apps/employee-monitoring/src/utils/types/officer-of-the-day.type';
import { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { isEmpty } from 'lodash';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const yupSchema = yup.object().shape({
  //   id: yup.string().notRequired().trim(),
  name: yup.string().nullable(false).required().label('Name'),
  assignment: yup.string().nullable(false).required().label('Assignment'),
  dateFrom: yup.string().nullable(false).required().label('Date From'),
  dateTo: yup.string().nullable(false).required().label('Date To'),
});

const AddOfficerOfTheDayModal: FunctionComponent<AddModalProps> = ({ modalState, setModalState, closeModalAction }) => {
  const {
    PostOfficerOfTheDay,
    SetPostOfficerOfTheDay,

    SetErrorOfficerOfTheDay,
    EmptyResponse,
  } = useOfficerOfTheDayStore((state) => ({
    PostOfficerOfTheDay: state.postOfficerOfTheDay,
    SetPostOfficerOfTheDay: state.setPostOfficerOfTheDay,

    SetErrorOfficerOfTheDay: state.setErrorOfficerOfTheDay,
    EmptyResponse: state.emptyResponse,
  }));

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting: postFormLoading },
  } = useForm<FormPostOfficerOfTheDay>({
    mode: 'onChange',
    // reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
      assignment: '',
      dateFrom: '',
      dateTo: '',
      app: 'ems',
    },
    resolver: yupResolver(yupSchema),
  });

  const onSubmit: SubmitHandler<FormPostOfficerOfTheDay> = (data: FormPostOfficerOfTheDay) => {
    EmptyResponse();

    handlePostResult(data);
  };

  const handlePostResult = async (data: FormPostOfficerOfTheDay) => {
    const { error, result } = await postEmpMonitoring('/officer-of-the-day', data);

    if (error) {
      // set value for error message
      SetErrorOfficerOfTheDay(result);
    } else {
      // set value from returned response
      SetPostOfficerOfTheDay(result);
      //   mutate('/holidays');

      reset();
      closeModalAction();
    }
  };

  // If modal is open, reset input values
  useEffect(() => {
    if (!modalState) {
      reset();
    }
  }, [modalState]);

  return (
    <>
      {/* Notification */}
      {!isEmpty(PostOfficerOfTheDay) ? (
        <ToastNotification toastType="success" notifMessage="Officer of the day added successfully" />
      ) : null}
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
          {/* Notifications */}
          {postFormLoading ? (
            <AlertNotification
              logo={<LoadingSpinner size="xs" />}
              alertType="info"
              notifMessage="Submitting request"
              dismissible={true}
            />
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} id="addOfficerOfTheDay">
            <div className="flex flex-col w-full gap-5">
              {/** name */}
              <LabelInput
                id={'name'}
                label={'Name'}
                controller={{ ...register('name') }}
                isError={errors.name ? true : false}
                errorMessage={errors.name?.message}
              />

              <LabelInput
                id={'assignment'}
                label={'Assignment'}
                controller={{ ...register('assignment') }}
                isError={errors.assignment ? true : false}
                errorMessage={errors.assignment?.message}
              />

              {/** Date From */}
              <LabelInput
                id={'dateFrom'}
                type="date"
                label={'Date From'}
                controller={{ ...register('dateFrom') }}
                isError={errors.dateFrom ? true : false}
                errorMessage={errors.dateFrom?.message}
              />

              {/** Date To */}
              <LabelInput
                id={'dateTo'}
                type="date"
                label={'Date To'}
                controller={{ ...register('dateTo') }}
                isError={errors.dateTo ? true : false}
                errorMessage={errors.dateTo?.message}
              />
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="addOfficerOfTheDay"
              className="disabled:cursor-not-allowed"
              disabled={postFormLoading ? true : false}
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
