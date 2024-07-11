/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal, OtpModal, ToastNotification } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { usePrfStore } from 'apps/portal/src/store/prf.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { HiOutlineUser, HiOutlineDocumentDuplicate, HiOutlineCalendar, HiOutlinePencil } from 'react-icons/hi';
import { PageTitle } from '../../../modular/html/PageTitle';
import { patchPrfRequest } from '../../../../utils/helpers/prf.requests';
import { Position, PrfStatus } from '../../../../types/prf.types';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { PrfOtpContents } from '../prfOtp/PrfOtpContents';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { PrfPositionCard } from './PrfPositionCard';
import { ConfirmationApprovalModal } from '../prfConfirm/ConfirmationApprovalModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ForApprovalPrfModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    selectedPrfId,
    forApprovalPrfModalIsOpen,
    getPrfDetailsForApproval,
    getPrfDetailsForApprovalSuccess,
    getPrfDetailsForApprovalFail,
    patchError,
    patchPrf,
    patchPrfSuccess,
    patchPrfFail,
    setForApprovalPrfModalIsOpen,
    emptyResponseAndError,
    setPrfConfirmModalIsOpen,
    prfConfirmModalIsOpen,
  } = usePrfStore((state) => ({
    selectedPrfId: state.selectedPrfId,
    forApprovalPrfModalIsOpen: state.forApprovalPrfModalIsOpen,
    getPrfDetailsForApproval: state.getPrfDetailsForApproval,
    getPrfDetailsForApprovalSuccess: state.getPrfDetailsForApprovalSuccess,
    getPrfDetailsForApprovalFail: state.getPrfDetailsForApprovalFail,
    patchError: state.errors.errorResponse,
    patchPrf: state.patchPrf,
    patchPrfSuccess: state.patchPrfSuccess,
    patchPrfFail: state.patchPrfFail,
    setForApprovalPrfModalIsOpen: state.setForApprovalPrfModalIsOpen,
    emptyResponseAndError: state.emptyResponseAndError,
    setPrfConfirmModalIsOpen: state.setPrfConfirmModalIsOpen,
    prfConfirmModalIsOpen: state.prfConfirmModalIsOpen,
  }));

  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  const router = useRouter();

  const prfUrl = process.env.NEXT_PUBLIC_HRIS_URL;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  //get prf details (individual)
  const {
    data: prfDetailsForApproval,
    isLoading: swrPrfIsLoading,
    error: swrPrfError,
    mutate: mutatePrfDetails,
  } = useSWR(forApprovalPrfModalIsOpen ? `${prfUrl}/prf/details/${selectedPrfId}` : null, fetchWithToken, {});

  // Initial zustand state update
  useEffect(() => {
    if (swrPrfIsLoading) {
      getPrfDetailsForApproval(swrPrfIsLoading);
    }
  }, [swrPrfIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(prfDetailsForApproval)) {
      getPrfDetailsForApprovalSuccess(swrPrfIsLoading, prfDetailsForApproval);
    }

    if (!isEmpty(swrPrfError)) {
      getPrfDetailsForApprovalFail(swrPrfIsLoading, swrPrfError.message);
    }
  }, [prfDetailsForApproval, swrPrfError]);

  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>('');

  const handleConfirmModal = () => {
    setPrfConfirmModalIsOpen(true);
  };

  useEffect(() => {
    setRemarks('');
  }, [isDeclineModalOpen]);

  const handleDecline = async (e) => {
    patchPrf();
    if (!isEmpty(remarks)) {
      const { error, result } = await patchPrfRequest(`/prf-trail/${selectedPrfId}`, {
        status: PrfStatus.DISAPPROVED,
        employeeId: employeeDetail.employmentDetails.userId,
        remarks,
      });
      if (error) {
        // request is done set loading to false and set the error message
        patchPrfFail(result);
      } else if (!error) {
        // request is done set loading to false and set the update response
        patchPrfSuccess(result);
        setIsDeclineModalOpen(false);
        setTimeout(() => {
          setForApprovalPrfModalIsOpen(false);
        }, 200);
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(patchError)) {
      setTimeout(() => {
        // emptyResponseAndError();
      }, 3000);
    }
  }, [patchError]);

  const closeConfirmModal = async () => {
    setPrfConfirmModalIsOpen(false);
  };

  const { windowWidth } = UseWindowDimensions();
  return (
    <>
      <Modal size={'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="flex justify-between px-5">
              <span className="text-xl md:text-2xl">For Approval Position Request</span>
              <button
                className="px-2 rounded-full hover:bg-slate-100 outline-slate-100 outline-8"
                onClick={closeModalAction}
              >
                <HiX />
              </button>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <>
            {swrPrfIsLoading ? (
              <>
                <div className="w-full h-[90%] static flex flex-col justify-items-center items-center place-items-center">
                  <SpinnerDotted
                    speed={70}
                    thickness={70}
                    className="flex w-full h-full transition-all "
                    color="slateblue"
                    size={100}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Load PRF Failed Error */}
                {!isEmpty(swrPrfError) ? <ToastNotification toastType="error" notifMessage={`${swrPrfError}`} /> : null}

                {prfDetailsForApproval ? (
                  <>
                    <PageTitle title={prfDetailsForApproval.prfNo} />

                    {/* <OtpModal
                      modalState={prfOtpModalIsOpen}
                      setModalState={setPrfOtpModalIsOpen}
                      title={'APPROVE PRF OTP'}
                    >
                      <PrfOtpContents
                        mobile={employeeDetail.profile.mobileNumber}
                        employeeId={employeeDetail.employmentDetails.userId}
                        action={'approved'}
                        tokenId={selectedPrfId}
                        otpName={'prf'}
                        remarks={''}
                      />
                    </OtpModal> */}

                    <ConfirmationApprovalModal
                      modalState={prfConfirmModalIsOpen}
                      setModalState={setPrfConfirmModalIsOpen}
                      closeModalAction={closeConfirmModal}
                      action={PrfStatus.APPROVED}
                      tokenId={selectedPrfId}
                      remarks={''}
                      employeeId={employeeDetail.employmentDetails.userId}
                    />

                    <Modal
                      size={`${windowWidth > 1024 ? 'sm' : 'xl'}`}
                      open={isDeclineModalOpen}
                      setOpen={setIsDeclineModalOpen}
                    >
                      <Modal.Header>
                        <h3 className="text-xl font-semibold text-gray-700">
                          <div className="flex justify-between px-2">
                            <span>Decline Position Request</span>
                            <button
                              className="px-2 rounded-full hover:bg-slate-100 outline-slate-100 outline-8"
                              onClick={() => {
                                setIsDeclineModalOpen(false);
                              }}
                            >
                              <HiX />
                            </button>
                          </div>
                        </h3>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="flex flex-col w-full h-full gap-2 px-4 text-md ">
                          {'Please indicate reason for declining this position request:'}
                          <textarea
                            required
                            placeholder="Reason for decline"
                            className={`w-full h-32 p-2 border resize-none`}
                            onChange={(e) => setRemarks(e.target.value as unknown as string)}
                            value={remarks}
                          ></textarea>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        <div className="flex justify-end gap-2 px-4">
                          <div className="min-w-[6rem] max-w-auto flex gap-4">
                            <Button
                              variant={'primary'}
                              disabled={!isEmpty(remarks) ? false : true}
                              onClick={(e) => handleDecline(e)}
                            >
                              Submit
                            </Button>
                            {/* <Button
                              variant={'danger'}
                              onClick={() => {
                                setIsDeclineModalOpen(false);
                              }}
                            >
                              Cancel
                            </Button> */}
                          </div>
                        </div>
                      </Modal.Footer>
                    </Modal>

                    <div className="flex flex-col w-full h-auto py-10 pl-4 pr-4 overflow-hidden lg:pl-32 lg:pr-32">
                      <header className="flex items-center justify-between">
                        <section className="shrink-0">
                          <h1 className="text-2xl font-semibold text-gray-700">Pending Request</h1>
                          <p className="text-gray-500">{prfDetailsForApproval.prfNo}</p>
                        </section>
                      </header>

                      <main className="mt-16">
                        <main className="flex flex-col items-center h-full md:flex-row md:items-start">
                          <aside className="shrink-0 w-[20rem]">
                            <section className="flex items-center gap-4">
                              <HiOutlineUser className="text-gray-700 shrink-0" />
                              <p className="font-medium text-gray-600 truncate">{prfDetailsForApproval.from?.name}</p>
                            </section>

                            <section className="flex items-center gap-4">
                              <HiOutlineDocumentDuplicate className="text-gray-700 shrink-0" />
                              <p className="font-medium text-gray-600 truncate">
                                {prfDetailsForApproval.from?.position}
                              </p>
                            </section>

                            <section className="flex items-center gap-4">
                              <HiOutlineCalendar className="text-gray-700 shrink-0" />
                              <p className="font-medium text-gray-600">
                                {DateFormatter(prfDetailsForApproval.createdAt, 'MMMM DD, YYYY')}
                              </p>
                            </section>

                            <section className="flex items-center gap-4">
                              <HiOutlinePencil className="text-gray-700 shrink-0" />
                              {prfDetailsForApproval.withExam ? (
                                <p className="font-medium text-indigo-500">Examination is required</p>
                              ) : (
                                <p className="font-medium text-orange-500">No examination required</p>
                              )}
                            </section>

                            <section className="flex flex-col w-full gap-2 mt-10">
                              <>
                                <Button
                                  variant="primary"
                                  onClick={() => {
                                    handleConfirmModal();
                                  }}
                                >
                                  Approve Request{' '}
                                </Button>

                                <Button
                                  variant="danger"
                                  onClick={() => {
                                    setIsDeclineModalOpen(true);
                                  }}
                                >
                                  Disapprove Request{' '}
                                </Button>
                              </>
                            </section>
                          </aside>
                          <section className="w-full">
                            <main className="w-full h-auto px-5 overflow-y-auto scale-95">
                              {prfDetailsForApproval.prfPositions &&
                                prfDetailsForApproval.prfPositions.map((position: Position, index: number) => {
                                  return <PrfPositionCard position={position} key={index} />;
                                })}
                            </main>
                          </section>
                        </main>
                      </main>
                    </div>
                  </>
                ) : null}
              </>
            )}
          </>
        </Modal.Body>
        <Modal.Footer>
          <></>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ForApprovalPrfModal;
