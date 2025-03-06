import Head from 'next/head';
import { useEffect } from 'react';
import { HiDocumentAdd, HiNewspaper } from 'react-icons/hi';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { Button, LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import useSWR from 'swr';
import { isEmpty, isEqual } from 'lodash';
import { useOvertimeStore } from 'apps/portal/src/store/overtime.store';
import { OvertimeApplicationModal } from 'apps/portal/src/components/fixed/overtime/OvertimeApplicationModal';
import OvertimeModal from 'apps/portal/src/components/fixed/overtime/OvertimeModal';
import { useRouter } from 'next/router';
import { OvertimeSummaryModal } from 'apps/portal/src/components/fixed/overtime/OvertimeSummaryModal';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { DataTablePortal, fuzzySort, useDataTable } from 'libs/oneui/src/components/Tables/DataTablePortal';
import { EmployeeOvertimeDetail, OvertimeDetails, OvertimeList } from 'libs/utils/src/lib/types/overtime.type';
import { createColumnHelper } from '@tanstack/react-table';
import { ApprovalType } from 'libs/utils/src/lib/enums/approval-type.enum';
import dayjs from 'dayjs';
import UseRenderOvertimeStatus from 'apps/portal/src/utils/functions/RenderOvertimeStatus';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import Image from 'next/image';
import TempPhotoProfile from '../.../../../../../public/profile.jpg';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';

export default function Overtime({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    tab,
    applyOvertimeModalIsOpen,
    pendingOvertimeModalIsOpen,
    completedOvertimeModalIsOpen,
    responseApply,
    cancelResponse,
    removeEmployeeResponse,
    overtimeSummaryModalIsOpen,
    errorRemoveEmployee,
    errorAccomplishment,
    errorAuthorizationReport,
    errorAccomplishmentReport,
    errorOvertimeSummaryReport,
    overtimes,
    setOvertimeSummaryModalIsOpen,
    setPendingOvertimeModalIsOpen,
    setCompletedOvertimeModalIsOpen,
    setApplyOvertimeModalIsOpen,
    getEmployeeList,
    getEmployeeListSuccess,
    getEmployeeListFail,
    getOvertimeList,
    getOvertimeListSuccess,
    getOvertimeListFail,
    emptyResponseAndError,
    setSelectedMonth,
    setSelectedYear,
    setSelectedPeriod,
    setSelectedEmployeeType,
    setOvertimeDetails,
  } = useOvertimeStore((state) => ({
    removeEmployeeResponse: state.response.removeEmployeeResponse,
    errorRemoveEmployee: state.error.errorRemoveEmployee,
    tab: state.tab,
    applyOvertimeModalIsOpen: state.applyOvertimeModalIsOpen,
    pendingOvertimeModalIsOpen: state.pendingOvertimeModalIsOpen,
    completedOvertimeModalIsOpen: state.completedOvertimeModalIsOpen,
    responseApply: state.response.postResponseApply,
    cancelResponse: state.response.cancelResponse,
    overtimeSummaryModalIsOpen: state.overtimeSummaryModalIsOpen,
    errorAccomplishment: state.error.errorAccomplishment,
    errorAuthorizationReport: state.error.errorAuthorizationReport,
    errorAccomplishmentReport: state.error.errorAccomplishmentReport,
    errorOvertimeSummaryReport: state.error.errorOvertimeSummaryReport,
    overtimes: state.overtime.overtimes,
    setOvertimeSummaryModalIsOpen: state.setOvertimeSummaryModalIsOpen,
    setPendingOvertimeModalIsOpen: state.setPendingOvertimeModalIsOpen,
    setCompletedOvertimeModalIsOpen: state.setCompletedOvertimeModalIsOpen,
    setApplyOvertimeModalIsOpen: state.setApplyOvertimeModalIsOpen,
    getEmployeeList: state.getEmployeeList,
    getEmployeeListSuccess: state.getEmployeeListSuccess,
    getEmployeeListFail: state.getEmployeeListFail,
    getOvertimeList: state.getOvertimeList,
    getOvertimeListSuccess: state.getOvertimeListSuccess,
    getOvertimeListFail: state.getOvertimeListFail,
    emptyResponseAndError: state.emptyResponseAndError,
    setSelectedMonth: state.setSelectedMonth,
    setSelectedYear: state.setSelectedYear,
    setSelectedPeriod: state.setSelectedPeriod,
    setSelectedEmployeeType: state.setSelectedEmployeeType,
    setOvertimeDetails: state.setOvertimeDetails,
  }));

  const router = useRouter();

  const openApplyOvertimeModal = () => {
    if (!applyOvertimeModalIsOpen) {
      setApplyOvertimeModalIsOpen(true);
    }
  };

  const openOvertimeSummaryModal = () => {
    if (!overtimeSummaryModalIsOpen) {
      setOvertimeSummaryModalIsOpen(true);
      setSelectedMonth(null);
      setSelectedYear(null);
      setSelectedPeriod(null);
      setSelectedEmployeeType(null);
    }
  };

  // cancel action for Overtime Application Modal
  const closeOvertimeSummaryModal = async () => {
    setOvertimeSummaryModalIsOpen(false);
  };

  // cancel action for Overtime Application Modal
  const closeApplyOvertimeModal = async () => {
    setApplyOvertimeModalIsOpen(false);
  };

  // cancel action for Overtime Pending Modal
  const closePendingOvertimeModal = async () => {
    setPendingOvertimeModalIsOpen(false);
  };

  // cancel action for Overtime Completed Modal
  const closeCompletedOvertimeModal = async () => {
    setCompletedOvertimeModalIsOpen(false);
  };

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails]);

  const employeeListUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/supervisor/${employeeDetails.employmentDetails.userId}/employees/`;

  const {
    data: swrEmployeeList,
    isLoading: swrEmployeeListIsLoading,
    error: swrEmployeeListError,
    mutate: mutateEmployeeList,
  } = useSWR(employeeDetails.employmentDetails.userId ? employeeListUrl : null, fetchWithToken, {});

  // Initial zustand state update
  useEffect(() => {
    if (swrEmployeeListIsLoading) {
      getEmployeeList(swrEmployeeListIsLoading);
    }
  }, [swrEmployeeListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrEmployeeList)) {
      getEmployeeListSuccess(swrEmployeeListIsLoading, swrEmployeeList);
    }

    if (!isEmpty(swrEmployeeListError)) {
      getEmployeeListFail(swrEmployeeListIsLoading, swrEmployeeListError.message);
    }
  }, [swrEmployeeList, swrEmployeeListError]);

  const overtimeListUrl_overtimeSupervisor = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/${employeeDetails.employmentDetails.overtimeImmediateSupervisorId}`;
  const overtimeListUrl_manager = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/${employeeDetails.employmentDetails.userId}/list`;

  const {
    data: swrOvertimeList,
    isLoading: swrOvertimeListIsLoading,
    error: swrOvertimeListError,
    mutate: mutateOvertimeList,
  } = useSWR(
    employeeDetails.employmentDetails.overtimeImmediateSupervisorId
      ? overtimeListUrl_overtimeSupervisor
      : overtimeListUrl_manager,
    fetchWithToken,
    {}
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeListIsLoading) {
      getOvertimeList(swrOvertimeListIsLoading);
    }
  }, [swrOvertimeListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeList)) {
      getOvertimeListSuccess(swrOvertimeListIsLoading, swrOvertimeList);
    }

    if (!isEmpty(swrOvertimeListError)) {
      getOvertimeListFail(swrOvertimeListIsLoading, swrOvertimeListError.message);
    }
  }, [swrOvertimeList, swrOvertimeListError]);

  useEffect(() => {
    if (!isEmpty(responseApply) || !isEmpty(cancelResponse) || !isEmpty(removeEmployeeResponse)) {
      mutateOvertimeList();
      setTimeout(() => {
        emptyResponseAndError();
      }, 3000);
    }
  }, [responseApply, cancelResponse, removeEmployeeResponse]);

  // // Rendering of leave dates in row
  const renderRowEmployeeAvatar = (employee: Array<EmployeeOvertimeDetail>) => {
    if (employee.length <= 4) {
      return (
        <div className="flex flex-row gap-1 justify-start items-center">
          {employee.map((employees: EmployeeOvertimeDetail, idx: number) => (
            <Image
              key={idx}
              width={20}
              height={20}
              className="rounded-full border w-10"
              src={
                employees.avatarUrl ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + employees?.avatarUrl : TempPhotoProfile
              }
              alt={'photo'}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-row gap-1 justify-start items-center">
          <Image
            width={20}
            height={20}
            className="rounded-full border w-8"
            src={
              employee[0]?.avatarUrl
                ? process.env.NEXT_PUBLIC_IMAGE_SERVER_URL + employee[0]?.avatarUrl
                : TempPhotoProfile
            }
            alt={'photo'}
          />

          <label>{`+ ${employee.length - 1} more...`}</label>
        </div>
      );
    }
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: OvertimeDetails) => {
    setOvertimeDetails(rowData);
    if (rowData.status != OvertimeStatus.PENDING) {
      if (!completedOvertimeModalIsOpen) {
        setCompletedOvertimeModalIsOpen(true);
      }
    } else {
      // PENDING APPROVAL
      if (!pendingOvertimeModalIsOpen) {
        setPendingOvertimeModalIsOpen(true);
      }
    }
  };

  // Define table columns
  const columnHelper = createColumnHelper<OvertimeDetails>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('plannedDate', {
      header: 'Planned Date',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),

    columnHelper.accessor('immediateSupervisorName', {
      header: 'Requested By',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('estimatedHours', {
      header: 'Hours',
      filterFn: 'fuzzy',
      enableColumnFilter: false,
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      header: 'Employees',
      enableColumnFilter: true,
      cell: (props) => renderRowEmployeeAvatar(props.row.original.employees),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => UseRenderOvertimeStatus(info.getValue(), TextSize.TEXT_SM),
    }),
    // columnHelper.accessor('employees', {
    //   header: 'Accomplishments',
    //   enableColumnFilter: false,
    //   cell: (props) => RenderOvertimePendingAccomplishmentStatus(props.row.original.employees, TextSize.TEXT_SM),
    // }),
  ];

  // React Table initialization
  const { table } = useDataTable(
    {
      columns: columns,
      data: overtimes,
      columnVisibility: { id: false, employeeId: false },
    },
    ApprovalType.OVERTIME
  );

  return (
    <>
      {/* Remove Employee from OT */}
      {!isEmpty(removeEmployeeResponse) ? (
        <ToastNotification toastType="success" notifMessage={`Employee removal from Overtime Successful!`} />
      ) : null}

      {/* Remove Employee from OT */}
      {!isEmpty(errorRemoveEmployee) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorRemoveEmployee}: Failed to remove of Employee from Overtime!`}
        />
      ) : null}

      {/* Employee List Load Failed */}
      {!isEmpty(swrEmployeeListError) ? (
        <ToastNotification toastType="error" notifMessage={`${swrEmployeeListError}: Failed to load Employee List.`} />
      ) : null}

      {/* Post/Submit Overtime Application Success*/}
      {!isEmpty(responseApply) ? (
        <ToastNotification toastType="success" notifMessage="Overtime Application Successful!" />
      ) : null}

      {/* Cancel Overtime Application Success*/}
      {!isEmpty(cancelResponse) ? (
        <ToastNotification toastType="success" notifMessage="Overtime Application Cancellation Successful!" />
      ) : null}

      {/* Employee Individual Accomplishment Error*/}
      {!isEmpty(errorAccomplishment) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorAccomplishment}: Failed to load Overtime Accomplishment.`}
        />
      ) : null}

      {/* Employee Individual Accomplishment PDF Report Error*/}
      {!isEmpty(errorAccomplishmentReport) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorAccomplishmentReport}: Failed to load Overtime Accomplishment Report.`}
        />
      ) : null}

      {/* Employee OT Authorization PDF Report Error*/}
      {!isEmpty(errorAuthorizationReport) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorAuthorizationReport}: Failed to load Overtime Authorization Report.`}
        />
      ) : null}

      {/* Employee OT Summary PDF Report Error*/}
      {!isEmpty(errorOvertimeSummaryReport) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorOvertimeSummaryReport}: Failed to load Overtime Summary Report.`}
        />
      ) : null}

      {/* List of Overtime Load Failed */}
      {!isEmpty(swrOvertimeListError) ? (
        <ToastNotification toastType="error" notifMessage={`${swrOvertimeListError}: Failed to load Overtime List.`} />
      ) : null}

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Overtime</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        {/* Overtime Application Modal */}
        <OvertimeApplicationModal
          modalState={applyOvertimeModalIsOpen}
          setModalState={setApplyOvertimeModalIsOpen}
          closeModalAction={closeApplyOvertimeModal}
        />

        {/* Overtime Summary Modal */}
        <OvertimeSummaryModal
          modalState={overtimeSummaryModalIsOpen}
          setModalState={setOvertimeSummaryModalIsOpen}
          closeModalAction={closeOvertimeSummaryModal}
        />

        {/* Overtime Pending Modal */}
        <OvertimeModal
          modalState={pendingOvertimeModalIsOpen}
          setModalState={setPendingOvertimeModalIsOpen}
          closeModalAction={closePendingOvertimeModal}
        />

        {/* Overtime Completed Modal */}
        <OvertimeModal
          modalState={completedOvertimeModalIsOpen}
          setModalState={setCompletedOvertimeModalIsOpen}
          closeModalAction={closeCompletedOvertimeModal}
        />

        <MainContainer>
          <div className={`w-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader title="Employee Overtime" subtitle="Apply for overtime" backUrl={`/${router.query.id}`}>
              <div className="flex flex-row gap-2">
                <Button onClick={openOvertimeSummaryModal} className="hidden lg:block" size={`md`}>
                  <div className="flex items-center w-full gap-2">
                    <HiNewspaper /> Summary
                  </div>
                </Button>

                <Button onClick={openApplyOvertimeModal} className="hidden lg:block" size={`md`}>
                  <div className="flex items-center w-full gap-2">
                    <HiDocumentAdd /> Apply for Overtime
                  </div>
                </Button>

                <Button onClick={openOvertimeSummaryModal} className="block lg:hidden" size={`lg`}>
                  <div className="flex items-center w-full gap-2">
                    <HiNewspaper />
                  </div>
                </Button>

                <Button onClick={openApplyOvertimeModal} className="block lg:hidden" size={`lg`}>
                  <div className="flex items-center w-full gap-2">
                    <HiDocumentAdd />
                  </div>
                </Button>
              </div>
            </ContentHeader>
            {swrOvertimeListIsLoading ? (
              <div className="w-full h-96 static flex flex-col justify-center items-center place-items-center">
                <LoadingSpinner size={'lg'} />
              </div>
            ) : (
              <ContentBody>
                <div className="pb-10">
                  <DataTablePortal
                    onRowClick={(row) => renderRowActions(row.original as OvertimeDetails)}
                    textSize={'text-lg'}
                    model={table}
                    showGlobalFilter={true}
                    showColumnFilter={true}
                    paginate={true}
                  />
                </div>
              </ContentBody>
            )}
          </div>
        </MainContainer>
      </EmployeeProvider>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  // check if user role is not ot supervisor = kick out
  if (
    employeeDetails?.employmentDetails?.overtimeImmediateSupervisorId === null &&
    !isEqual(employeeDetails?.employmentDetails?.userRole, UserRole.DIVISION_MANAGER) &&
    !isEqual(employeeDetails?.employmentDetails?.userRole, UserRole.OIC_DIVISION_MANAGER)
  ) {
    // if true, the employee is not allowed to access this page
    return {
      redirect: {
        permanent: false,
        destination: `/${employeeDetails?.user?._id}`,
      },
    };
  } else {
    return { props: { employeeDetails } };
  }
});
