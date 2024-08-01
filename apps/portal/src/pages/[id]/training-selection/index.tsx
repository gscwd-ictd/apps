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
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import { ToastNotification } from '@gscwd-apps/oneui';
import TrainingDetailsModal from 'apps/portal/src/components/fixed/training-selection/TrainingDetailsModal';
import { useRouter } from 'next/router';
import { DataTablePortal, useDataTable } from 'libs/oneui/src/components/Tables/DataTablePortal';
import { Training } from 'libs/utils/src/lib/types/training.type';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import UseRenderTrainingStatus from 'apps/portal/src/utils/functions/RenderTrainingStatus';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';
import { UserRole } from 'apps/portal/src/utils/enums/userRoles';
import UseRenderTrainingNominationStatus from 'apps/portal/src/utils/functions/RenderTrainingNominationStatus';
import { TrainingNominationStatus } from 'libs/utils/src/lib/enums/training.enum';
import { ApprovalType } from 'libs/utils/src/lib/enums/approval-type.enum';

export default function TrainingSelection({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { setEmployeeDetails } = useEmployeeStore((state) => ({
    setEmployeeDetails: state.setEmployeeDetails,
  }));

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails]);

  const {
    trainingList,
    errorTrainingList,
    trainingModalIsOpen,
    postResponseApply,
    errorResponse,
    setTrainingModalIsOpen,
    getTrainingSelectionList,
    getTrainingSelectionListSuccess,
    getTrainingSelectionListFail,
    setTrainingNominationModalIsOpen,
    setIndividualTrainingDetails,
    getEmployeeList,
    getEmployeeListSuccess,
    getEmployeeListFail,
    emptyResponseAndError,
  } = useTrainingSelectionStore((state) => ({
    trainingList: state.trainingList,
    errorTrainingList: state.error.errorTrainingList,
    trainingModalIsOpen: state.trainingModalIsOpen,
    postResponseApply: state.response.postResponseApply,
    errorResponse: state.error.errorResponse,
    setTrainingModalIsOpen: state.setTrainingModalIsOpen,
    getTrainingSelectionList: state.getTrainingSelectionList,
    getTrainingSelectionListSuccess: state.getTrainingSelectionListSuccess,
    getTrainingSelectionListFail: state.getTrainingSelectionListFail,
    setTrainingNominationModalIsOpen: state.setTrainingNominationModalIsOpen,
    setIndividualTrainingDetails: state.setIndividualTrainingDetails,
    getEmployeeList: state.getEmployeeList,
    getEmployeeListSuccess: state.getEmployeeListSuccess,
    getEmployeeListFail: state.getEmployeeListFail,
    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const router = useRouter();

  const employeeListUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/employees/supervisors/${employeeDetails.employmentDetails.userId}/subordinates/`;

  const {
    data: swrEmployeeList,
    isLoading: swrEmployeeListIsLoading,
    error: swrEmployeeListError,
    mutate: mutateEmployeeList,
  } = useSWR(employeeDetails.employmentDetails.userId ? employeeListUrl : null, fetchWithToken);

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

  const trainingUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/supervisors/${employeeDetails.employmentDetails.userId}`;

  const {
    data: swrTrainingList,
    isLoading: swrTrainingListIsLoading,
    error: swrTrainingListError,
    mutate: mutateTrainingList,
  } = useSWR(employeeDetails.employmentDetails.userId ? trainingUrl : null, fetchWithToken);

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

  const closeTrainingNominationModal = async () => {
    setTrainingNominationModalIsOpen(false);
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
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('trainingStart', {
      header: 'Start',
      // filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('trainingEnd', {
      header: 'End',
      enableColumnFilter: false,
      // filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('numberOfSlots', {
      header: 'Slots',
      enableColumnFilter: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Training Status',
      cell: (info) => UseRenderTrainingStatus(info.getValue(), TextSize.TEXT_SM),
    }),
    columnHelper.accessor('nominationStatus', {
      header: 'Nomination',
      cell: (info) => UseRenderTrainingNominationStatus(info.getValue(), TextSize.TEXT_SM),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable(
    {
      columns: columns,
      data: trainingList,
      columnVisibility: { id: false, employeeId: false },
    },
    ApprovalType.TRAINING_NOMINATION
  );

  useEffect(() => {
    if (!isEmpty(postResponseApply) || !isEmpty(errorTrainingList) || !isEmpty(errorResponse)) {
      mutateTrainingList();
      setTimeout(() => {
        emptyResponseAndError();
      }, 5000);
    }
  }, [postResponseApply, errorResponse, errorTrainingList]);

  return (
    <>
      {/* Employee List Load Failed */}
      {!isEmpty(swrEmployeeListError) ? (
        <>
          <ToastNotification
            toastType="error"
            notifMessage={`${swrEmployeeListError}: Failed to load Employee List.`}
          />
        </>
      ) : null}

      {/* Training List Load Failed */}
      {!isEmpty(errorTrainingList) ? (
        <>
          <ToastNotification toastType="error" notifMessage={`${errorTrainingList}: Failed to load Trainings.`} />
        </>
      ) : null}

      {/* Training List Load Failed */}
      {!isEmpty(postResponseApply) ? (
        <>
          <ToastNotification toastType="success" notifMessage={`Nominations submitted successfully.`} />
        </>
      ) : null}

      {/* failed to submit */}
      {!isEmpty(errorResponse) ? (
        <ToastNotification toastType="error" notifMessage={`${errorResponse}: Failed to Submit.`} />
      ) : null}

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Training Attendee Selection</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        <TrainingDetailsModal
          modalState={trainingModalIsOpen}
          setModalState={setTrainingModalIsOpen}
          closeModalAction={closeTrainingModal}
        />

        <MainContainer>
          <div className={`w-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader
              title="Training Attendee Selection"
              subtitle="Select employees to attend training"
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
  const employeeDetails = getUserDetails();

  // check if user role is rank_and_file or job order = kick out
  if (
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.RANK_AND_FILE) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.JOB_ORDER) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.COS) ||
    isEqual(employeeDetails.employmentDetails.userRole, UserRole.COS_JO)
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
