/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, LoadingSpinner, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import {
  NomineeStatus,
  NomineeType,
  TrainingPreparationStatus,
  TrainingStatus,
} from 'libs/utils/src/lib/enums/training.enum';
import { usePdcApprovalsStore } from 'apps/portal/src/store/pdc-approvals.store';
import { useEffect, useState } from 'react';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import useSWR from 'swr';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { ConfirmationNominationModal } from './ConfirmationModal';
import UseRenderTrainingNomineeStatus from 'apps/portal/src/utils/functions/RenderTrainingNomineeStatus';

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

    setConfirmNominationModalIsOpen,
    setTrainingNominationModalIsOpen,
    getRecommendedEmployees,
    getRecommendedEmployeesSuccess,
    getRecommendedEmployeesFail,
    getNominatedEmployeeList,
    getNominatedEmployeeListSuccess,
    getNominatedEmployeeListFail,
  } = usePdcApprovalsStore((state) => ({
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

    setConfirmNominationModalIsOpen: state.setConfirmNominationModalIsOpen,
    setTrainingNominationModalIsOpen: state.setTrainingNominationModalIsOpen,
    getRecommendedEmployees: state.getRecommendedEmployees,
    getRecommendedEmployeesSuccess: state.getRecommendedEmployeesSuccess,
    getRecommendedEmployeesFail: state.getRecommendedEmployeesFail,
    getNominatedEmployeeList: state.getNominatedEmployeeList,
    getNominatedEmployeeListSuccess: state.getNominatedEmployeeListSuccess,
    getNominatedEmployeeListFail: state.getNominatedEmployeeListFail,
  }));

  //close training nomination modal
  const closeTrainingNominationModal = async () => {
    setTrainingNominationModalIsOpen(false);
  };

  //close confirmation modal
  const closeConfirmationModal = async () => {
    setConfirmNominationModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={windowWidth > 1024 ? 'lg' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Training Details</span>
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

            <div className="w-full flex flex-col gap-2 p-4 rounded">
              {/* {individualTrainingDetails.trainingPreparationStatus === TrainingPreparationStatus.ON_GOING_NOMINATION ? (
                <AlertNotification alertType="info" notifMessage="On Going Nomination" dismissible={false} />
              ) : null} */}

              {/* loading post reponse */}
              {loadingResponse ? (
                <AlertNotification
                  logo={<LoadingSpinner size="xs" />}
                  alertType="info"
                  notifMessage="Submitting Request"
                  dismissible={false}
                />
              ) : null}

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Course Title:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">{individualTrainingDetails.courseTitle}</label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Location:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">{individualTrainingDetails.location}</label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Duration:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">
                    {DateFormatter(individualTrainingDetails.trainingStart, 'MM-DD-YYYY')} -{' '}
                    {DateFormatter(individualTrainingDetails.trainingEnd, 'MM-DD-YYYY')}{' '}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">No. of Slots:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">{individualTrainingDetails.numberOfSlots}</label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Source:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md capitalize ">
                    {individualTrainingDetails.source}
                  </label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Type:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md capitalize">
                    {individualTrainingDetails?.type}
                  </label>
                </div>
              </div>

              {/* <div className="flex flex-row md:gap-2 justify-between items-start md:items-start">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Participants:</label>

                <div className="w-auto ">
                  {nominatedEmployeeList?.length <= 0 ? (
                    <Button
                      variant={'primary'}
                      size={'sm'}
                      loading={false}
                      onClick={() => setTrainingNominationModalIsOpen(true)}
                    >
                      <div className="flex justify-center">Set Participants</div>
                    </Button>
                  ) : null}
                </div>
              </div> */}
              <div className="flex flex-col md:gap-2 justify-between items-start md:items-start">
                <div className="w-full overflow-x-auto">
                  <table className="w-screen md:w-full border-0 border-separate bg-slate-50 border-spacing-0">
                    <thead className="border-0">
                      <tr>
                        <th
                          colSpan={3}
                          className="px-10 py-2 text-sm text-center items-center border md:px-6 md:text-md font-medium text-gray-700 "
                        >
                          Nominated Employee(s)
                        </th>
                      </tr>

                      {nominatedEmployeeList?.length > 0 ? (
                        <tr>
                          <td className={`px-2 w-1/2 text-center border`}>Name</td>
                          <td className={`px-2 w-1/6 text-center border`}>Status</td>
                          <td className={`px-2 text-center border`}>Remarks</td>
                        </tr>
                      ) : (
                        <tr>
                          <td className={`px-2 w-1/2 text-center border`}>Name</td>
                        </tr>
                      )}
                    </thead>
                    <tbody className="text-sm text-center ">
                      {nominatedEmployeeList?.length > 0 ? (
                        nominatedEmployeeList.map((employees, index) =>
                          employees.nomineeType === NomineeType.NOMINEE ? (
                            <tr key={index}>
                              <td className={`px-2 py-1 w-1/2 text-start border`}>{employees.name}</td>
                              <td className={`px-2 py-1 w-1/6 text-center border capitalize`}>
                                {UseRenderTrainingNomineeStatus(employees.status)}
                              </td>
                              <td className={`px-2 text-start border`}>{employees.remarks}</td>
                            </tr>
                          ) : null
                        )
                      ) : nominatedEmployees?.length > 0 ? (
                        nominatedEmployees.map((employees, index) => {
                          return (
                            <tr key={index}>
                              <td colSpan={3} className={`px-2 text-start border`}>
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
              <div className="flex flex-col md:gap-2 justify-between items-start md:items-start pt-1">
                <div className="w-full overflow-x-auto">
                  <table className="w-screen md:w-full border-0 border-separate bg-slate-50 border-spacing-0">
                    <thead className="border-0">
                      <tr>
                        <th
                          colSpan={3}
                          className="px-10 py-2 text-sm text-center items-center border md:px-6 md:text-md font-medium text-gray-700 "
                        >
                          Auxiliary Employee(s)
                        </th>
                      </tr>

                      {nominatedEmployeeList?.length > 0 ? (
                        <tr>
                          <td className={`px-2 w-1/2 text-center border`}>Name</td>
                          <td className={`px-2 w-1/6 text-center border`}>Status</td>
                          <td className={`px-2 text-center border`}>Remarks</td>
                        </tr>
                      ) : (
                        <tr>
                          <td className={`px-2 w-1/2 text-center border`}>Name</td>
                        </tr>
                      )}
                    </thead>
                    <tbody className="text-sm text-center ">
                      {nominatedEmployeeList?.length > 0 ? (
                        nominatedEmployeeList.map((employees, index) =>
                          employees.nomineeType === NomineeType.STAND_IN ? (
                            <tr key={index}>
                              <td className={`px-2 py-1 w-1/2 text-start border`}>{employees.name}</td>
                              <td className={`px-2 py-1 w-1/6 text-center border capitalize`}>
                                {UseRenderTrainingNomineeStatus(employees.status)}
                              </td>
                              <td className={`px-2 text-start border`}>{employees.remarks}</td>
                            </tr>
                          ) : null
                        )
                      ) : auxiliaryEmployees?.length > 0 ? (
                        auxiliaryEmployees.map((employees, index) => {
                          return (
                            <tr key={index}>
                              <td colSpan={3} className={`px-2 text-start border`}>
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
          <div className="flex justify-end gap-2">
            <div className="max-w-auto">
              {nominatedEmployeeList?.length > 0 ? (
                <Button variant={'primary'} size={'md'} loading={false} type="submit" onClick={closeModalAction}>
                  Close
                </Button>
              ) : (
                <Button
                  variant={'primary'}
                  size={'md'}
                  loading={false}
                  form="ApplyOvertimeForm"
                  type="submit"
                  onClick={(e) => setConfirmNominationModalIsOpen(true)}
                  disabled={nominatedEmployees.length <= 0 ? true : false}
                >
                  Send Invitation
                </Button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrainingDetailsModal;
