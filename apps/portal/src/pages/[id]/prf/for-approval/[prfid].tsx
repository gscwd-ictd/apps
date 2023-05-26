/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import {
  HiArrowSmLeft,
  HiOutlineUser,
  HiOutlineDocumentDuplicate,
  HiOutlineCalendar,
  HiOutlinePencil,
} from 'react-icons/hi';

import { Button } from '../../../../components/modular/forms/buttons/Button';
import { PageTitle } from '../../../../components/modular/html/PageTitle';
import {
  getEmployeeDetailsFromHr,
  getEmployeeProfile,
} from '../../../../utils/helpers/http-requests/employee-requests';
import { approvePrf, getPrfById } from '../../../../utils/helpers/prf.requests';
import {
  EmployeeDetailsPrf,
  EmployeeProfile,
  employeeDummy,
} from '../../../../types/employee.type';
import {
  Position,
  PrfDetailsForApproval,
  PrfStatus,
} from '../../../../types/prf.types';
import { withCookieSession } from '../../../../../src/utils/helpers/session';
import { Modal, OtpModal } from '@gscwd-apps/oneui';
import { PrfOtpContents } from '../../../../../src/components/fixed/prf/prfOtp/PrfOtpContents';
import { usePrfStore } from '../../../../../src/store/prf.store';
import { useState } from 'react';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

type ForApprovalProps = {
  profile: EmployeeProfile;
  employee: EmployeeDetailsPrf;
  prfDetails: PrfDetailsForApproval;
};

export default function ForApproval({
  profile,
  employee,
  prfDetails,
}: ForApprovalProps) {
  const { prfOtpModalIsOpen, setPrfOtpModalIsOpen } = usePrfStore((state) => ({
    prfOtpModalIsOpen: state.prfOtpModalIsOpen,
    setPrfOtpModalIsOpen: state.setPrfOtpModalIsOpen,
  }));

  const router = useRouter();
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>('');

  const handleOtpModal = () => {
    setPrfOtpModalIsOpen(true);
  };
  const handleDecline = () => {
    approvePrf(
      `${router.query.prfid}`,
      PrfStatus.DISAPPROVED,
      employee.userId,
      remarks
    );
  };
  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <PageTitle title={prfDetails.prfNo} />

      <OtpModal
        modalState={prfOtpModalIsOpen}
        setModalState={setPrfOtpModalIsOpen}
        title={'PRF OTP'}
      >
        {/* contents */}
        <PrfOtpContents
          mobile={profile.mobileNumber}
          employeeId={employee.userId}
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
          <h3 className="font-semibold text-xl text-gray-700">
            <div className="px-5 flex justify-between">
              <span>Decline Position Request</span>
            </div>
          </h3>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full flex flex-col gap-2 text-md ">
            {'Please indicate reason for declining this position request:'}
            <form id="declinePrfForm">
              <textarea
                required
                placeholder="Reason for decline"
                className={`
                        w-full h-32 p-2 border resize-none
                    `}
                onChange={(e) =>
                  setRemarks(e.target.value as unknown as string)
                }
              ></textarea>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2">
            <div className="min-w-[6rem] max-w-auto flex gap-4">
              <Button
                form="declinePrfForm"
                variant={'primary'}
                onClick={(e) => handleDecline()}
                btnLabel={'Submit'}
              ></Button>
              <Button
                variant={'danger'}
                onClick={() => {
                  setIsDeclineModalOpen(false);
                }}
                btnLabel={'Cancel'}
              ></Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      <div className="flex flex-col w-screen h-screen py-10 overflow-hidden pl-4 pr-4 lg:pl-32 lg:pr-32">
        <button
          className="flex items-center gap-2 text-gray-700 transition-colors ease-in-out hover:text-gray-700"
          onClick={() => router.back()}
        >
          <HiArrowSmLeft className="w-5 h-5" />
          <span className="font-medium">Go Back</span>
        </button>
        <header className="flex items-center justify-between">
          <section className="shrink-0">
            <h1 className="text-2xl font-semibold text-gray-700">
              Pending Request
            </h1>
            <p className="text-gray-500">{prfDetails.prfNo}</p>
          </section>
        </header>

        <main className="mt-16">
          <main className="flex flex-col md:flex-row h-full items-center md:items-start">
            <aside className="shrink-0 w-[20rem]">
              <section className="flex items-center gap-4">
                <HiOutlineUser className="text-gray-700 shrink-0" />
                <p className="font-medium text-gray-600 truncate">
                  {prfDetails.from.name}
                </p>
              </section>

              <section className="flex items-center gap-4">
                <HiOutlineDocumentDuplicate className="text-gray-700 shrink-0" />
                <p className="font-medium text-gray-600 truncate">
                  {prfDetails.from.position}
                </p>
              </section>

              <section className="flex items-center gap-4">
                <HiOutlineCalendar className="text-gray-700 shrink-0" />
                <p className="font-medium text-gray-600">
                  {dayjs(prfDetails.createdAt).format('MMMM DD, YYYY')}
                </p>
              </section>

              <section className="flex items-center gap-4">
                <HiOutlinePencil className="text-gray-700 shrink-0" />
                {prfDetails.withExam ? (
                  <p className="font-medium text-indigo-500">
                    Examination is required
                  </p>
                ) : (
                  <p className="font-medium text-orange-500">
                    No examination required
                  </p>
                )}
              </section>

              <section className="mt-10 flex flex-col w-full  gap-2">
                <Button
                  btnLabel={'Approve Request'}
                  fluid
                  strong
                  onClick={() => {
                    handleOtpModal();
                  }}
                />
                <Button
                  btnLabel={'Disapprove Request'}
                  variant="danger"
                  fluid
                  strong
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onClick={() => {
                    setIsDeclineModalOpen(true);
                  }}
                />
              </section>
            </aside>
            <section className="w-full">
              <main className="scale-95 h-[31rem] w-full overflow-y-auto px-5">
                {prfDetails.prfPositions.map(
                  (position: Position, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`${
                          position.remarks
                            ? 'hover:border-l-green-600'
                            : 'hover:border-l-red-500'
                        } cursor-pointer hover:shadow-slate-200 mb-4 flex items-center justify-between border-l-4 py-3 px-5 border-gray-100 shadow-2xl shadow-slate-100 transition-all`}
                      >
                        <section className="w-full space-y-3">
                          <header>
                            <section className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-600">
                                {position.positionTitle}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {position.itemNumber}
                              </p>
                            </section>
                            <p className="text-sm text-gray-400">
                              {position.designation}
                            </p>
                          </header>

                          <main>
                            {position.remarks ? (
                              <section className="flex items-center gap-2">
                                <p className="text-emerald-600">
                                  {position.remarks}
                                </p>
                              </section>
                            ) : (
                              <section className="flex items-center gap-2">
                                <p className="text-red-400">
                                  No remarks set for this position.
                                </p>
                              </section>
                            )}
                          </main>
                        </section>
                      </div>
                    );
                  }
                )}
              </main>
            </section>
          </main>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    // console.log(context.query.prfid);
    try {
      const employee = await getEmployeeDetailsFromHr(context);
      const profile = await getEmployeeProfile(employee.userId);

      // const employee = employeeDummy;
      // const profile = await getEmployeeProfile(employee.user._id);

      // get prf details
      const prfDetails = await getPrfById(`${context.query.prfid}`, context);

      // return the result
      // console.log(prfDetails);
      return { props: { profile, employee, prfDetails } };
    } catch (error) {
      return { notFound: true };
    }
  }
);
