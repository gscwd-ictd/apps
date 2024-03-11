/* eslint-disable react/jsx-no-undef */
/* eslint-disable @nx/enforce-module-boundaries */
import { AlertNotification, Button, Modal } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useRouter } from 'next/router';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { useInboxStore } from 'apps/portal/src/store/inbox.store';
import { OvertimeMembers, PsbMembers } from 'apps/portal/src/types/inbox.type';
import { NomineeStatus } from 'libs/utils/src/lib/enums/training.enum';
import { InboxMessageResponse } from 'libs/utils/src/lib/enums/inbox.enum';
import { ConfirmationInboxModal } from './ConfirmationModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const InboxTrainingModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const router = useRouter();
  const { windowWidth } = UseWindowDimensions();

  const {
    trainingMessage,
    declineRemarks,
    confirmModalIsOpen,
    setConfirmModalIsOpen,
    setSelectedPayloadId,
    setConfirmationResponse,
    setConfirmationModalTitle,
    setDeclineRemarks,
  } = useInboxStore((state) => ({
    declineRemarks: state.declineRemarks,
    trainingMessage: state.message.training,
    confirmModalIsOpen: state.confirmModalIsOpen,
    setConfirmModalIsOpen: state.setConfirmModalIsOpen,
    setSelectedPayloadId: state.setSelectedPayloadId,
    setConfirmationResponse: state.setConfirmationResponse,
    setConfirmationModalTitle: state.setConfirmationModalTitle,
    setDeclineRemarks: state.setDeclineRemarks,
  }));

  //UPDATE REMARKS ON RESPONSE
  const handleRemarks = (e: string) => {
    setDeclineRemarks(e);
  };

  const openSubmitModalAction = async (selectedNominationId: string, response: InboxMessageResponse) => {
    setSelectedPayloadId(selectedNominationId); // to be used for training put request
    setConfirmationResponse(response); // set as accept or decline
    setConfirmationModalTitle('Training Acknowledgment');
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModalAction = async () => {
    setConfirmModalIsOpen(false);
  };

  return (
    <>
      <Modal size={windowWidth > 1024 ? 'md' : 'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Message</span>
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
          <ConfirmationInboxModal
            modalState={confirmModalIsOpen}
            setModalState={setConfirmModalIsOpen}
            closeModalAction={closeConfirmModalAction}
          />

          <div className="w-full h-full flex flex-col gap-2 ">
            <div className="w-full flex flex-col gap-2 px-4 rounded">
              <div className="w-full flex flex-col gap-0">
                <AlertNotification
                  alertType="info"
                  notifMessage={
                    'This is to inform you that you have been nominated to attend the Training Session specified below.'
                  }
                  dismissible={false}
                />

                {trainingMessage?.nomineeStatus === NomineeStatus.ACCEPTED ? (
                  <AlertNotification
                    alertType={`success`}
                    notifMessage={`You have confirmed to attend this Training.`}
                    dismissible={false}
                  />
                ) : null}

                {trainingMessage?.nomineeStatus === NomineeStatus.DECLINED ? (
                  <AlertNotification
                    alertType="error"
                    notifMessage={'You have declined to attend this Training.'}
                    dismissible={false}
                  />
                ) : null}

                {trainingMessage?.nomineeStatus === NomineeStatus.PENDING ? (
                  <AlertNotification alertType="warning" notifMessage={'Awaiting acknowledgment'} dismissible={false} />
                ) : null}
              </div>

              <div className="flex flex-wrap justify-between">
                <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Training Title:</label>

                  <div className="w-auto ml-5">
                    <label className="text-md font-medium">{trainingMessage.name}</label>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Location:</label>

                  <div className="w-auto ml-5">
                    <label className="text-md font-medium">{trainingMessage.location}</label>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full md:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Start Date:</label>

                  <div className="w-auto ml-5">
                    <label className="text-md font-medium">
                      {DateFormatter(trainingMessage.trainingStart, 'MM-DD-YYYY')}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full md:w-1/2 px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">End Date:</label>

                  <div className="w-auto ml-5">
                    <label className="text-md font-medium">
                      {DateFormatter(trainingMessage.trainingEnd, 'MM-DD-YYYY')}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start w-full px-0.5 pb-3  ">
                  <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">
                    {' '}
                    Remarks:{' '}
                    {trainingMessage?.nomineeStatus === NomineeStatus.ACCEPTED ||
                    trainingMessage?.nomineeStatus === NomineeStatus.DECLINED ? null : (
                      <label className={`font-normal text-sm text-red-500`}>* required if declined</label>
                    )}
                  </label>

                  <textarea
                    className={'resize-none w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                    disabled={trainingMessage?.nomineeStatus === NomineeStatus.PENDING ? false : true}
                    value={
                      trainingMessage?.remarks
                        ? trainingMessage?.remarks
                        : trainingMessage?.nomineeStatus === NomineeStatus.PENDING
                        ? declineRemarks
                        : 'N/A'
                    }
                    placeholder={'If declining, please state reason.'}
                    onChange={(e) => handleRemarks(e.target.value as unknown as string)}
                    rows={3}
                  ></textarea>
                </div>
              </div>

              {/* <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Training Title:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96 text-md capitalize">{trainingMessage.name}</label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Location:</label>

                <div className="w-auto sm:w-96">
                  <label className="text-slate-500 h-12 w-96  text-md ">{trainingMessage.location}</label>
                </div>
              </div>

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">Start Date:</label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">
                      {DateFormatter(trainingMessage.trainingStart, 'MM-DD-YYYY')}
                    </label>
                  </div>
                </div>
              </div>

              <div className={` flex flex-col gap-2`}>
                <div className="flex flex-col sm:flex-row md:gap-2 justify-between items-start md:items-center">
                  <label className="text-slate-500 text-md font-medium whitespace-nowrap sm:w-80">End Date:</label>
                  <div className="w-auto sm:w-96">
                    <label className="text-slate-500 h-12 w-96  text-md ">
                      {DateFormatter(trainingMessage.trainingEnd, 'MM-DD-YYYY')}
                    </label>
                  </div>
                </div>
              </div> */}

              {/* <div className={`flex flex-col gap-2`}>
                <label className="text-slate-500 text-md font-medium">
                  Remarks:{' '}
                  {trainingMessage?.nomineeStatus === NomineeStatus.ACCEPTED ||
                  trainingMessage?.nomineeStatus === NomineeStatus.DECLINED ? null : (
                    <label className={`font-normal text-sm text-red-500`}>* required if declined</label>
                  )}
                </label>

                <textarea
                  className={'resize-none w-full p-2 rounded text-slate-500 text-md border-slate-300'}
                  disabled={trainingMessage?.nomineeStatus === NomineeStatus.PENDING ? false : true}
                  value={
                    trainingMessage?.remarks
                      ? trainingMessage?.remarks
                      : trainingMessage?.nomineeStatus === NomineeStatus.PENDING
                      ? declineRemarks
                      : 'N/A'
                  }
                  placeholder={'If declining, please state reason.'}
                  onChange={(e) => handleRemarks(e.target.value as unknown as string)}
                  rows={3}
                ></textarea>
              </div> */}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 px-4">
            <div className="w-full justify-end flex gap-2">
              {trainingMessage?.nomineeStatus === NomineeStatus.ACCEPTED ||
              trainingMessage?.nomineeStatus === NomineeStatus.DECLINED ? (
                <Button variant={'default'} size={'md'} loading={false} onClick={(e) => closeModalAction()}>
                  Close
                </Button>
              ) : (
                <div className="flex flex-row items-center justify-end gap-4">
                  <Button
                    variant={'primary'}
                    size={'md'}
                    onClick={(e) =>
                      openSubmitModalAction(trainingMessage?.nomineeId, InboxMessageResponse.TRAINING_ACCEPT)
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    variant={'danger'}
                    size={'md'}
                    disabled={declineRemarks ? false : true}
                    onClick={(e) =>
                      openSubmitModalAction(trainingMessage?.nomineeId, InboxMessageResponse.TRAINING_DECLINE)
                    }
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InboxTrainingModal;
