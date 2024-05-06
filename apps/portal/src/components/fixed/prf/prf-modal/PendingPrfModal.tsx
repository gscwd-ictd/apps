/* eslint-disable @nx/enforce-module-boundaries */
import { Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
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
import { PrfTimeline } from '../../../../components/fixed/prf/prf-view/PrfTimeline';
import { PageTitle } from '../../../../components/modular/html/PageTitle';
import {
  getEmployeeDetailsFromHr,
  getEmployeeProfile,
} from '../../../../utils/helpers/http-requests/employee-requests';
import { getPrfById, getPrfTrailByPrfId, patchPrfRequest } from '../../../../utils/helpers/prf.requests';
import { EmployeeDetailsPrf, EmployeeProfile } from '../../../../types/employee.type';
import { Position, PrfDetails, PrfStatus, PrfTrail } from '../../../../types/prf.types';
import { withCookieSession } from '../../../../../src/utils/helpers/session';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { PrfPositionCard } from './PrfPositionCard';
import { ViewPositionModal } from '../prf-view-position/ViewPositionModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const PendingPrfModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    selectedPrfId,
    patchResponse,
    selectedPosition,

    setSelectedPosition,
    setPendingPrfIsModalOpen,
    getPrfDetails,
    getPrfDetailsSuccess,
    getPrfDetailsFail,

    getPrfTrail,
    getPrfTrailSuccess,
    getPrfTrailFail,
    patchPrfFail,
    patchPrfSuccess,
    emptyResponseAndError,
  } = usePrfStore((state) => ({
    selectedPrfId: state.selectedPrfId,
    patchResponse: state.response.patchResponse,
    selectedPosition: state.selectedPosition,
    setSelectedPosition: state.setSelectedPosition,
    setPendingPrfIsModalOpen: state.setPendingPrfModalIsOpen,
    getPrfDetails: state.getPrfDetails,
    getPrfDetailsSuccess: state.getPrfDetailsSuccess,
    getPrfDetailsFail: state.getPrfDetailsFail,
    getPrfTrail: state.getPrfTrail,
    getPrfTrailSuccess: state.getPrfTrailSuccess,
    getPrfTrailFail: state.getPrfTrailFail,
    emptyResponseAndError: state.emptyResponseAndError,
    patchPrfSuccess: state.patchPrfSuccess,
    patchPrfFail: state.patchPrfFail,
  }));

  const setViewPositionModalIsOpen = usePrfStore((state) => state.setViewPositionModalIsOpen);

  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  const router = useRouter();

  const prfUrl = process.env.NEXT_PUBLIC_HRIS_URL;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  //get prf details (individual)
  const {
    data: prfDetails,
    isLoading: swrPrfIsLoading,
    error: swrPrfError,
    mutate: mutatePrfDetails,
  } = useSWR(`${prfUrl}/prf/details/${selectedPrfId}`, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);

  // Initial zustand state update
  useEffect(() => {
    if (swrPrfIsLoading) {
      getPrfDetails(swrPrfIsLoading);
    }
  }, [swrPrfIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(prfDetails)) {
      getPrfDetailsSuccess(swrPrfIsLoading, prfDetails);
    }

    if (!isEmpty(swrPrfError)) {
      getPrfDetailsFail(swrPrfIsLoading, swrPrfError.message);
    }
  }, [prfDetails, swrPrfError]);

  //get prf trail
  const {
    data: prfTrail,
    isLoading: swrPrfTrailIsLoading,
    error: swrPrfTrailError,
    mutate: mutatePrfTrail,
  } = useSWR(`${prfUrl}/prf-trail/${selectedPrfId}`, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  // call the function to cancel the request
  const handleCancelRequest = async () => {
    const { error, result } = await patchPrfRequest(`/prf/`, {
      _id: selectedPrfId,
    });
    if (error) {
      // request is done set loading to false and set the error message
      patchPrfFail(result);
    } else if (!error) {
      // request is done set loading to false and set the update response
      patchPrfSuccess(result);
      setPendingPrfIsModalOpen(false);
      setCancelModalIsOpen(false);
    }
  };

  // Initial zustand state update
  useEffect(() => {
    if (swrPrfTrailIsLoading) {
      getPrfTrail(swrPrfTrailIsLoading);
    }
  }, [swrPrfTrailIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(prfTrail)) {
      getPrfTrailSuccess(swrPrfTrailIsLoading, prfTrail);
    }

    if (!isEmpty(swrPrfTrailError)) {
      getPrfTrailFail(swrPrfTrailIsLoading, swrPrfTrailError.message);
    }
  }, [prfTrail, swrPrfTrailError]);

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal size={'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="flex justify-between px-5">
              <span className="text-xl md:text-2xl">Pending PRF</span>
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
            {swrPrfIsLoading && swrPrfTrailIsLoading ? (
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

                {/* Load PRF Trail Failed Error */}
                {!isEmpty(swrPrfTrailError) ? (
                  <ToastNotification toastType="error" notifMessage={`${swrPrfTrailError}`} />
                ) : null}

                {prfDetails && prfTrail ? (
                  <>
                    <PageTitle title={prfDetails.prfNo} />

                    <div className="flex flex-col w-full h-auto py-10 pl-4 pr-4 overflow-hidden lg:pl-32 lg:pr-32">
                      <header className="flex items-center justify-between">
                        <section className="shrink-0">
                          <h1 className="text-2xl font-semibold text-gray-700">Pending Request</h1>
                          <p className="text-gray-500">{prfDetails.prfNo}</p>
                        </section>
                      </header>

                      <section className="w-full py-5 scale-[60%] lg:scale-75">
                        <PrfTimeline prfTrail={prfTrail} />
                      </section>

                      <main>
                        <main className="flex flex-col h-full lg:flex-row">
                          <aside className="shrink-0 sm:w-full lg:w-[20rem] ">
                            <section className="flex items-center gap-4">
                              <HiOutlineUser className="text-gray-700 shrink-0" />
                              <p className="font-medium text-gray-600 truncate">
                                {employeeDetail.profile.firstName} {employeeDetail.profile.lastName}
                              </p>
                            </section>

                            <section className="flex items-center gap-4">
                              <HiOutlineDocumentDuplicate className="text-gray-700 shrink-0" />
                              <p className="font-medium text-gray-600 truncate">
                                {employeeDetail.employmentDetails.assignment.positionTitle}
                              </p>
                            </section>

                            <section className="flex items-center gap-4">
                              <HiOutlineCalendar className="text-gray-700 shrink-0" />
                              <p className="font-medium text-gray-600">
                                {DateFormatter(prfDetails.createdAt, 'MMMM DD, YYYY')}
                              </p>
                            </section>

                            <section className="flex items-center gap-4">
                              <HiOutlinePencil className="text-gray-700 shrink-0" />
                              {prfDetails.withExam ? (
                                <p className="font-medium text-indigo-500">Examination is required</p>
                              ) : (
                                <p className="font-medium text-orange-500">No examination required</p>
                              )}
                            </section>

                            <section className="flex flex-col w-full gap-2 mt-10">
                              <Button
                                variant="danger"
                                onClick={() => {
                                  setCancelModalIsOpen(true);
                                }}
                              >
                                Cancel this Request
                              </Button>
                            </section>
                          </aside>
                          <section className="w-full pt-4 lg:pt-0">
                            <main className="w-full h-auto px-5 overflow-y-auto scale-95">
                              {prfDetails?.prfPositions.length > 0 &&
                                prfDetails?.prfPositions.map((position: Position, index: number) => {
                                  return <PrfPositionCard position={position} key={index} />;
                                })}
                            </main>
                          </section>
                        </main>
                      </main>
                    </div>
                  </>
                ) : null}

                <Modal
                  size={`${windowWidth > 1024 ? 'sm' : 'xl'}`}
                  open={cancelModalIsOpen}
                  setOpen={setCancelModalIsOpen}
                >
                  <Modal.Header>
                    <h3 className="text-xl font-semibold text-gray-700">
                      <div className="flex justify-between px-2">
                        <span>Cancel Position Request</span>
                        <button
                          className="px-2 rounded-full hover:bg-slate-100 outline-slate-100 outline-8"
                          onClick={() => {
                            setCancelModalIsOpen(false);
                          }}
                        >
                          <HiX />
                        </button>
                      </div>
                    </h3>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="flex flex-col w-full h-full gap-2 px-4 text-md ">
                      <span className="font-medium text-gray-700">
                        Are you sure you want to cancel this {prfDetails?.prfNo}?
                      </span>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <div className="flex justify-end gap-2 px-4">
                      <div className="flex gap-4 ">
                        <Button variant={'primary'} onClick={handleCancelRequest} className="w-[6rem]">
                          Yes
                        </Button>
                        <Button variant={'default'} onClick={() => setCancelModalIsOpen(false)} className="w-[6rem]">
                          No
                        </Button>
                      </div>
                    </div>
                  </Modal.Footer>
                </Modal>
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

export default PendingPrfModal;
