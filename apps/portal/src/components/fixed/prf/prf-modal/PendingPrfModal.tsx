/* eslint-disable @nx/enforce-module-boundaries */
import { Modal, ToastNotification } from '@gscwd-apps/oneui';
import { HiX } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { usePrfStore } from 'apps/portal/src/store/prf.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import { useEffect } from 'react';
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
import { getPrfById, getPrfTrailByPrfId } from '../../../../utils/helpers/prf.requests';
import { EmployeeDetailsPrf, EmployeeProfile } from '../../../../types/employee.type';
import { Position, PrfDetails, PrfTrail } from '../../../../types/prf.types';
import { withCookieSession } from '../../../../../src/utils/helpers/session';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const PendingPrfModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    selectedPrfId,
    patchResponse,
    setPendingPrfIsModalOpen,
    getPrfDetails,
    getPrfDetailsSuccess,
    getPrfDetailsFail,

    getPrfTrail,
    getPrfTrailSuccess,
    getPrfTrailFail,
    emptyResponseAndError,
  } = usePrfStore((state) => ({
    selectedPrfId: state.selectedPrfId,
    patchResponse: state.response.patchResponse,
    setPendingPrfIsModalOpen: state.setPendingPrfModalIsOpen,
    getPrfDetails: state.getPrfDetails,
    getPrfDetailsSuccess: state.getPrfDetailsSuccess,
    getPrfDetailsFail: state.getPrfDetailsFail,
    getPrfTrail: state.getPrfTrail,
    getPrfTrailSuccess: state.getPrfTrailSuccess,
    getPrfTrailFail: state.getPrfTrailFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

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

  return (
    <>
      <Modal size={'full'} open={modalState} setOpen={setModalState}>
        <Modal.Header>
          <h3 className="font-semibold text-gray-700">
            <div className="px-5 flex justify-between">
              <span className="text-xl md:text-2xl">Pending PRF</span>
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

                    <div className="flex flex-col w-full h-auto py-10 overflow-hidden pl-4 pr-4 lg:pl-32 lg:pr-32">
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
                        <main className="flex flex-col lg:flex-row h-full">
                          <aside className="shrink-0 w-[20rem]">
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
                          </aside>
                          <section className="w-full pt-4 lg:pt-0">
                            <main className="scale-95 h-auto w-full overflow-y-auto px-5">
                              {prfDetails.prfPositions.map((position: Position, index: number) => {
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

export default PendingPrfModal;
