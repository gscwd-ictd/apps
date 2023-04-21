import {
  AlertNotification,
  Button,
  LoadingSpinner,
  Modal,
} from '@gscwd-apps/oneui';
import { LabelInput } from 'apps/employee-monitoring/src/components/inputs/LabelInput';
import { SelectListRF } from 'apps/employee-monitoring/src/components/inputs/SelectListRF';
import { TypesMockData } from 'apps/employee-monitoring/src/pages/maintenance/events/training-and-seminar-types';
import { useTrainingTypesStore } from 'apps/employee-monitoring/src/store/training-type.store';
import { useTrainingsStore } from 'apps/employee-monitoring/src/store/training.store';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';
import { postEmpMonitoring } from 'apps/employee-monitoring/src/utils/helper/employee-monitoring-axios-helper';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';
import { TrainingType } from 'libs/utils/src/lib/types/training-type.type';
import { Training } from 'libs/utils/src/lib/types/training.type';
import { isEmpty } from 'lodash';
import { FunctionComponent, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useSWR from 'swr';
import Toggle from '../../../switch/Toggle';

type AddModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

const AddTrainingsModal: FunctionComponent<AddModalProps> = ({
  modalState,
  setModalState,
  closeModalAction,
}) => {
  const [trainingTypes, setTrainingTypes] = useState<Array<SelectOption>>([]);
  const [inOffice, setInOffice] = useState<boolean>(false);

  const {
    Error,

    IsLoading,
    PostTraining,
    PostTrainingFail,
    PostTrainingSuccess,
  } = useTrainingsStore((state) => ({
    IsLoading: state.loading.loadingTraining,
    Error: state.error.errorTraining,
    PostTraining: state.postTraining,
    PostTrainingSuccess: state.postTrainingSuccess,
    PostTrainingFail: state.postTrainingFail,
  }));

  const {
    EmptyResponse,
    GetTrainingTypes,
    GetTrainingTypesFail,
    GetTrainingTypesSuccess,
  } = useTrainingTypesStore((state) => ({
    EmptyResponse: state.emptyResponse,
    GetTrainingTypes: state.getTrainingTypes,
    GetTrainingTypesFail: state.getTrainingTypesFail,
    GetTrainingTypesSuccess: state.getTrainingTypesSuccess,
  }));

  // fetch data for list of holidays
  const {
    data: swrTrainingTypes,
    error: swrError,
    isLoading: swrIsLoading,
  } = useSWR('/trainings-seminars-types', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<Training>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      dateFrom: null,
      dateTo: null,
      hours: undefined,
      inOffice: false,
      location: '',
      learningServiceProvider: '',
      seminarTrainingType: { name: '' },
      assignedEmployees: [],
    },
  });

  const onSubmit: SubmitHandler<Training> = (training: Training) => {
    // set loading to true
    PostTraining();

    handlePostTraining(training);
  };

  const handlePostTraining = async (training: Training) => {
    const { error, result } = await postEmpMonitoring(
      '/trainings-seminars',
      training
    );

    if (error) {
      // request is done so set loading to false and set value for error message
      PostTrainingFail(result);
    } else {
      // request is done so set loading to false and set value from returned response
      PostTrainingSuccess(result);

      // call the close modal action
      closeModalAction();
    }
  };

  const transformTrainingTypes = (trainingTypes: Array<TrainingType>) => {
    // initialize the selectOption array
    const selectOption: Array<SelectOption> = [];
    trainingTypes &&
      trainingTypes.map((trainingType: TrainingType) => {
        selectOption.push({
          ...selectOption,
          label: trainingType.name,
          value: trainingType.id,
        });
      });

    setTrainingTypes(selectOption);
  };

  // initialize zustand state update
  useEffect(() => {
    EmptyResponse();
    if (swrIsLoading) {
      GetTrainingTypes(swrIsLoading);
    }
  }, [swrIsLoading]);

  // upon success/fail of swr request
  useEffect(() => {
    if (!isEmpty(swrTrainingTypes)) {
      GetTrainingTypesSuccess(swrIsLoading, swrTrainingTypes.data);
      transformTrainingTypes(swrTrainingTypes.data);
      // transformTrainingTypes(TypesMockData); //! Remove this!
    }

    if (!isEmpty(swrError)) {
      GetTrainingTypesFail(swrIsLoading, swrError);
      // transformTrainingTypes(TypesMockData); //! Remove this!
    }
  }, [swrError, swrTrainingTypes]);

  // in-office watcher
  useEffect(() => {
    if (inOffice === true) setValue('inOffice', true);
    if (inOffice === false) setValue('inOffice', false);
  }, [inOffice]);

  // register on page load
  useEffect(() => {
    register('inOffice');
  }, []);

  return (
    <>
      <Modal open={modalState} setOpen={setModalState} steady size="md">
        <Modal.Header>
          <div className="flex justify-between w-full">
            <span className="text-2xl text-gray-600">
              New Trainings & Seminars
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
          {swrIsLoading ? (
            <LoadingSpinner size="lg" />
          ) : (
            <>
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
              <form onSubmit={handleSubmit(onSubmit)} id="addtrainingsmodal">
                <div className="w-full mt-5">
                  <div className="flex flex-col w-full gap-5">
                    <LabelInput
                      id={'trainingName'}
                      label={'Name of Training'}
                      controller={{ ...register('name', { required: true }) }}
                      isError={errors.name ? true : false}
                      errorMessage={errors.name?.message}
                      disabled={IsLoading ? true : false}
                    />

                    {/* Get list of Training Types */}
                    <SelectListRF
                      id="trainingType"
                      selectList={trainingTypes}
                      controller={{
                        ...register('seminarTrainingType', { required: true }),
                      }}
                      label="Training Type"
                      disabled={IsLoading ? true : false}
                    />

                    <LabelInput
                      id="trainingDateStart"
                      label="Date Start"
                      controller={{
                        ...register('dateFrom', { required: true }),
                      }}
                      type="date"
                      disabled={IsLoading ? true : false}
                    />

                    <LabelInput
                      id="trainingDateEnd"
                      label="Date End"
                      controller={{ ...register('dateTo', { required: true }) }}
                      type="date"
                      disabled={IsLoading ? true : false}
                    />

                    <LabelInput
                      id="trainingTotalHours"
                      label="Total Hours"
                      controller={{ ...register('hours', { required: true }) }}
                      disabled={IsLoading ? true : false}
                    />

                    {/* Training is in office */}
                    <div className="flex gap-2 text-start">
                      <Toggle
                        labelPosition="top"
                        enabled={inOffice}
                        setEnabled={setInOffice}
                        label="In-office Training:"
                        disabled={IsLoading ? true : false}
                      />
                      <div
                        className={`text-xs ${
                          inOffice ? 'text-blue-400' : 'text-gray-400'
                        }`}
                      >
                        {inOffice ? (
                          <button
                            onClick={() => setInOffice((prev) => !prev)}
                            className="underline"
                            type="button"
                            disabled={IsLoading ? true : false}
                          >
                            <span>Yes</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setInOffice((prev) => !prev)}
                            className="underline"
                            type="button"
                            disabled={IsLoading ? true : false}
                          >
                            <span>No</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <LabelInput
                      id="trainingProvider"
                      label="Provider"
                      controller={{
                        ...register('learningServiceProvider', {
                          required: true,
                        }),
                      }}
                      disabled={IsLoading ? true : false}
                    />

                    <LabelInput
                      id="trainingLocation"
                      label="Location"
                      controller={{
                        ...register('location', { required: true }),
                      }}
                      disabled={IsLoading ? true : false}
                    />
                  </div>
                </div>
              </form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              variant="info"
              type="submit"
              form="addtrainingsmodal"
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

export default AddTrainingsModal;
