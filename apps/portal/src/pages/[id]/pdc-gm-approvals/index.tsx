/* eslint-disable @nx/enforce-module-boundaries */
import Head from 'next/head';
import { useEffect } from 'react';
import SideNav from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/types';
import { useEmployeeStore } from '../../../store/employee.store';
import useSWR from 'swr';
import { SpinnerDotted } from 'spinners-react';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty, isEqual } from 'lodash';
import { usePdcApprovalsStore } from 'apps/portal/src/store/pdc-approvals.store';
import { ToastNotification, fuzzySort } from '@gscwd-apps/oneui';
import { useRouter } from 'next/router';
import { DataTablePortal, useDataTable } from 'libs/oneui/src/components/Tables/DataTablePortal';
import { Training } from 'libs/utils/src/lib/types/training.type';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import UseRenderTrainingStatus from 'apps/portal/src/utils/functions/RenderTrainingStatus';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import TrainingDetailsModal from 'apps/portal/src/components/fixed/pdc-approvals/TrainingDetailsModal';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import { ApprovalType } from 'libs/utils/src/lib/enums/approval-type.enum';

export default function PdcGeneralManagerApprovals({
  userDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { employeeDetails, setEmployeeDetails } = useEmployeeStore((state) => ({
    employeeDetails: state.employeeDetails,
    setEmployeeDetails: state.setEmployeeDetails,
  }));

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(userDetails);
  }, [userDetails]);

  const {
    trainingList,
    errorTrainingList,
    trainingModalIsOpen,
    patchResponseApply,
    errorResponse,
    setTrainingModalIsOpen,
    getTrainingSelectionList,
    getTrainingSelectionListSuccess,
    getTrainingSelectionListFail,
    setIndividualTrainingDetails,
    emptyResponseAndError,
  } = usePdcApprovalsStore((state) => ({
    trainingList: state.trainingList,
    loadingTrainingList: state.loading.loadingTrainingList,
    errorTrainingList: state.error.errorTrainingList,
    trainingModalIsOpen: state.trainingModalIsOpen,
    patchResponseApply: state.response.patchResponseApply,
    errorResponse: state.error.errorResponse,
    setTrainingModalIsOpen: state.setTrainingModalIsOpen,
    getTrainingSelectionList: state.getTrainingSelectionList,
    getTrainingSelectionListSuccess: state.getTrainingSelectionListSuccess,
    getTrainingSelectionListFail: state.getTrainingSelectionListFail,
    setIndividualTrainingDetails: state.setIndividualTrainingDetails,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const router = useRouter();

  const trainingGeneralManagerUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/approval/gm`;

  const {
    data: swrTrainingList,
    isLoading: swrTrainingListIsLoading,
    error: swrTrainingListError,
    mutate: mutateTrainingList,
  } = useSWR(trainingGeneralManagerUrl, fetchWithToken, {});

  // Initial zustand state update
  useEffect(() => {
    if (swrTrainingListIsLoading) {
      getTrainingSelectionList(swrTrainingListIsLoading);
    }
  }, [swrTrainingListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrTrainingList)) {
      getTrainingSelectionListSuccess(swrTrainingListIsLoading, swrTrainingList);
    }

    if (!isEmpty(swrTrainingListError)) {
      getTrainingSelectionListFail(swrTrainingListIsLoading, swrTrainingListError.message);
    }
  }, [swrTrainingList, swrTrainingListError]);

  const closeTrainingModal = async () => {
    setTrainingModalIsOpen(false);
  };

  // Render row actions in the table component
  const renderRowActions = (rowData: Training) => {
    setIndividualTrainingDetails(rowData);
    setTrainingModalIsOpen(true);
  };

  // Define table columns
  const columnHelper = createColumnHelper<Training>();
  const columns = [
    columnHelper.accessor('courseTitle', {
      header: 'Course Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('source', {
      header: 'Source',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('trainingStart', {
      header: 'Start',
      enableColumnFilter: false,
      // filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('trainingEnd', {
      header: 'End',
      enableColumnFilter: false,
      // filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('numberOfHours', {
      header: 'Hours',
      enableColumnFilter: false,
      // filterFn: 'equalsString',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('numberOfParticipants', {
      header: 'Participants',
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => UseRenderTrainingStatus(info.getValue(), TextSize.TEXT_SM),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable(
    {
      columns: columns,
      data: trainingList,
      columnVisibility: { id: false, employeeId: false },
    },
    ApprovalType.PDC_GM
  );

  useEffect(() => {
    if (!isEmpty(patchResponseApply) || !isEmpty(errorTrainingList) || !isEmpty(errorResponse)) {
      mutateTrainingList();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [patchResponseApply, errorResponse, errorTrainingList]);

  return (
    <>
      {/* Training List Load Failed */}
      {!isEmpty(errorTrainingList) ? (
        <ToastNotification toastType="error" notifMessage={`${errorTrainingList}: Failed to load Trainings.`} />
      ) : null}

      {/* Training List Load Failed */}
      {!isEmpty(patchResponseApply) ? (
        <ToastNotification toastType="success" notifMessage={`Training Action submitted successfully.`} />
      ) : null}

      {/* failed to submit */}
      {!isEmpty(errorResponse) ? (
        <ToastNotification toastType="error" notifMessage={`${errorResponse}: Failed to Submit.`} />
      ) : null}

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>General Manager Training Approvals</title>
        </Head>

        <SideNav employeeDetails={userDetails} />

        <TrainingDetailsModal
          modalState={trainingModalIsOpen}
          setModalState={setTrainingModalIsOpen}
          closeModalAction={closeTrainingModal}
        />

        <MainContainer>
          <div className={`w-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader
              title="General Manager Training Approvals"
              subtitle="Final approve or disapprove Trainings"
              backUrl={`/${router.query.id}`}
            ></ContentHeader>

            {swrTrainingListIsLoading ? (
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
                <div className="pb-10">
                  <DataTablePortal
                    onRowClick={(row) => renderRowActions(row.original as Training)}
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
  const userDetails = getUserDetails();

  // check if user role is rank_and_file or job order = kick out
  if (
    !isEqual(userDetails.employmentDetails.userRole, UserRole.GENERAL_MANAGER) &&
    !isEqual(userDetails.employmentDetails.userRole, UserRole.OIC_GENERAL_MANAGER)
  ) {
    // if true, the employee is not allowed to access this page
    return {
      redirect: {
        permanent: false,
        destination: `/${userDetails.user._id}`,
      },
    };
  } else {
    return { props: { userDetails } };
  }
});
