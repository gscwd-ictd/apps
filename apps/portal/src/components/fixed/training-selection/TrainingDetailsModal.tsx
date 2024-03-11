/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { NomineeStatus, NomineeType, TrainingStatus } from 'libs/utils/src/lib/enums/training.enum';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import { useEffect, useState } from 'react';
import TrainingNominationModal from './TrainingNominationModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { ConfirmationNominationModal } from './ConfirmationModal';
import UseRenderTrainingNomineeStatus from 'apps/portal/src/utils/functions/RenderTrainingNomineeStatus';
import SkipNominationModal from './SkipNominationModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const TrainingDetailsModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    recommendedEmployees,
    loadingRecommendedEmployee,
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
    recommendedEmployees: state.recommendedEmployees,
    loadingRecommendedEmployee: state.loading.loadingRecommendedEmployee,
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

  const nominatedEmployeeUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/nominees/${individualTrainingDetails.distributionId}`;

  const {
    data: swrNominatedEmployee,
    isLoading: swrNominatedEmployeeIsLoading,
    error: swrNominatedEmployeeError,
    mutate: mutateNominatedEmployees,
  } = useSWR(individualTrainingDetails.distributionId ? nominatedEmployeeUrl : null, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

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
    setSkipNominationModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      {/* failed to load previously nominated employee list */}
      {!isEmpty(errorNominatedEmployeeList) && trainingModalIsOpen ? (
        <>
          <ToastNotification
            toastType="error"
            notifMessage={`${errorNominatedEmployeeList}: Failed to load nominated participants.`}
          />
        </>
      ) : null}

      {/* failed to load recommended employee list */}
      {!isEmpty(errorRecommendedEmployee) && trainingModalIsOpen ? (
        <>
          <ToastNotification
            toastType="error"
            notifMessage={`${errorRecommendedEmployee}: Failed to load recommended participants.`}
          />
        </>
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
              closeModalAction={closeConfirmationModal}
            />

            <TrainingNominationModal
              modalState={trainingNominationModalIsOpen}
              setModalState={setTrainingNominationModalIsOpen}
              closeModalAction={closeTrainingNominationModal}
            />

            <div className="w-full flex flex-col gap-2 px-4 rounded">
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
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARY_APPROVAL
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
                    ? 'warning'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED
                    ? 'error'
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARY_DECLINED
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
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARY_APPROVAL
                    ? 'For PDC Secretary Review'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_APPROVAL
                    ? 'For PDC Chairman Review'
                    : individualTrainingDetails.status === TrainingStatus.PDC_CHAIRMAN_DECLINED
                    ? 'Disapproved by PDC Chairman'
                    : individualTrainingDetails.status === TrainingStatus.PDC_SECRETARY_DECLINED
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

              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col justify-between items-start w-full md:w-1/2 px-0.5 pb-3">
                  <label className="text-slate-500 text-md whitespace-nowrap sm:w-80 ">Course Title:</label>

                  <div className="w-auto pl-0 md:pl-4">
                    <label className="text-slate-500 h-12 w-96 text-md font-medium">
                      {individualTrainingDetails.courseTitle}
                    </label>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start w-full md:w-1/2 px-0.5 pb-3">
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
                  {nominatedEmployeeList?.length <= 0 ? (
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
              <div className="flex flex-col md:gap-2 justify-between items-start md:items-start">
                <div className="w-full overflow-x-auto">
                  <table className="w-screen md:w-full border border-separate bg-slate-50 border-spacing-0 rounded-md text-slate-500">
                    <thead className="border-0 ">
                      <tr className="border-l border-r">
                        <th
                          colSpan={3}
                          className="px-10 py-2 text-sm text-center items-center md:px-6 md:text-md font-medium border-b"
                        >
                          Nominated Employee(s)
                        </th>
                      </tr>

                      {nominatedEmployeeList?.length > 0 ? (
                        <tr className="border-l border-r">
                          <td className={`px-2 w-1/2 text-center border-b border-r text-sm`}>Name</td>
                          <td className={`px-2 w-24 text-center border-b border-r text-sm`}>Status</td>
                          <td className={`px-2 w-auto text-center border-b text-sm`}>Remarks</td>
                        </tr>
                      ) : nominatedEmployees?.length > 0 ? (
                        <tr className="border-l border-r">
                          <td colSpan={1} className={`px-2 text-center border-b border-r text-sm w-12`}>
                            No.
                          </td>
                          <td colSpan={2} className={`px-2 text-center border-b text-sm`}>
                            Name
                          </td>
                        </tr>
                      ) : null}
                    </thead>
                    <tbody className="text-sm text-center ">
                      {nominatedEmployeeList?.length > 0 ? (
                        nominatedEmployeeList.map((employees, index) =>
                          employees.nomineeType === NomineeType.NOMINEE ? (
                            <tr key={index} className="border-l border-r">
                              <td className={`px-2 py-1 text-start border-r border-b rounded-bl-md`}>
                                {employees.name}
                              </td>
                              <td className={`px-2 py-1 text-center border-r border-b`}>
                                {UseRenderTrainingNomineeStatus(employees.status)}
                              </td>
                              <td className={`px-2 py-1 text-start border-b rounded-br-md`}>{employees.remarks}</td>
                            </tr>
                          ) : null
                        )
                      ) : nominatedEmployees?.length > 0 ? (
                        nominatedEmployees.map((employees, index) => {
                          return (
                            <tr key={index} className="border-l border-r">
                              <td
                                colSpan={1}
                                className={`px-2 text-start border-r ${
                                  nominatedEmployees.length === index + 1 ? '' : 'border-b'
                                }`}
                              >
                                {`${index + 1}.`}
                              </td>
                              <td
                                colSpan={2}
                                className={`px-2 text-start ${
                                  nominatedEmployees.length === index + 1 ? '' : 'border-b'
                                }`}
                              >
                                {employees.label}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="border-0">
                          <td colSpan={3}>NO EMPLOYEE NOMINATED</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex flex-col md:gap-2 justify-between items-start md:items-start pt-2">
                <div className="w-full overflow-x-auto">
                  <table className="w-screen md:w-full border border-separate bg-slate-50 border-spacing-0 rounded-md text-slate-500">
                    <thead className="border-0">
                      <tr>
                        <th
                          colSpan={3}
                          className="px-10 py-2 text-sm text-center items-center md:px-6 md:text-md font-medium border-b"
                        >
                          Auxiliary Employee(s)
                        </th>
                      </tr>

                      {nominatedEmployeeList?.length > 0 ? (
                        <tr>
                          <td className={`px-2 w-1/2 text-center border-b border-r text-sm`}>Name</td>
                          <td className={`px-2 w-24 text-center border-b border-r text-sm`}>Status</td>
                          <td className={`px-2 w-auto text-center border-b text-sm`}>Remarks</td>
                        </tr>
                      ) : auxiliaryEmployees?.length > 0 ? (
                        <tr className="border-l border-r">
                          <td colSpan={1} className={`px-2 text-center border-b border-r text-sm w-12`}>
                            No.
                          </td>
                          <td colSpan={2} className={`px-2 text-center border-b text-sm`}>
                            Name
                          </td>
                        </tr>
                      ) : null}
                    </thead>
                    <tbody className="text-sm text-center ">
                      {nominatedEmployeeList?.length > 0 ? (
                        nominatedEmployeeList.map((employees, index) =>
                          employees.nomineeType === NomineeType.STAND_IN ? (
                            <tr key={index}>
                              <td className={`px-2 py-1 text-start border-b border-r rounded-bl-md`}>
                                {employees.name}
                              </td>
                              <td className={`px-2 py-1 text-center border-b border-r capitalize`}>
                                {UseRenderTrainingNomineeStatus(employees.status)}
                              </td>
                              <td className={`px-2 text-start border-b rounded-br-md`}>{employees.remarks}</td>
                            </tr>
                          ) : null
                        )
                      ) : auxiliaryEmployees?.length > 0 ? (
                        auxiliaryEmployees.map((employees, index) => {
                          return (
                            <tr key={index} className="border-l border-r">
                              <td
                                colSpan={1}
                                className={`px-2 text-start border-r ${
                                  auxiliaryEmployees.length === index + 1 ? '' : 'border-b'
                                }`}
                              >
                                {`${index + 1}.`}
                              </td>
                              <td
                                colSpan={2}
                                className={`px-2 text-start ${
                                  auxiliaryEmployees.length === index + 1 ? '' : 'border-b'
                                }`}
                              >
                                {employees.label}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="border-0">
                          <td colSpan={3}>NO EMPLOYEE NOMINATED</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="max-w-auto flex gap-4 ">
              {nominatedEmployeeList?.length > 0 ? (
                <Button variant={'primary'} size={'md'} loading={false} type="submit" onClick={closeModalAction}>
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
