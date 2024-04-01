/* eslint-disable @nx/enforce-module-boundaries */

import { Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { postPortal } from 'apps/portal/src/utils/helpers/portal-axios-helper';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import { TrainingNominationData } from 'libs/utils/src/lib/types/training.type';
import { NomineeType } from 'libs/utils/src/lib/enums/training.enum';

type ConfirmationNominationModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ConfirmationNominationModal = ({
  modalState,
  setModalState,
  closeModalAction,
}: ConfirmationNominationModalProps) => {
  const {
    individualTrainingDetails,
    nominatedEmployees,
    auxiliaryEmployees,
    skipNominationModalIsOpen,
    skipNominationRemarks,
    setTrainingModalIsOpen,
    setSkipNominationModalIsOpen,
    postTrainingSelection,
    postTrainingSelectionSuccess,
    postTrainingSelectionFail,
  } = useTrainingSelectionStore((state) => ({
    individualTrainingDetails: state.individualTrainingDetails,
    nominatedEmployees: state.nominatedEmployees,
    auxiliaryEmployees: state.auxiliaryEmployees,
    skipNominationModalIsOpen: state.skipNominationModalIsOpen,
    skipNominationRemarks: state.skipNominationRemarks,
    setTrainingModalIsOpen: state.setTrainingModalIsOpen,
    setSkipNominationModalIsOpen: state.setSkipNominationModalIsOpen,
    postTrainingSelection: state.postTrainingSelection,
    postTrainingSelectionSuccess: state.postTrainingSelectionSuccess,
    postTrainingSelectionFail: state.postTrainingSelectionFail,
  }));

  const handleSubmit = () => {
    let finalNominated = [];
    let finalEmployees = [];
    //mutate nominated employees array for post
    for (let a = 0; a < nominatedEmployees.length; a++) {
      finalNominated = Array.from(
        new Set([
          ...finalNominated,
          {
            employeeId: nominatedEmployees[a].value,
            nomineeType: NomineeType.NOMINEE,
          },
        ])
      );
    }
    //mutate nominated employees array with auxiliary for post
    finalEmployees = [...finalNominated];
    for (let b = 0; b < auxiliaryEmployees.length; b++) {
      finalEmployees = Array.from(
        new Set([
          ...finalEmployees,
          {
            employeeId: auxiliaryEmployees[b].value,
            nomineeType: NomineeType.STAND_IN,
          },
        ])
      );
    }

    let data;
    if (skipNominationModalIsOpen && skipNominationRemarks) {
      data = {
        trainingDistribution: individualTrainingDetails.distributionId,
        employees: [],
        remarks: skipNominationRemarks,
      };
    } else if (finalEmployees.length >= 1) {
      data = {
        trainingDistribution: individualTrainingDetails.distributionId,
        employees: finalEmployees,
      };
    }
    console.log(data);
    handlePatchResult(data);
  };

  const handlePatchResult = async (data: TrainingNominationData) => {
    postTrainingSelection();
    const { error, result } = await postPortal(`${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/nominees/`, data);
    if (error) {
      postTrainingSelectionFail(result);
    } else {
      postTrainingSelectionSuccess(result);
      closeModalAction();
      setTimeout(() => {
        setSkipNominationModalIsOpen(false);
      }, 200);
      setTimeout(() => {
        setTrainingModalIsOpen(false); // close training details modal
      }, 300);
    }
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={`${windowWidth > 768 ? 'sm' : 'xl'}`} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>
                {skipNominationModalIsOpen && skipNominationRemarks ? 'Skip Nomination' : 'Submit Nomination'}
              </span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full flex flex-col gap-0 text-lg text-center px-4">
            {skipNominationModalIsOpen && skipNominationRemarks ? (
              <>
                <label>{`Are you sure you want to skip nomination?`}</label>
              </>
            ) : (
              <>
                <label>{`Are you sure you want to submit this nomination?`}</label>
                <label>{`You have nominated ${nominatedEmployees.length} participants and ${
                  auxiliaryEmployees.length
                } stand-in ${auxiliaryEmployees.length > 1 ? 'participants' : 'participant'}.`}</label>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="min-w-[6rem] max-w-auto flex gap-4">
              <Button variant={'primary'} size={'md'} loading={false} onClick={(e) => handleSubmit()}>
                Yes
              </Button>
              <Button variant={'danger'} size={'md'} loading={false} onClick={closeModalAction}>
                No
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
