/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @nx/enforce-module-boundaries */
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { PrintButton } from 'apps/employee-monitoring/src/components/buttons/PrintButton';
import DailyTimeRecordPdfModal from 'apps/employee-monitoring/src/components/modal/employees/DailyTimeRecordPdfModal';
import { ToastNotification } from '@gscwd-apps/oneui';
import { LeaveLedgerTable } from 'apps/employee-monitoring/src/components/tables/LeaveLedgerTable';
import LeaveLedgerAdjModal from 'apps/employee-monitoring/src/components/modal/employees/leave-ledger/LeaveLedgerAdjModal';
import { useLeaveBenefitStore } from 'apps/employee-monitoring/src/store/leave-benefits.store';
import { useLeaveLedgerStore } from 'apps/employee-monitoring/src/store/leave-ledger.store';
import LeaveLedgerPdfModal from 'apps/employee-monitoring/src/components/modal/employees/leave-ledger/LeaveLedgerPdfModal';

export default function Index({ employeeData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Print modal function
  const [printModalIsOpen, setPrintModalIsOpen] = useState<boolean>(false);

  // adjustment modal function
  const [adjustmentModalIsOpen, setAdjustmentModalIsOpen] = useState<boolean>(false);

  // zustand store init
  const { ErrorLeaveBenefits } = useLeaveBenefitStore((state) => ({
    ErrorLeaveBenefits: state.error.errorLeaveBenefits,
  }));

  const { ErrorLeaveAdjustment } = useLeaveLedgerStore((state) => ({
    ErrorLeaveAdjustment: state.errorLeaveAdjustment,
  }));

  const toggle = () => setPrintModalIsOpen(!printModalIsOpen);

  // open
  const openAdjustmentModalAction = () => {
    setAdjustmentModalIsOpen(true);
  };

  // close
  const closeAdjustmentModalAction = () => {
    setAdjustmentModalIsOpen(false);
  };

  return (
    <>
      <div className="w-full">
        <BreadCrumbs
          title="Leave Ledger"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Employees',
              path: '/employees',
            },
            { layerNo: 2, layerText: 'Leave Ledger', path: '' },
          ]}
        />

        {/* Error Notifications */}
        {!isEmpty(ErrorLeaveBenefits) ? (
          <ToastNotification toastType="error" notifMessage={ErrorLeaveBenefits} />
        ) : null}

        {!isEmpty(ErrorLeaveAdjustment) ? (
          <ToastNotification toastType="error" notifMessage={ErrorLeaveAdjustment} />
        ) : null}

        <LeaveLedgerAdjModal
          modalState={adjustmentModalIsOpen}
          setModalState={setAdjustmentModalIsOpen}
          employeeId={employeeData.userId}
          closeModalAction={closeAdjustmentModalAction}
        />

        {/* Modal is available if DTR is pulled */}
        {!isEmpty(employeeData) ? (
          <LeaveLedgerPdfModal printModalIsOpen={printModalIsOpen} toggle={toggle} employeeData={employeeData} />
        ) : null}

        {/* LEAVE LEDGER */}
        <div className="px-5">
          {/** Top Card */}
          <Card>
            <div className="flex flex-col gap-2">
              {/* HEADER */}
              <div className="flex mb-10 ">
                <section className="flex items-center gap-4 px-2 w-full">
                  {employeeData.photoUrl ? (
                    <div className="flex flex-wrap justify-center">
                      <div className="w-[6rem]">
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_SERVER_URL}${employeeData.photoUrl}`}
                          alt="user-circle"
                          className="h-auto max-w-full align-middle border-none rounded-full shadow"
                        />
                      </div>
                    </div>
                  ) : (
                    <i className="text-gray-400 text-7xl bx bxs-user-circle"></i>
                  )}

                  <div className="flex flex-col">
                    <div className="text-2xl font-semibold text-gray-600">
                      {employeeData ? employeeData.fullName : null}
                    </div>
                    <div className="text-xl text-gray-500">{employeeData ? employeeData.companyId : null}</div>
                    <div className="text-xl text-gray-500">
                      {employeeData ? employeeData.assignment.positionTitle : null}
                    </div>
                  </div>
                </section>

                <section className="inline-grid grid-cols-1 gap-4 justify-items-end w-full">
                  <div className="px-5 py-2 bg-gray-200 rounded w-2/5">
                    <span className="text-sm font-medium">Legend</span>
                    <div className="grid grid-rows-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-light w-5/6">Forced Leave - </span>
                        <i className="text-2xl text-red-200 bx bxs-checkbox w-1/5"></i>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-light w-5/6">Vacation Leave -</span>
                        <i className="text-2xl text-green-200 bx bxs-checkbox w-1/5"></i>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-light w-5/6">Sick Leave -</span>
                        <i className="text-2xl text-orange-200 bx bxs-checkbox w-1/5"></i>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-light w-5/6">Special Privilege Leave -</span>
                        <i className="text-2xl text-cyan-200 bx bxs-checkbox w-1/5"></i>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-light w-5/6">Special Leave Benefit-</span>
                        <i className="text-2xl text-blue-200 bx bxs-checkbox w-1/5"></i>
                      </div>
                    </div>
                  </div>

                  <div className="w-fit flex gap-2">
                    <button
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs p-2.5 text-center inline-flex items-center  dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600"
                      onClick={openAdjustmentModalAction}
                    >
                      <i className="bx bxs-plus-square"></i>&nbsp; Adjustment
                    </button>

                    <PrintButton onClick={toggle} />
                  </div>
                </section>
              </div>

              {/* LEAVE LEDGER TABLE */}
              <LeaveLedgerTable employeeData={employeeData} />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HRMS_DOMAIN_BE}/employees/${context.query.id}`);

    return { props: { employeeData: data } };
  } catch (error) {
    return {
      props: { employeeData: {} },
      redirect: { destination: '/404', permanent: false },
    };
  }
};
