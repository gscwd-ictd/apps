/* eslint-disable @nx/enforce-module-boundaries */
import { Modal, ToastNotification } from '@gscwd-apps/oneui';
import { HiOutlineDocument, HiX } from 'react-icons/hi';
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
import { PrfTimeline } from '../prf-view/PrfTimeline';
import { PageTitle } from '../../../modular/html/PageTitle';
import {
  getEmployeeDetailsFromHr,
  getEmployeeProfile,
} from '../../../../utils/helpers/http-requests/employee-requests';
import { getPrfById, getPrfTrailByPrfId } from '../../../../utils/helpers/prf.requests';
import { EmployeeDetailsPrf, EmployeeProfile } from '../../../../types/employee.type';
import { Position, PrfDetails, PrfTrail } from '../../../../types/prf.types';
import { withCookieSession } from '../../../../utils/helpers/session';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { PrfPositionCard } from './PrfPositionCard';
import { ViewPositionModal } from '../prf-view-position/ViewPositionModal';

type ModalProps = {
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalAction: () => void;
};

export const DisapprovedPrfModal = ({ modalState, setModalState, closeModalAction }: ModalProps) => {
  const {
    selectedPrfId,
    patchResponse,
    selectedPosition,
    getPrfDetails,
    getPrfDetailsSuccess,
    getPrfDetailsFail,
    setSelectedPosition,
    setViewPositionModalIsOpen,
    getPrfTrail,
    getPrfTrailSuccess,
    getPrfTrailFail,
    emptyResponseAndError,
  } = usePrfStore((state) => ({
    selectedPrfId: state.selectedPrfId,
    patchResponse: state.response.patchResponse,
    selectedPosition: state.selectedPosition,
    setViewPositionModalIsOpen: state.setViewPositionModalIsOpen,
    setSelectedPosition: state.setSelectedPosition,
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
            <div className="flex justify-between px-5">
              <span className="text-xl md:text-2xl">Disapproved PRF</span>
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
                <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
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
                          <h1 className="text-2xl font-semibold text-gray-700">Disapproved Request</h1>
                          <p className="text-gray-500">{prfDetails.prfNo}</p>
                        </section>
                      </header>

                      <section className="w-full py-5 scale-[60%] lg:scale-75">
                        <PrfTimeline prfTrail={prfTrail} />
                      </section>

                      <main>
                        <main className="flex flex-col h-full lg:flex-row">
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
                            <main className="w-full h-full px-5 overflow-y-auto scale-95">
                              {prfDetails.prfPositions.map((position: Position, index: number) => {
                                return <PrfPositionCard position={position} key={index} />;
                              })}
                            </main>
                          </section>
                        </main>
                        <section className="flex items-center gap-4">
                          <HiOutlineDocument className="text-gray-700 shrink-0" />
                          <p className="font-medium text-red-500">
                            Disapprove Remarks: {prfDetails.disapprovedRemarks}
                          </p>
                        </section>
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

export default DisapprovedPrfModal;
