/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { NomineeType, TrainingNominationStatus, TrainingStatus } from 'libs/utils/src/lib/enums/training.enum';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import { useEffect } from 'react';
import TrainingNominationModal from './TrainingNominationModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { ConfirmationNominationModal } from './ConfirmationModal';
import UseRenderTrainingNomineeStatus from 'apps/portal/src/utils/functions/RenderTrainingNomineeStatus';
import SkipNominationModal from './SkipNominationModal';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { DataTablePortal, useDataTable } from 'libs/oneui/src/components/Tables/DataTablePortal';
import { NominatedEmployees } from 'libs/utils/src/lib/types/training.type';
import { createColumnHelper } from '@tanstack/react-table';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import { ApprovalType } from 'libs/utils/src/lib/enums/approval-type.enum';
import UseRenderTrainingNomineeType from 'apps/portal/src/utils/functions/RenderTrainingNomineeType';
import { SelectOption } from 'libs/utils/src/lib/types/select.type';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const TrainingDetailsModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    loadingResponse,
    errorRecommendedEmployee,
    errorNominatedEmployeeList,
    individualTrainingDetails,
    nominatedEmployeeList,
    nominatedEmployees,
    auxiliaryEmployees,
    trainingNominationModalIsOpen,
    confirmNominationModalIsOpen,
    trainingModalIsOpen,
    skipNominationModalIsOpen,
    postResponseApply,
    setSkipNominationModalIsOpen,
    setConfirmNominationModalIsOpen,
    setTrainingNominationModalIsOpen,
    getRecommendedEmployees,
    getRecommendedEmployeesSuccess,
    getRecommendedEmployeesFail,
    getNominatedEmployeeList,
    getNominatedEmployeeListSuccess,
    getNominatedEmployeeListFail,
    setNominatedEmployees,
    setAuxiliaryEmployees,
  } = useTrainingSelectionStore((state) => ({
    confirmNominationModalIsOpen: state.confirmNominationModalIsOpen,
    errorRecommendedEmployee: state.error.errorRecommendedEmployee,
    errorNominatedEmployeeList: state.error.errorNominatedEmployeeList,
    individualTrainingDetails: state.individualTrainingDetails,
    trainingNominationModalIsOpen: state.trainingNominationModalIsOpen,
    nominatedEmployeeList: state.nominatedEmployeeList,
    nominatedEmployees: state.nominatedEmployees,
    auxiliaryEmployees: state.auxiliaryEmployees,
    trainingModalIsOpen: state.trainingModalIsOpen,
    loadingResponse: state.loading.loadingResponse,
    skipNominationModalIsOpen: state.skipNominationModalIsOpen,
    postResponseApply: state.response.postResponseApply,
    setSkipNominationModalIsOpen: state.setSkipNominationModalIsOpen,
    setConfirmNominationModalIsOpen: state.setConfirmNominationModalIsOpen,
    setTrainingNominationModalIsOpen: state.setTrainingNominationModalIsOpen,
    getRecommendedEmployees: state.getRecommendedEmployees,
    getRecommendedEmployeesSuccess: state.getRecommendedEmployeesSuccess,
    getRecommendedEmployeesFail: state.getRecommendedEmployeesFail,
    getNominatedEmployeeList: state.getNominatedEmployeeList,
    getNominatedEmployeeListSuccess: state.getNominatedEmployeeListSuccess,
    getNominatedEmployeeListFail: state.getNominatedEmployeeListFail,
    setNominatedEmployees: state.setNominatedEmployees,
    setAuxiliaryEmployees: state.setAuxiliaryEmployees,
  }));

  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  const recommendedEmployeeUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/distributions/${individualTrainingDetails.distributionId}/recommended`;

  const {
    data: swrRecommendedEmployee,
    isLoading: swrRecommendedEmployeeIsLoading,
    error: swrRecommendedEmployeeError,
    mutate: mutateRecommendedEmployees,
  } = useSWR(individualTrainingDetails.distributionId ? recommendedEmployeeUrl : null, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });
  // Initial zustand state update
  useEffect(() => {
    if (swrRecommendedEmployeeIsLoading) {
      getRecommendedEmployees(swrRecommendedEmployeeIsLoading);
    }
  }, [swrRecommendedEmployeeIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrRecommendedEmployee)) {
      getRecommendedEmployeesSuccess(swrRecommendedEmployeeIsLoading, swrRecommendedEmployee);
    }

    if (!isEmpty(swrRecommendedEmployeeError)) {
      getRecommendedEmployeesFail(swrRecommendedEmployeeIsLoading, swrRecommendedEmployeeError.message);
    }
  }, [swrRecommendedEmployee, swrRecommendedEmployeeError]);

  const nominatedEmployeeUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/${individualTrainingDetails.trainingId}/nominees/${employeeDetails.employmentDetails.userId}`;

  const {
    data: swrNominatedEmployee,
    isLoading: swrNominatedEmployeeIsLoading,
    error: swrNominatedEmployeeError,
    mutate: mutateNominatedEmployees,
  } = useSWR(
    individualTrainingDetails.trainingId && employeeDetails.employmentDetails.userId ? nominatedEmployeeUrl : null,
    fetchWithToken,
    {}
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrNominatedEmployeeIsLoading) {
      getNominatedEmployeeList(swrNominatedEmployeeIsLoading);
    }
  }, [swrNominatedEmployeeIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrNominatedEmployee)) {
      getNominatedEmployeeListSuccess(swrNominatedEmployeeIsLoading, swrNominatedEmployee);
    }

    if (!isEmpty(swrNominatedEmployeeError)) {
      getNominatedEmployeeListFail(swrNominatedEmployeeIsLoading, swrNominatedEmployeeError.message);
    }
  }, [swrNominatedEmployee, swrNominatedEmployeeError]);

  // Initial zustand state update
  useEffect(() => {
    mutateNominatedEmployees();
  }, [individualTrainingDetails.distributionId, postResponseApply]);

  useEffect(() => {
    if (trainingModalIsOpen) {
      setNominatedEmployees([]);
      setAuxiliaryEmployees([]);
    }
  }, [trainingModalIsOpen]);

  //close training nomination modal
  const closeTrainingNominationModal = async () => {
    setTrainingNominationModalIsOpen(false);
  };

  //close confirmation modal
  const closeConfirmationModal = async () => {
    setConfirmNominationModalIsOpen(false);
  };

  //close confirmation modal
  const closeSkipNominationnModal = async () => {
    setSkipNominationModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();

  // Define table columns
  const columnHelper = createColumnHelper<NominatedEmployees>();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
      enableColumnFilter: false,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      // enableColumnFilter: false,
      cell: (info) => UseRenderTrainingNomineeStatus(info.getValue(), TextSize.TEXT_SM),
    }),
    columnHelper.accessor('nomineeType', {
      header: 'Type',
      // enableColumnFilter: false,
      cell: (info) => UseRenderTrainingNomineeType(info.getValue(), TextSize.TEXT_SM),
    }),
    columnHelper.accessor('remarks', {
      header: 'Remarks',
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
    }),
  ];

  const columnHelperNomination = createColumnHelper<SelectOption>();
  // for nominated employees columns
  const columnsNomination = [
    columnHelperNomination.accessor('label', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelperNomination.accessor('value', {
      header: 'Type',
      cell: (info) => UseRenderTrainingNomineeType(NomineeType.NOMINEE, TextSize.TEXT_SM),
    }),
  ];

  // for auxiliary/stand in columns
  const columnsAuxiliary = [
    columnHelperNomination.accessor('label', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelperNomination.accessor('value', {
      header: 'Type',
      cell: (info) => UseRenderTrainingNomineeType(NomineeType.STAND_IN, TextSize.TEXT_SM),
    }),
  ];

  // React Table initialization
  // list of submitted nominated employees
  const { table: submittedNominations } = useDataTable(
    {
      columns: columns,
      data: swrNominatedEmployee,
    },
    ApprovalType.NOMINEE_STATUS
  );

  //array of unsbubmitted nominations
  const { table: unsubmittedNominations } = useDataTable(
    {
      columns: columnsNomination,
      data: nominatedEmployees,
    },
    ApprovalType.NA
  );
  const { table: unsubmittedAuxiliary } = useDataTable(
    {
      columns: columnsAuxiliary,
      data: auxiliaryEmployees,
    },
    ApprovalType.NA
  );

  return (
    <>
      {/* failed to load previously nominated employee list */}
      {!isEmpty(errorNominatedEmployeeList) && trainingModalIsOpen ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorNominatedEmployeeList}: Failed to load nominated participants.`}
        />
      ) : null}

      {/* failed to load recommended employee list */}
      {!isEmpty(errorRecommendedEmployee) && trainingModalIsOpen ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorRecommendedEmployee}: Failed to load recommended participants.`}
        />
      ) : null}

      <Modal size={windowWidth > 1024 ? 'md' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Training Attendee Nomination</span>
              <button
                className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full flex flex-col gap-2">
            <ConfirmationNominationModal
              modalState={confirmNominationModalIsOpen}
              setModalState={setConfirmNominationModalIsOpen}
              closeModalAction={closeConfirmationModal}
            />

            <SkipNominationModal
              modalState={skipNominationModalIsOpen}
              setModalState={setSkipNominationModalIsOpen}
              closeModalAction={closeSkipNominationnModal}
            />

            <TrainingNominationModal
              modalState={trainingNominationModalIsOpen}
              setModalState={setTrainingNominationModalIsOpen}
              closeModalAction={closeTrainingNominationModal}
            />

            <div className="w-full flex flex-col gap-2 px-4 rounded">
              <div className="w-full flex flex-col gap-0">
                {/* loading post reponse */}
                {loadingResponse ? (
                  <AlertNotification
                    logo={<LoadingSpinner size="xs" />}
                    alertType="info"
                    notifMessage="Submitting Request"
                    dismissible={false}
                  />
                ) : null}
                <AlertNotification
                  alertType={
                    individualTrainingDetails.status === TrainingStatus.ON_GOING_NOMINATION
                      ? 'warning'
                      : individualTrainingDetails.status === TrainingStatus.NOMINATION_DONE
                      ? 'info'
                      : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_APPROVAL
                      ? 'warning'
                      : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
                      ? 'warning'
                      : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED
                      ? 'error'
                      : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_DECLINED
                      ? 'error'
                      : individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
                      ? 'warning'
                      : individualTrainingDetails.status === TrainingStatus.GM_DECLINED
                      ? 'error'
                      : individualTrainingDetails.status === TrainingStatus.FOR_BATCHING
                      ? 'info'
                      : individualTrainingDetails.status === TrainingStatus.DONE_BATCHING
                      ? 'info'
                      : individualTrainingDetails.status === TrainingStatus.UPCOMING
                      ? 'info'
                      : individualTrainingDetails.status === TrainingStatus.ON_GOING_TRAINING
                      ? 'info'
                      : individualTrainingDetails.status === TrainingStatus.REQUIREMENTS_SUBMISSION
                      ? 'info'
                      : individualTrainingDetails.status === TrainingStatus.PENDING
                      ? 'warning'
                      : individualTrainingDetails.status === TrainingStatus.COMPLETED
                      ? 'success'
                      : 'info'
                  }
                  notifMessage={
                    individualTrainingDetails.status === TrainingStatus.ON_GOING_NOMINATION
                      ? 'On Going Nomination'
                      : individualTrainingDetails.status === TrainingStatus.NOMINATION_DONE
                      ? 'Nomination Done'
                      : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_APPROVAL
                      ? 'For PDC Secretary Review'
                      : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
                      ? 'For PDC Chairman Review'
                      : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED
                      ? 'Disapproved by PDC Chairman'
                      : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARIAT_DECLINED
                      ? 'Disapproved by PDC Secretary'
                      : individualTrainingDetails.status === TrainingStatus.GM_APPROVAL
                      ? 'For General Manager Review'
                      : individualTrainingDetails.status === TrainingStatus.GM_DECLINED
                      ? 'Disapproved by General Manager'
                      : individualTrainingDetails.status === TrainingStatus.FOR_BATCHING
                      ? 'On Going Batching'
                      : individualTrainingDetails.status === TrainingStatus.DONE_BATCHING
                      ? 'Done Batching'
                      : individualTrainingDetails.status === TrainingStatus.UPCOMING
                      ? 'Upcoming'
                      : individualTrainingDetails.status === TrainingStatus.ON_GOING_TRAINING
                      ? 'On Going Training'
                      : individualTrainingDetails.status === TrainingStatus.REQUIREMENTS_SUBMISSION
                      ? 'For Requirements Submission'
                      : individualTrainingDetails.status === TrainingStatus.PENDING
                      ? 'Pending'
                      : individualTrainingDetails.status === TrainingStatus.COMPLETED
                      ? 'Completed'
                      : individualTrainingDetails.status
                  }
                  dismissible={false}
                />

                <AlertNotification
                  alertType={
                    individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_COMPLETED ||
                    individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_SUBMITTED
                      ? 'success'
                      : individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_PENDING
                      ? 'warning'
                      : individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_INELIGIBLE ||
                        individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_SKIPPED
                      ? 'error'
                      : 'info'
                  }
                  notifMessage={
                    individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_COMPLETED ||
                    individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_SUBMITTED
                      ? 'Nomination Submitted'
                      : individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_PENDING
                      ? 'Nomination Pending'
                      : individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_INELIGIBLE ||
                        individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_SKIPPED
                      ? 'Nomination Skipped'
                      : individualTrainingDetails.nominationStatus
                  }
                  dismissible={false}
                />
              </div>

              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col items-start w-full md:w-1/2 px-0.5 pb-3">
                  <label className="text-slate-500 text-md whitespace-nowrap sm:w-80 ">Course Title:</label>

                  <div className="w-auto pl-0 md:pl-4">
                    <label className="text-slate-500 h-12 w-96 text-md font-medium">
                      {individualTrainingDetails.courseTitle}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col  items-start w-full md:w-1/2 px-0.5 pb-3">
                  <label className="text-slate-500 text-md whitespace-nowrap sm:w-80">Duration:</label>

                  <div className="w-auto">
                    <label className="text-slate-500 h-12 pl-0 md:pl-4 text-md font-medium">
                      {DateFormatter(individualTrainingDetails.trainingStart, 'MM-DD-YYYY')} -{' '}
                      {DateFormatter(individualTrainingDetails.trainingEnd, 'MM-DD-YYYY')}{' '}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-start px-0.5 pb-3">
                  <label className="text-slate-500 text-md whitespace-nowrap sm:w-80">Location:</label>

                  <div className="w-auto pl-0 md:pl-4">
                    <label className="text-slate-500 h-12 w-96 text-md font-medium">
                      {individualTrainingDetails.location}
                    </label>
                  </div>
                </div>

                <div className="flex flex-row md:gap-2 justify-between items-start w-full px-0.5 pb-3">
                  <div className="flex flex-col justify-between items-start">
                    <label className="text-slate-500 text-md whitespace-nowrap">No. of Slots:</label>

                    <div className="pl-0 md:pl-4">
                      <label className="text-slate-500 h-12 text-md font-medium">
                        {individualTrainingDetails.numberOfSlots}
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-start px-0.5 pb-3">
                    <label className="text-slate-500 text-md whitespace-nowrap ">Source:</label>

                    <div className="pl-0 md:pl-4">
                      <label className="text-slate-500 h-12 text-md capitalize font-medium">
                        {individualTrainingDetails.source}
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-start px-0.5 pb-3">
                    <label className="text-slate-500 text-md whitespace-nowrap">Type:</label>

                    <div className="pl-0 md:pl-4">
                      <label className="text-slate-500 h-12 text-md capitalize font-medium">
                        {individualTrainingDetails?.type}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:gap-2 justify-between items-start md:items-start ">
                <label className="text-slate-500 text-md whitespace-nowrap sm:w-80">Participants:</label>

                <div className="w-auto ">
                  {individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_PENDING ? (
                    <Button
                      variant={'warning'}
                      size={'sm'}
                      loading={false}
                      onClick={() => setTrainingNominationModalIsOpen(true)}
                    >
                      <div className="flex justify-center">Set Participants</div>
                    </Button>
                  ) : null}
                </div>
              </div>

              {swrNominatedEmployee && swrNominatedEmployee?.length > 0 ? (
                <DataTablePortal
                  textSize={'text-md'}
                  model={submittedNominations}
                  showGlobalFilter={false}
                  showColumnFilter={false}
                  paginate={true}
                />
              ) : (
                <>
                  <DataTablePortal
                    textSize={'text-md'}
                    model={unsubmittedNominations}
                    showGlobalFilter={false}
                    showColumnFilter={false}
                    paginate={true}
                  />
                  <DataTablePortal
                    textSize={'text-md'}
                    model={unsubmittedAuxiliary}
                    showGlobalFilter={false}
                    showColumnFilter={false}
                    paginate={false}
                  />
                </>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="max-w-auto flex gap-4 ">
              {individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_COMPLETED ||
              individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_INELIGIBLE ||
              individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_SKIPPED ||
              individualTrainingDetails.nominationStatus === TrainingNominationStatus.NOMINATION_SUBMITTED ? (
                <Button variant={'default'} size={'md'} loading={false} type="submit" onClick={closeModalAction}>
                  Close
                </Button>
              ) : (
                <>
                  <Button
                    variant={'danger'}
                    size={'md'}
                    loading={false}
                    type="button"
                    onClick={(e) => setSkipNominationModalIsOpen(true)}
                  >
                    Skip Nomination
                  </Button>
                  <Button
                    variant={'primary'}
                    size={'md'}
                    loading={false}
                    form="ApplyOvertimeForm"
                    type="submit"
                    onClick={(e) => setConfirmNominationModalIsOpen(true)}
                    disabled={nominatedEmployees.length <= 0 ? true : false}
                  >
                    Submit
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrainingDetailsModal;
