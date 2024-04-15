import Head from 'next/head';
import { useEffect } from 'react';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import { SpinnerDotted } from 'spinners-react';
import { ToastNotification, fuzzySort, useDataTable } from '@gscwd-apps/oneui';
import { DataTablePortal } from 'libs/oneui/src/components/Tables/DataTablePortal';
import React from 'react';
import { useApprovalStore } from '../../../store/approvals.store';
import useSWR from 'swr';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import dayjs from 'dayjs';
import { createColumnHelper } from '@tanstack/react-table';
import { EmployeeOvertimeDetail, OvertimeDetails } from 'libs/utils/src/lib/types/overtime.type';
import ApprovalsOvertimeModal from 'apps/portal/src/components/fixed/manager-approvals/ApprovalsOvertimeModal';
import { OvertimeStatus } from 'libs/utils/src/lib/enums/overtime.enum';
import { useRouter } from 'next/router';
import UseRenderOvertimeStatus from 'apps/portal/src/utils/functions/RenderOvertimeStatus';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import TempPhotoProfile from '../.../../../../../public/profile.jpg';
import Image from 'next/image';
import RenderOvertimePendingAccomplishmentStatus from 'apps/portal/src/utils/functions/RenderOvertimePendingAccomplishmentStatus';

export default function OvertimeApprovals({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    pendingOvertimeModalIsOpen,
    approvedOvertimeModalIsOpen,
    disapprovedOvertimeModalIsOpen,

    patchResponseOvertime,
    patchResponseAccomplishment,
    errorOvertime,
    errorOvertimeResponse,
    errorAccomplishment,
    errorAccomplishmentResponse,
    overtimeApplications,

    setPendingOvertimeModalIsOpen,
    setApprovedOvertimeModalIsOpen,
    setDisapprovedOvertimeModalIsOpen,

    getOvertimeApplicationsList,
    getOvertimeApplicationsListSuccess,
    getOvertimeApplicationsListFail,

    setSelectedOvertimeId,

    emptyResponseAndError,
  } = useApprovalStore((state) => ({
    tab: state.tab,
    pendingOvertimeModalIsOpen: state.pendingOvertimeModalIsOpen,
    approvedOvertimeModalIsOpen: state.approvedOvertimeModalIsOpen,
    disapprovedOvertimeModalIsOpen: state.disapprovedOvertimeModalIsOpen,

    patchResponseOvertime: state.response.patchResponseOvertime,
    patchResponseAccomplishment: state.response.patchResponseAccomplishment,

    errorOvertime: state.error.errorOvertime,
    errorOvertimeResponse: state.error.errorOvertimeResponse,
    errorAccomplishment: state.error.errorAccomplishment,
    errorAccomplishmentResponse: state.error.errorAccomplishmentResponse,
    overtimeApplications: state.overtimeApplications,

    setPendingOvertimeModalIsOpen: state.setPendingOvertimeModalIsOpen,
    setApprovedOvertimeModalIsOpen: state.setApprovedOvertimeModalIsOpen,
    setDisapprovedOvertimeModalIsOpen: state.setDisapprovedOvertimeModalIsOpen,

    getOvertimeApplicationsList: state.getOvertimeApplicationsList,
    getOvertimeApplicationsListSuccess: state.getOvertimeApplicationsListSuccess,
    getOvertimeApplicationsListFail: state.getOvertimeApplicationsListFail,
    emptyResponseAndError: state.emptyResponseAndError,

    setSelectedOvertimeId: state.setSelectedOvertimeId,
  }));

  const router = useRouter();

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);
  // set state for employee store
  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails, setEmployeeDetails]);

  // cancel action for Pending Overtime Application Modal
  const closePendingOvertimeModal = async () => {
    setPendingOvertimeModalIsOpen(false);
  };

  // cancel action for Approved Overtime Application Modal
  const closeApprovedOvertimeModal = async () => {
    setApprovedOvertimeModalIsOpen(false);
  };

  // cancel action for Approved Overtime Application Modal
  const closeDisapprovedOvertimeModal = async () => {
    setDisapprovedOvertimeModalIsOpen(false);
  };

  const overtimeListUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/overtime/${employeeDetails.employmentDetails.userId}/approval`;

  const {
    data: swrOvertimeList,
    isLoading: swrOvertimeListIsLoading,
    error: swrOvertimeListError,
    mutate: mutateOvertime,
  } = useSWR(employeeDetails.employmentDetails.userId ? overtimeListUrl : null, fetchWithToken);

  // Initial zustand state update
  useEffect(() => {
    if (swrOvertimeListIsLoading) {
      getOvertimeApplicationsList(swrOvertimeListIsLoading);
    }
  }, [swrOvertimeListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrOvertimeList)) {
      getOvertimeApplicationsListSuccess(swrOvertimeListIsLoading, swrOvertimeList);
    }

    if (!isEmpty(swrOvertimeListError)) {
      getOvertimeApplicationsListFail(swrOvertimeListIsLoading, swrOvertimeListError.message);
    }
  }, [swrOvertimeList, swrOvertimeListError]);

  useEffect(() => {
    if (!isEmpty(patchResponseOvertime)) {
      mutateOvertime();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [patchResponseOvertime]);

  useEffect(() => {
    if (!pendingOvertimeModalIsOpen) {
      setSelectedOvertimeId(''); //reset selected OT ID for OT modal content
    }
  }, [pendingOvertimeModalIsOpen]);

  // // Rendering of leave dates in row
  const renderRowEmployeeAvatar = (employee: Array<EmployeeOvertimeDetail>) => {
    if (employee.length <= 4) {
      return (
        <div className="flex flex-row gap-1 justify-start items-center">
          {employee.map((employees: EmployeeOvertimeDetail) => (
            <div key={employees.employeeId}>
              <Image
                width={20}
                height={20}
                className="rounded-full border w-8"
                src={employees.avatarUrl ? employees.avatarUrl : TempPhotoProfile}
                alt={'photo'}
              />
              {/* <img
                className="rounded-full border w-8"
                src={employees.avatarUrl ? employees.avatarUrl : TempPhotoProfile}
                alt={'photo'}
              ></img> */}
            </div>
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
            src={employee[0].avatarUrl ? employee[0].avatarUrl : TempPhotoProfile}
            alt={'photo'}
          />
          {/* <img
            className="rounded-full border w-8"
            src={employee[0].avatarUrl ? employee[0].avatarUrl : TempPhotoProfile}
            alt={'photo'}
          ></img> */}
          <label>{`+ ${employee.length - 1} more...`}</label>
        </div>
      );
    }
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: OvertimeDetails) => {
    setSelectedOvertimeId(rowData.id);

    if (rowData.status == OvertimeStatus.APPROVED) {
      if (!approvedOvertimeModalIsOpen) {
        setApprovedOvertimeModalIsOpen(true);
      }
    } else if (rowData.status == OvertimeStatus.PENDING) {
      // PENDING APPROVAL
      if (!pendingOvertimeModalIsOpen) {
        setPendingOvertimeModalIsOpen(true);
      }
    } else if (rowData.status == OvertimeStatus.DISAPPROVED || rowData.status == OvertimeStatus.CANCELLED) {
      // DISAPPROVED
      if (!disapprovedOvertimeModalIsOpen) {
        setDisapprovedOvertimeModalIsOpen(true);
      }
    } else {
      //nothing
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
      // filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('immediateSupervisorName', {
      header: 'Supervisor',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('employees', {
      header: 'Employees',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (props) => renderRowEmployeeAvatar(props.row.original.employees),
    }),
    // columnHelper.display({
    //   id: 'employees',
    //   header: 'Employees',
    //   enableColumnFilter: false,
    //   cell: (props) => renderRowEmployeeAvatar(props.row.original.employees),
    // }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => UseRenderOvertimeStatus(info.getValue(), TextSize.TEXT_SM),
    }),
    columnHelper.accessor('employees', {
      header: 'Accomplishments',
      cell: (props) => RenderOvertimePendingAccomplishmentStatus(props.row.original.employees, TextSize.TEXT_SM),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: overtimeApplications,
    columnVisibility: { id: false, employeeId: false },
  });

  return (
    <>
      {/* Overtime Approval Patch Success */}
      {!isEmpty(patchResponseOvertime) ? (
        <ToastNotification toastType="success" notifMessage={`Overtime Application action submitted.`} />
      ) : null}
      {/* OT Accomplishment Approval Patch Success */}
      {!isEmpty(patchResponseAccomplishment) ? (
        <ToastNotification toastType="success" notifMessage={`Overtime Accomplishment Report action submitted.`} />
      ) : null}
      {/* Overtime Patch Failed Error */}
      {!isEmpty(errorOvertimeResponse) ? (
        <ToastNotification toastType="error" notifMessage={`Overtime Application action failed.`} />
      ) : null}
      {/* OT AccomplishmentReport Approval Patch Failed Error */}
      {!isEmpty(errorAccomplishmentResponse) ? (
        <ToastNotification toastType="error" notifMessage={`Overtime Accomplishment Report action failed.`} />
      ) : null}
      {/* Overtime List Load Failed Error */}
      {!isEmpty(errorOvertime) ? (
        <ToastNotification toastType="error" notifMessage={`${errorOvertime}: Failed to load Overtime List.`} />
      ) : null}
      {/* Overtime Accomplishment Data Load Failed Error */}
      {!isEmpty(errorAccomplishment) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`${errorAccomplishment}: Failed to load Overtime Accomplishment Report.`}
        />
      ) : null}

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Overtime Approvals</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        <MainContainer>
          <div className="w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32">
            <ContentHeader
              title="Employee Overtime Approvals"
              subtitle="Approve or Disapprove Employee Overtimes"
              backUrl={`/${router.query.id}/manager-approvals`}
            ></ContentHeader>

            {swrOvertimeListIsLoading ? (
              <div className="w-full h-96 static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="w-full flex h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            ) : (
              <ContentBody>
                <div>
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

      {/* Pending Overtime Approval Modal */}
      <ApprovalsOvertimeModal
        modalState={pendingOvertimeModalIsOpen}
        setModalState={setPendingOvertimeModalIsOpen}
        closeModalAction={closePendingOvertimeModal}
      />

      {/* Approved Overtime Approval Modal */}
      <ApprovalsOvertimeModal
        modalState={approvedOvertimeModalIsOpen}
        setModalState={setApprovedOvertimeModalIsOpen}
        closeModalAction={closeApprovedOvertimeModal}
      />

      {/* Disapproved Overtime Approval Modal */}
      <ApprovalsOvertimeModal
        modalState={disapprovedOvertimeModalIsOpen}
        setModalState={setDisapprovedOvertimeModalIsOpen}
        closeModalAction={closeDisapprovedOvertimeModal}
      />
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const employeeDetails = employeeDummy;

//   return { props: { employeeDetails } };
// };

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  // check if user role is rank_and_file or job order = kick out
  if (
    employeeDetails.employmentDetails.userRole === UserRole.RANK_AND_FILE ||
    employeeDetails.employmentDetails.userRole === UserRole.JOB_ORDER
  ) {
    // if true, the employee is not allowed to access this page
    return {
      redirect: {
        permanent: false,
        destination: `/${employeeDetails.user._id}`,
      },
    };
  } else {
    return { props: { employeeDetails } };
  }
});
