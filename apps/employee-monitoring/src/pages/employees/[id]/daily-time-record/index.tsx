import { Card } from 'apps/employee-monitoring/src/components/cards/Card';
import { BreadCrumbs } from 'apps/employee-monitoring/src/components/navigations/BreadCrumbs';
import { useEffect, useState } from 'react';
import { DtrDateSelect } from 'apps/employee-monitoring/src/components/calendar/DtrDateSelect';
import { useDtrStore } from 'apps/employee-monitoring/src/store/dtr.store';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import axios from 'axios';
import { isEmpty } from 'lodash';
import CardEmployeeSchedules from 'apps/employee-monitoring/src/components/cards/CardEmployeeSchedules';
import { PrintButton } from 'apps/employee-monitoring/src/components/buttons/PrintButton';
import DailyTimeRecordPdfModal from 'apps/employee-monitoring/src/components/modal/employees/DailyTimeRecordPdfModal';
import { Button, ToastNotification } from '@gscwd-apps/oneui';
import { useScheduleSheetStore } from 'apps/employee-monitoring/src/store/schedule-sheet.store';
import { EmployeeDtrTable } from 'apps/employee-monitoring/src/components/tables/EmployeeDtrTable';
import { EmployeeDtrWithScheduleAndSummary } from 'libs/utils/src/lib/types/dtr.type';
import { Can } from 'apps/employee-monitoring/src/context/casl/Can';
import { Navigate } from 'apps/employee-monitoring/src/components/router/navigate';
import AddRemarksDTRModal from 'apps/employee-monitoring/src/components/modal/employees/AddRemarksDTRModal';

import useSWR from 'swr';
import fetcherEMS from 'apps/employee-monitoring/src/utils/fetcher/FetcherEMS';

