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
import { LoadingSpinner, ToastNotification, fuzzySort } from '@gscwd-apps/oneui';
import React from 'react';
import { useApprovalStore } from '../../../store/approvals.store';
import useSWR from 'swr';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import dayjs from 'dayjs';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTablePortal, useDataTable } from 'libs/oneui/src/components/Tables/DataTablePortal';
import { useRouter } from 'next/router';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import { DtrCorrection } from 'libs/utils/src/lib/types/dtr.type';
import UseRenderDtrCorrectionStatus from 'apps/portal/src/utils/functions/RenderDtrCorrectionStatus';
import ApprovalsDtrCorrectionModal from 'apps/portal/src/components/fixed/manager-approvals/ApprovalsDtrCorrectionModal';
import { SalaryGradeConverter } from 'libs/utils/src/lib/functions/SalaryGradeConverter';
import { ApprovalType } from 'libs/utils/src/lib/enums/approval-type.enum';

export default function PassSlipApprovals({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    dtrCorrectionModalIsOpen,
    patchResponseDtrCorrection,
    errorDtrCorrection,
    errorDtrCorrectionResponse,
    dtrCorrectionApplications,
    setDtrCorrectionModalIsOpen,
    getDtrCorrectionApplicationsList,
    getDtrCorrectionApplicationsListSuccess,
    getDtrCorrectionApplicationsListFail,
    setDtrCorrectionDetail,
    emptyResponseAndError,
  } = useApprovalStore((state) => ({
    dtrCorrectionModalIsOpen: state.dtrCorrectionModalIsOpen,
    patchResponseDtrCorrection: state.response.patchResponseDtrCorrection,
    errorDtrCorrection: state.error.errorDtrCorrection,
    errorDtrCorrectionResponse: state.error.errorDtrCorrectionResponse,
    dtrCorrectionApplications: state.dtrCorrectionApplications,
    setDtrCorrectionModalIsOpen: state.setDtrCorrectionModalIsOpen,
    getDtrCorrectionApplicationsList: state.getDtrCorrectionApplicationsList,
    getDtrCorrectionApplicationsListSuccess: state.getDtrCorrectionApplicationsListSuccess,
    getDtrCorrectionApplicationsListFail: state.getDtrCorrectionApplicationsListFail,
    setDtrCorrectionDetail: state.setDtrCorrectionDetail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const router = useRouter();

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails, setEmployeeDetails]);

  // cancel action for DTR Correction Details Modal
  const closeDtrCorrectionModal = async () => {
    setDtrCorrectionModalIsOpen(false);
  };

  const dtrCorrectionUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/dtr-corrections/`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrDtrCorrection,
    isLoading: swrDtrCorrectionIsLoading,
    error: swrDtrCorrectionError,
    mutate: mutateDtrCorrection,
  } = useSWR(dtrCorrectionUrl, fetchWithToken, {});

  // Initial zustand state update
  useEffect(() => {
    if (swrDtrCorrectionIsLoading) {
      getDtrCorrectionApplicationsList(swrDtrCorrectionIsLoading);
    }
  }, [swrDtrCorrectionIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrDtrCorrection)) {
      getDtrCorrectionApplicationsListSuccess(swrDtrCorrectionIsLoading, swrDtrCorrection);
    }

    if (!isEmpty(swrDtrCorrectionError)) {
      getDtrCorrectionApplicationsListFail(swrDtrCorrectionIsLoading, swrDtrCorrectionError.message);
    }
  }, [swrDtrCorrection, swrDtrCorrectionError]);

  useEffect(() => {
    if (!isEmpty(patchResponseDtrCorrection)) {
      mutateDtrCorrection();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [patchResponseDtrCorrection]);

  // Render row actions in the table component
  const renderRowActions = (rowData: DtrCorrection) => {
    setDtrCorrectionDetail(rowData);
    if (rowData.status) {
      if (!dtrCorrectionModalIsOpen) {
        setDtrCorrectionModalIsOpen(true);
      }
    }
  };

  // Define table columns
  const columnHelper = createColumnHelper<DtrCorrection>();
  const columns = [
    columnHelper.accessor('id', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dtrDate', {
      header: 'Date to Correct',
      // filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('employeeFullName', {
      header: 'Employee Name',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dtrTimeIn', {
      header: 'Time In',
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dtrLunchOut', {
      header: 'Lunch Out',
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dtrLunchIn', {
      header: 'Lunch In',
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dtrTimeOut', {
      header: 'Time Out',
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => UseRenderDtrCorrectionStatus(info.getValue(), TextSize.TEXT_SM),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable(
    {
      columns: columns,
      data: dtrCorrectionApplications,
      columnVisibility: {
        id: false,
        employeeId: false,
        // dtrTimeIn: false,
        // dtrLunchOut: false,
        // dtrLunchIn: false,
        // dtrTimeOut: false,
      },
    },
    ApprovalType.DTRCORRECTION
  );

  return (
    <>
      <>
        {/* DTR Correction Approval Patch Success */}
        {!isEmpty(patchResponseDtrCorrection) ? (
          <ToastNotification toastType="success" notifMessage={`DTR Correction action submitted.`} />
        ) : null}
        {/* DTR Correction Patch Failed Error */}
        {!isEmpty(errorDtrCorrectionResponse) ? (
          <ToastNotification toastType="error" notifMessage={`DTR Correction action failed.`} />
        ) : null}
        {/* DTR Correction List Load Failed Error */}
        {!isEmpty(errorDtrCorrection) ? (
          <ToastNotification
            toastType="error"
            notifMessage={`${errorDtrCorrection}: Failed to load DTR Correction List.`}
          />
        ) : null}

        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Time Log Correction Approvals</title>
          </Head>

          <SideNav employeeDetails={employeeDetails} />

          {/* DTR Correction Approval Modal */}
          <ApprovalsDtrCorrectionModal
            modalState={dtrCorrectionModalIsOpen}
            setModalState={setDtrCorrectionModalIsOpen}
            closeModalAction={closeDtrCorrectionModal}
          />

          <MainContainer>
            <div className="w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32">
              <ContentHeader
                title="Employee Time Log Correction Approvals"
                subtitle="Approve or Disapprove Employee Time Log Corrections"
                backUrl={`/${router.query.id}/manager-approvals`}
              ></ContentHeader>

              {swrDtrCorrectionIsLoading ? (
                <div className="w-full h-96 static flex flex-col justify-center items-center place-items-center">
                  <LoadingSpinner size={'lg'} />
                  {/* <SpinnerDotted
                    speed={70}
                    thickness={70}
                    className="w-full flex h-full transition-all "
                    color="slateblue"
                    size={100}
                  /> */}
                </div>
              ) : (
                <ContentBody>
                  <div>
                    <DataTablePortal
                      onRowClick={(row) => renderRowActions(row.original as DtrCorrection)}
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
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  //convert salary grade to number
  // const finalSalaryGrade = SalaryGradeConverter(employeeDetails.employmentDetails.salaryGrade);

  // check if user role is rank_and_file or job order = kick out
  if (
    employeeDetails.employmentDetails.userRole === UserRole.RANK_AND_FILE ||
    employeeDetails.employmentDetails.userRole === UserRole.JOB_ORDER ||
    employeeDetails.employmentDetails.userRole === UserRole.COS ||
    employeeDetails.employmentDetails.userRole === UserRole.COS_JO
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
