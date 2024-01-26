/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal, OtpModal, ToastNotification } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { usePrfStore } from 'apps/portal/src/store/prf.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

import dayjs from 'dayjs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {
  HiOutlineUser,
  HiOutlineDocumentDuplicate,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiArrowSmLeft,
} from 'react-icons/hi';
import { PrfTimeline } from '../prf-view/PrfTimeline';
import { PageTitle } from '../../../modular/html/PageTitle';
import {
  getEmployeeDetailsFromHr,
  getEmployeeProfile,
} from '../../../../utils/helpers/http-requests/employee-requests';
import { getPrfById, getPrfTrailByPrfId, patchPrfRequest } from '../../../../utils/helpers/prf.requests';
import { EmployeeDetailsPrf, EmployeeProfile, employeeDummy } from '../../../../types/employee.type';
import { Position, PrfDetails, PrfStatus, PrfTrail } from '../../../../types/prf.types';
import { withCookieSession } from '../../../../utils/helpers/session';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { PrfOtpContents } from '../prfOtp/PrfOtpContents';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const ForApprovalPrfModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    selectedPrfId,

    getPrfDetailsForApproval,
    getPrfDetailsForApprovalSuccess,
    getPrfDetailsForApprovalFail,

    prfOtpModalIsOpen,
    patchResponse,
    patchError,
    patchPrf,
    patchPrfSuccess,
    patchPrfFail,
    setPrfOtpModalIsOpen,
    setForApprovalPrfModalIsOpen,
    emptyResponseAndError,
  } = usePrfStore((state) => ({
    selectedPrfId: state.selectedPrfId,

    getPrfDetailsForApproval: state.getPrfDetailsForApproval,
    getPrfDetailsForApprovalSuccess: state.getPrfDetailsForApprovalSuccess,
    getPrfDetailsForApprovalFail: state.getPrfDetailsForApprovalFail,
    patchResponse: state.response.patchResponse,
    patchError: state.errors.errorResponse,
    prfOtpModalIsOpen: state.prfOtpModalIsOpen,
    patchPrf: state.patchPrf,
    patchPrfSuccess: state.patchPrfSuccess,
    patchPrfFail: state.patchPrfFail,
    setPrfOtpModalIsOpen: state.setPrfOtpModalIsOpen,
    setForApprovalPrfModalIsOpen: state.setForApprovalPrfModalIsOpen,
    emptyResponseAndError: state.emptyResponseAndError,
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
  } = useSWR(`${prfUrl}/prf/details/${selectedPrfId}`, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

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

  const handleOtpModal = () => {
    setPrfOtpModalIsOpen(true);
  };

  const handleDecline = async (e) => {
    if (!isEmpty(remarks)) {
      const { error, result } = await patchPrfRequest(`/prf-trail/${selectedPrfId}`, {
        status: PrfStatus.DISAPPROVED,
        employeeId: employeeDetail.employmentDetails.userId,
        remarks,
      });
      patchPrf();
      if (error) {
        // request is done set loading to false and set the error message
        patchPrfFail(result);
        setIsDeclineModalOpen(false);
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
        emptyResponseAndError();
      }, 3000);
    }
  }, [patchError]);

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">For Approval Position Request</span>
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

                    <OtpModal
                      modalState={prfOtpModalIsOpen}
                      setModalState={setPrfOtpModalIsOpen}
                      title={'APPROVE PRF OTP'}
                    >
                      {/* contents */}
                      <PrfOtpContents
                        mobile={employeeDetail.profile.mobileNumber}
                        employeeId={employeeDetail.employmentDetails.userId}
                        action={'approved'}
                        tokenId={`${router.query.prfid}`}
                        otpName={'prf'}
                        remarks={''}
                      />
                    </OtpModal>

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
                              className="hover:bg-slate-100 outline-slate-100 outline-8 px-2 rounded-full"
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
                        <div className="flex flex-col w-full h-full px-2 gap-2 text-md ">
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
                        <div className="flex justify-end gap-2">
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
                                    handleOtpModal();
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
                            <main className="scale-95 h-auto w-full overflow-y-auto px-5">
                              {prfDetailsForApproval.prfPositions &&
                                prfDetailsForApproval.prfPositions.map((position: Position, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      className={`${
                                        position.remarks ? 'hover:border-l-green-600' : 'hover:border-l-red-500'
                                      } cursor-pointer hover:shadow-slate-200 mb-4 flex items-center justify-between border-l-4 py-3 px-5 border-gray-100 shadow-2xl shadow-slate-100 transition-all`}
                                    >
                                      <section className="w-full space-y-3">
                                        <header>
                                          <section className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium text-gray-600">
                                              {position.positionTitle}
                                            </h3>
                                            <p className="text-sm text-gray-600">{position.itemNumber}</p>
                                          </section>
                                          <p className="text-sm text-gray-400">{position.designation}</p>
                                        </header>

                                        <main>
                                          {position.remarks ? (
                                            <section className="flex items-center gap-2">
                                              <p className="text-emerald-600">{position.remarks}</p>
                                            </section>
                                          ) : (
                                            <section className="flex items-center gap-2">
                                              <p className="text-red-400">No remarks set for this position.</p>
                                            </section>
                                          )}
                                        </main>
                                      </section>
                                    </div>
                                  );
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
