import { Dialog, Transition } from '@headlessui/react';
import dayjs from 'dayjs';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import {
  HiArrowSmLeft,
  HiOutlineUser,
  HiOutlineDocumentDuplicate,
  HiOutlineCalendar,
  HiOutlinePencil,
} from 'react-icons/hi';
// import { confirmOtpCode } from '../../../components/fixed/otp/OtpConfirm';
// import { getCountDown } from '../../../components/fixed/otp/OtpCountDown';
import { OtpModal } from '../../../../components/fixed/otp/OtpModal';
// import { requestOtpCode } from '../../../components/fixed/otp/OtpRequest';
// import PortalSVG from '../../../components/fixed/svg/PortalSvg';
// import { Notice } from '../../../components/modular/alerts/Notice';
import { Button } from '../../../../components/modular/forms/buttons/Button';
// import { TextField } from '../../../components/modular/forms/TextField';
import { PageTitle } from '../../../../components/modular/html/PageTitle';
import {
  getEmployeeDetailsFromHr,
  getEmployeeProfile,
} from '../../../../utils/helpers/http-requests/employee-requests';
import { approvePrf, getPrfById } from '../../../../utils/helpers/prf.requests';
import {
  EmployeeDetailsPrf,
  EmployeeProfile,
} from '../../../../types/employee.type';
import {
  Position,
  PrfDetailsForApproval,
  PrfStatus,
} from '../../../../types/prf.types';
import { withSession } from '../../../../utils/helpers/with-session';

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
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false); //FOR OPENING CONFIRMATION  DIALOG BOX
  const [otpFieldError, setOtpFieldError] = useState<boolean>(false);
  const [wiggleEffect, setWiggleEffect] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleOtpModal = () => {
    setOtpFieldError(false);
    setIsOpen(true);
    setWiggleEffect(false);
  };

  return (
    <>
      <PageTitle title={prfDetails.prfNo} />

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={() => setIsOpen(isSubmitLoading ? true : false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="transform overflow-hidden bg-white text-left align-middle shadow-xl transition-all rounded-xl">
                  <div className={`w-100 relative bg-white rounded max-w-sm`}>
                    <Dialog.Title className="bg-indigo-600 h-12 w-full py-8 px-10 flex justify-center items-center text-center text-white font-bold">
                      APPROVE PRF
                    </Dialog.Title>
                    <OtpModal
                      mobile={profile.mobileNumber}
                      isModalOpen={setIsOpen}
                      employeeId={employee.userId}
                      remarks={''}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="w-screen h-screen py-10 px-36 overflow-hidden flex flex-col">
        <button
          className="flex items-center gap-2 text-gray-700 transition-colors ease-in-out hover:text-gray-700"
          onClick={() => router.back()}
        >
          <HiArrowSmLeft className="h-5 w-5" />
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
          <main className="h-full flex">
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
                  <p className="text-indigo-500 font-medium">
                    Examination is required
                  </p>
                ) : (
                  <p className="text-orange-500 font-medium">
                    No examination required
                  </p>
                )}
              </section>

              <section className="mt-10">
                <Button
                  btnLabel={'Approve Request'}
                  fluid
                  strong
                  onClick={() => {
                    handleOtpModal();
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
                        <section className="space-y-3 w-full">
                          <header>
                            <section className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-600 text-lg">
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

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    console.log(context.query.prfid);
    try {
      const employee = await getEmployeeDetailsFromHr(context);

      const profile = await getEmployeeProfile(employee.userId);

      // get prf details
      const prfDetails = await getPrfById(`${context.query.prfid}`, context);

      // return the result
      console.log(prfDetails);
      return { props: { profile, employee, prfDetails } };
    } catch (error) {
      return { notFound: true };
    }
  }
);
