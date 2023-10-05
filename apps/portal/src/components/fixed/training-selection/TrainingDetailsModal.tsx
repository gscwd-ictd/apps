/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import Link from 'next/link';
import { HiPencilAlt, HiPlus, HiX } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { useRouter } from 'next/router';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { TrainingStatus } from 'libs/utils/src/lib/enums/training.enum';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import TrainingNominationModal from './TrainingNominationModal';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const TrainingDetailsModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    trainingList,
    loadingTrainingList,
    errorTrainingList,
    individualTrainingDetails,
    trainingModalIsOpen,
    setIndividualTrainingDetails,
    nominatedEmployees,
    setNominatedEmployees,
    auxiliaryEmployees,
    setAuxiliaryEmployees,
    trainingNominationModalIsOpen,
    setTrainingNominationModalIsOpen,
  } = useTrainingSelectionStore((state) => ({
    trainingList: state.trainingList,
    loadingTrainingList: state.loading.loadingTrainingList,
    errorTrainingList: state.error.errorTrainingList,
    individualTrainingDetails: state.individualTrainingDetails,
    trainingModalIsOpen: state.setTrainingModalIsOpen,
    setIndividualTrainingDetails: state.setIndividualTrainingDetails,
    nominatedEmployees: state.nominatedEmployees,
    setNominatedEmployees: state.setNominatedEmployees,
    auxiliaryEmployees: state.auxiliaryEmployees,
    setAuxiliaryEmployees: state.setAuxiliaryEmployees,
    trainingNominationModalIsOpen: state.trainingNominationModalIsOpen,
    setTrainingNominationModalIsOpen: state.setTrainingNominationModalIsOpen,
  }));

  const [courseContentsArray, setCourseContentsArray] = useState([{ title: 'N/A' }]);
  const [postTrainingRequirementArray, setPostTrainingRequirementArray] = useState([{ document: 'N/A' }]);

  useEffect(() => {
    if (individualTrainingDetails.courseContent) {
      setCourseContentsArray(JSON.parse(individualTrainingDetails.courseContent as unknown as string));
    }
    if (individualTrainingDetails.postTrainingRequirements) {
      setPostTrainingRequirementArray(
        JSON.parse(individualTrainingDetails.postTrainingRequirements as unknown as string)
      );
    }
  }, [individualTrainingDetails]);

  // cancel action for Leave Application Modal
  const closeTrainingNominationModal = async () => {
    setTrainingNominationModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={windowWidth > 1024 ? 'lg' : 'full'} open={modalState} setOpen={setModalState}>
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
            <TrainingNominationModal
              modalState={trainingNominationModalIsOpen}
              setModalState={setTrainingNominationModalIsOpen}
              closeModalAction={closeTrainingNominationModal}
            />

            <div className="w-full flex flex-col gap-2 p-4 rounded">
              {individualTrainingDetails.status === TrainingStatus.ONGOING ? (
                <AlertNotification alertType="info" notifMessage="On Going Nomination" dismissible={false} />
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
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Invitation URL:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">
                    <a href={individualTrainingDetails.invitationUrl} target="_blank" className="text-indigo-600">
                      Link
                    </a>
                  </label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">No. of Hours:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">{individualTrainingDetails.numberOfHours}</label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  No. of Participants:
                </label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md ">
                    {individualTrainingDetails.numberOfParticipants}
                  </label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-start">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Course Content:</label>

                <div className="w-auto sm:w-96 ">
                  <label className="text-slate-500 w-96 text-md bg-red-200">
                    {courseContentsArray.map((course, idx: number) => {
                      return <div key={idx}>{course?.title}</div>;
                    })}
                  </label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-start">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">
                  Post Training Requirements:
                </label>

                <div className="w-auto sm:w-96 ">
                  <label className="text-slate-500 w-96 text-md ">
                    {postTrainingRequirementArray.map((training, idx: number) => {
                      return <div key={idx}>{training?.document}</div>;
                    })}
                  </label>
                </div>
              </div>
              <div className="flex flex-row md:gap-2 justify-between items-start md:items-start">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Participants:</label>

                <div className="w-auto ">
                  <Button
                    variant={'primary'}
                    size={'sm'}
                    loading={false}
                    onClick={() => setTrainingNominationModalIsOpen(true)}
                  >
                    <div className="flex justify-center">Set Participants</div>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col md:gap-2 justify-between items-start md:items-start">
                <div className="w-full overflow-x-auto">
                  <table className="w-screen md:w-full border-0 border-separate bg-slate-50 border-spacing-0">
                    <thead className="border-0">
                      <tr>
                        <th className="px-10 py-2 text-sm text-center border md:px-6 md:text-md font-medium text-gray-700 ">
                          Nominated Employee(s)
                        </th>
                        <th className="px-10 py-2 text-sm text-center border md:px-5 md:text-md font-medium text-gray-700">
                          Status
                        </th>
                        <th className="w-28 py-2 text-sm text-center border md:text-md font-medium text-gray-700">
                          Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-center ">
                      {nominatedEmployees?.length > 0 ? (
                        nominatedEmployees.map((employees, index) => {
                          return (
                            <tr key={index}>
                              <td className={`px-2 text-start border`}>{employees.label}</td>
                              <td className={`text-center border`}>PENDING</td>
                              <td className={`py-2 text-center border`}>
                                <Button
                                  variant={'primary'}
                                  size={'sm'}
                                  loading={false}
                                  disabled
                                  // onClick={() => setTrainingNominationModalIsOpen(true)}
                                >
                                  <div className="flex justify-center">Swap</div>
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="border-0">
                          <td colSpan={6}>NO EMPLOYEE SELECTED</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex flex-col md:gap-2 justify-between items-start md:items-start">
                <div className="w-full overflow-x-auto">
                  <table className="w-screen md:w-full border-0 border-separate bg-slate-50 border-spacing-0">
                    <thead className="border-0">
                      <tr>
                        <th className="px-10 py-2 text-sm text-center border md:px-6 md:text-md font-medium text-gray-700 ">
                          Auxiliary Employee(s)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-center ">
                      {auxiliaryEmployees?.length > 0 ? (
                        auxiliaryEmployees.map((employees, index) => {
                          return (
                            <tr key={index}>
                              <td className={`px-2 text-start border`}>{employees.label}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="border-0">
                          <td colSpan={6}>NO EMPLOYEE SELECTED</td>
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
            <div className="min-w-[6rem] max-w-auto">
              <Button variant={'primary'} size={'md'} loading={false} form="ApplyOvertimeForm" type="submit">
                Send Invitation
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrainingDetailsModal;
