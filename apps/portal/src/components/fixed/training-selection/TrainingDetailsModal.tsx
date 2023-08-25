/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';
import { usePassSlipStore } from '../../../store/passslip.store';
import { useRouter } from 'next/router';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { TrainingStatus } from 'libs/utils/src/lib/enums/training.enum';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

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
  } = useTrainingSelectionStore((state) => ({
    trainingList: state.trainingList,
    loadingTrainingList: state.loading.loadingTrainingList,
    errorTrainingList: state.error.errorTrainingList,
    individualTrainingDetails: state.individualTrainingDetails,
    trainingModalIsOpen: state.setTrainingModalIsOpen,
    setIndividualTrainingDetails: state.setIndividualTrainingDetails,
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
          <div className="w-full h-full flex flex-col gap-2 ">
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
                    {dayjs(individualTrainingDetails.trainingStart).format('MMMM DD, YYYY')} -{' '}
                    {dayjs(individualTrainingDetails.trainingEnd).format('MMMM DD, YYYY')}{' '}
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
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto"></div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrainingDetailsModal;
