/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @nx/enforce-module-boundaries */
import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { useEffect, useState } from 'react';
import { DtrDateSelect } from 'apps/employee-monitoring/src/components/calendar/DtrDateSelect';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import axios from 'axios';
import { isEmpty } from 'lodash';
import CardEmployeeSchedules from 'apps/employee-monitoring/src/components/cards/CardEmployeeSchedules';
import { PrintButton } from 'apps/employee-monitoring/src/components/buttons/PrintButton';
import DailyTimeRecordPdfModal from 'apps/employee-monitoring/src/components/modal/employees/DailyTimeRecordPdfModal';
import { ToastNotification } from '@gscwd-apps/oneui';
import { useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import { EmployeeDtrTable } from 'apps/employee-monitoring/src/components/tables/EmployeeDtrTable';

export default function Index({
  employeeData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Print modal function
  const [printModalIsOpen, setPrintModalIsOpen] = useState<boolean>(false);

  const toggle = () => setPrintModalIsOpen(!printModalIsOpen);
  // const openPrintActionModal = () => {
  //   setPrintModalIsOpen(true)
  // }

  // use dtr store
  const { setEmployeeDtr } = useDtrStore((state) => ({
    setEmployeeDtr: state.setEmployeeDtr,
  }));

  // scheduling store
  const { postResponse, deleteResponse, emptyResponseAndErrors } =
    useScheduleSheetStore((state) => ({
      postResponse: state.employeeSchedule.postResponse,
      deleteResponse: state.employeeSchedule.deleteResponse,
      emptyResponseAndErrors: state.emptyResponseAndErrors,
    }));

  // clear errors
  useEffect(() => {
    if (!isEmpty(postResponse)) {
      setTimeout(() => {
        emptyResponseAndErrors();
      }, 1500);
    }
  }, [postResponse]);

  useEffect(() => {
    setEmployeeDtr([]);
  }, []);

  return (
    <>
      <div className="w-full">
        <BreadCrumbs
          title="Daily Time Record"
          crumbs={[
            {
              layerNo: 1,
              layerText: 'Employees',
              path: '/employees',
            },
            { layerNo: 2, layerText: 'Daily Time Record', path: '' },
          ]}
        />

        {/* Successfully added */}
        {!isEmpty(postResponse) ? (
          <ToastNotification
            notifMessage="Successfully added a schedule!"
            toastType="success"
          />
        ) : null}

        <div className="flex flex-col w-full gap-6">
          {/* DTR CARD */}
          <div className="mx-5">
            <Card>
              {/** Top Card */}
              <div className="flex flex-col flex-wrap ">
                <Card className="rounded-t bg-slate-200">
                  {/* HEADER */}
                  <div className="grid gap-2 xs:pb-2 sm:-mb-10 md:-mb-10 lg:-mb-10 xs:grid-rows-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                    <section className="flex items-center gap-4 px-2">
                      {employeeData.photoUrl ? (
                        <div className="flex flex-wrap justify-center">
                          <div className="w-[6rem]">
                            <img
                              src={employeeData.photoUrl}
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
                        <div className="text-xl text-gray-500">
                          {employeeData
                            ? employeeData.assignment.positionTitle
                            : null}
                        </div>
                      </div>
                    </section>
                    <section className="flex justify-end">
                      <div className="px-5 py-2 bg-gray-200 rounded">
                        <span className="text-sm font-medium">Legend</span>
                        <div className="grid grid-rows-2">
                          <div className="grid items-center grid-cols-2 gap-1">
                            <span className="text-xs font-light">
                              Regular Holiday -
                            </span>
                            <i className="text-2xl text-red-400 bx bxs-checkbox"></i>
                          </div>
                          <div className="grid items-center grid-cols-2 gap-1">
                            <span className="text-xs font-light">
                              Special Holiday -
                            </span>
                            <i className="text-2xl text-blue-400 bx bxs-checkbox"></i>
                          </div>
                          <div className="grid items-center grid-cols-2 gap-1">
                            <span className="text-xs font-light">
                              Late/Undertime -
                            </span>
                            <div className="">
                              <span className="max-w-[5rem] px-2 py-0.5  text-xs font-light text-center text-black rounded bg-yellow-400">
                                Time Log
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="flex justify-end gap-2">
                    <DtrDateSelect />
                    <PrintButton onClick={toggle} />
                  </div>
                </Card>
                {/* EMPLOYEE DTR TABLE */}
                <EmployeeDtrTable employeeData={employeeData} />
              </div>
            </Card>
          </div>
          <div className="mx-5">
            {/* SCHEDULE CARD */}

            <CardEmployeeSchedules employeeData={employeeData} />
          </div>
        </div>

        <DailyTimeRecordPdfModal
          printModalIsOpen={printModalIsOpen}
          toggle={toggle}
          employeeData={employeeData}
        />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/employees/${context.query.id}`
    );

    return { props: { employeeData: data } };
  } catch (error) {
    return {
      props: { employeeData: {} },
      redirect: { destination: '/404', permanent: false },
    };
  }
};