export default function Index({ employeeData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // Print modal function
  const [printModalIsOpen, setPrintModalIsOpen] = useState<boolean>(false);

  // add modal function
  const [addModalIsOpen, setAddModalIsOpen] = useState<boolean>(false);
  const openAddActionModal = () => setAddModalIsOpen(true);
  const closeAddActionModal = () => setAddModalIsOpen(false);

  const toggle = () => setPrintModalIsOpen(!printModalIsOpen);

  // use dtr store
  const {
    employeeDtr,
    setEmployeeDtr,

    selectedMonth,
    selectedYear,

    getEmployeeDtr,
    getEmployeeDtrSuccess,
    getEmployeeDtrFail,

    emptyErrorsAndResponse,

    dtrRemarksToSelectedDates,
    errorAddDtrRemarksToSelectedDates,
    errorUpdateDtrRemarks,
    dtrRemarks,
  } = useDtrStore((state) => ({
    employeeDtr: state.employeeDtr,
    setEmployeeDtr: state.setEmployeeDtr,

    selectedMonth: state.selectedMonth,
    selectedYear: state.selectedYear,

    getEmployeeDtr: state.getEmployeeDtr,
    getEmployeeDtrSuccess: state.getEmployeeDtrSuccess,
    getEmployeeDtrFail: state.getEmployeeDtrFail,

    emptyErrorsAndResponse: state.emptyErrorsAndResponse,

    dtrRemarksToSelectedDates: state.dtrRemarksToSelectedDates.postResponse,
    errorAddDtrRemarksToSelectedDates: state.error.errorAddDtrRemarksToSelectedDates,
    errorUpdateDtrRemarks: state.error.errorUpdateDtrRemarks,
    dtrRemarks: state.dtrRemarks.patchResponse,
  }));

  // scheduling store
  const { postResponse, deleteResponse, emptyResponseAndErrors } = useScheduleSheetStore((state) => ({
    postResponse: state.employeeSchedule.postResponse,
    deleteResponse: state.employeeSchedule.deleteResponse,
    emptyResponseAndErrors: state.emptyResponseAndErrors,
  }));

  useEffect(() => {
    setEmployeeDtr({} as EmployeeDtrWithScheduleAndSummary);
  }, []);

  const {
    data: swrEmployeeDtr,
    isLoading: swrEmployeeDtrLoading,
    error: swrEmployeeDtrError,
    mutate: swrMutateEmployeeDtr,
  } = useSWR(`/daily-time-record/employees/${employeeData.companyId}/${selectedYear}/${selectedMonth}`, fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (swrEmployeeDtrLoading) {
      getEmployeeDtr();
    }
  }, [swrEmployeeDtrLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrEmployeeDtr)) {
      getEmployeeDtrSuccess(swrEmployeeDtr.data);
    }

    if (!isEmpty(swrEmployeeDtrError)) {
      getEmployeeDtrFail(swrEmployeeDtrError.message);
    }
  }, [swrEmployeeDtr, swrEmployeeDtrError]);

  // clear errors
  useEffect(() => {
    if (!isEmpty(postResponse) || !isEmpty(dtrRemarksToSelectedDates) || !isEmpty(dtrRemarks)) {
      swrMutateEmployeeDtr();
      getEmployeeDtr();

      setTimeout(() => {
        emptyErrorsAndResponse();
      }, 5000);
    }
  }, [postResponse, dtrRemarksToSelectedDates, dtrRemarks]);

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

        {/* Error when adding DTR remarks */}
        {!isEmpty(errorAddDtrRemarksToSelectedDates) ? (
          <ToastNotification notifMessage="Error adding remarks to selected DTR dates" toastType="error" />
        ) : null}

        {/* Error when updating DTR remarks */}
        {!isEmpty(errorUpdateDtrRemarks) ? (
          <ToastNotification notifMessage="Something went wrong with editing DTR remarks" toastType="error" />
        ) : null}

        {/* Post/Patch Request Success*/}
        {!isEmpty(postResponse) ? (
          <ToastNotification notifMessage="Successfully added a schedule!" toastType="success" />
        ) : null}

        {!isEmpty(dtrRemarksToSelectedDates) ? (
          <ToastNotification toastType="success" notifMessage="DTR remarks added successfully" />
        ) : null}

        {!isEmpty(dtrRemarks) ? (
          <ToastNotification toastType="success" notifMessage="DTR remarks updated successfully" />
        ) : null}

        {/* Modal is available if DTR is pulled */}
        {!isEmpty(employeeDtr) ? (
          <DailyTimeRecordPdfModal printModalIsOpen={printModalIsOpen} toggle={toggle} employeeData={employeeData} />
        ) : null}

        <Can I="access" this="Daily_time_record">
          <div className="flex flex-col w-full gap-6 px-5">
            {/* DTR CARD */}
            <Card>
              {/* HEADER */}
              <div className="grid xs:pb-2 sm:-mb-10 md:-mb-10 lg:-mb-10 xs:grid-rows-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                {/* Employee details */}
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
                    <div className="text-xl text-gray-500">{employeeData ? employeeData.companyId : null}</div>
                    <div className="text-xl text-gray-500">
                      {employeeData ? employeeData.assignment.positionTitle : null}
                    </div>
                  </div>
                </section>

                {/* Legend */}
                <Can I="access" this="Daily_time_record_view">
                  <section className="flex justify-end">
                    <div className="px-5 py-2 bg-gray-200 rounded">
                      <span className="text-sm font-medium">Legend</span>
                      <div className="grid grid-rows-2">
                        <div className="grid items-center grid-cols-2 gap-1">
                          <span className="text-xs font-light">Regular Holiday -</span>
                          <i className="text-2xl text-red-400 bx bxs-checkbox"></i>
                        </div>
                        <div className="grid items-center grid-cols-2 gap-1">
                          <span className="text-xs font-light">Special Holiday -</span>
                          <i className="text-2xl text-blue-400 bx bxs-checkbox"></i>
                        </div>
                        <div className="grid items-center grid-cols-2 gap-1">
                          <span className="text-xs font-light">Late/Undertime -</span>
                          <div className="">
                            <span className="max-w-[5rem] px-2 py-0.5  text-xs font-light text-center text-black rounded bg-yellow-400">
                              Time Log
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </Can>
              </div>

              <Can I="access" this="Daily_time_record_view">
                <div className="flex justify-end gap-2">
                  <DtrDateSelect employeeData={employeeData} />
                  <PrintButton onClick={toggle} />
                  <Button variant={'info'} size={'sm'} loading={false} type="button" onClick={openAddActionModal}>
                    <i className="bx bxs-plus-square"></i>&nbsp; Add DTR Remarks
                  </Button>
                </div>

                {/* ADD REMARKS TO DTR MODAL */}
                <AddRemarksDTRModal
                  modalState={addModalIsOpen}
                  setModalState={setAddModalIsOpen}
                  closeModalAction={closeAddActionModal}
                  companyId={employeeData.companyId}
                />

                {/* EMPLOYEE DTR TABLE */}
                <EmployeeDtrTable employeeData={employeeData} />
              </Can>
            </Card>

            {/* SCHEDULE CARD */}
            <Can I="access" this="Employee_schedules_view">
              <CardEmployeeSchedules employeeData={employeeData} />
            </Can>
          </div>
        </Can>

        <Can not I="access" this="Daily_time_record">
          <Navigate to="/page-404" />
        </Can>
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
