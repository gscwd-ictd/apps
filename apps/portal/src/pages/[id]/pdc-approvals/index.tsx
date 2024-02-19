/* eslint-disable @nx/enforce-module-boundaries */
import Head from 'next/head';
import { useEffect, useState } from 'react';
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
import { employeeDummy } from '../../../types/employee.type';
import 'react-toastify/dist/ReactToastify.css';
import { getUserDetails, withCookieSession } from '../../../utils/helpers/session';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { usePdcApprovalsStore } from 'apps/portal/src/store/pdc-approvals.store';
import { TrainingTable } from 'apps/portal/src/components/fixed/training-selection/TrainingTable';
import { ToastNotification, fuzzySort, useDataTable } from '@gscwd-apps/oneui';
import TrainingDetailsModal from 'apps/portal/src/components/fixed/training-selection/TrainingDetailsModal';
import TrainingNominationModal from 'apps/portal/src/components/fixed/training-selection/TrainingNominationModal';
import { useRouter } from 'next/router';
import { DataTablePortal } from 'libs/oneui/src/components/Tables/DataTablePortal';
import { Training } from 'libs/utils/src/lib/types/training.type';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import UseRenderPassSlipStatus from 'apps/portal/src/utils/functions/RenderPassSlipStatus';
import UseRenderTrainingStatus from 'apps/portal/src/utils/functions/RenderTrainingStatus';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';

export default function PdcApprovals({ employeeDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { setEmployeeDetails } = useEmployeeStore((state) => ({
    setEmployeeDetails: state.setEmployeeDetails,
  }));

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails]);

  const {
    trainingList,
    loadingTrainingList,
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
  } = usePdcApprovalsStore((state) => ({
    trainingList: state.trainingList,
    loadingTrainingList: state.loading.loadingTrainingList,
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

  // const employeeListUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/employees/supervisors/${employeeDetails.employmentDetails.userId}/subordinates/`;

  // const {
  //   data: swrEmployeeList,
  //   isLoading: swrEmployeeListIsLoading,
  //   error: swrEmployeeListError,
  //   mutate: mutateEmployeeList,
  // } = useSWR(employeeDetails.employmentDetails.userId ? employeeListUrl : null, fetchWithToken);

  // // Initial zustand state update
  // useEffect(() => {
  //   if (swrEmployeeListIsLoading) {
  //     getEmployeeList(swrEmployeeListIsLoading);
  //   }
  // }, [swrEmployeeListIsLoading]);

  // // Upon success/fail of swr request, zustand state will be updated
  // useEffect(() => {
  //   if (!isEmpty(swrEmployeeList)) {
  //     getEmployeeListSuccess(swrEmployeeListIsLoading, swrEmployeeList);
  //   }

  //   if (!isEmpty(swrEmployeeListError)) {
  //     getEmployeeListFail(swrEmployeeListIsLoading, swrEmployeeListError.message);
  //   }
  // }, [swrEmployeeList, swrEmployeeListError]);

  const trainingSecretariatUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/approval/secretariat`;
  const trainingChairmanUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/trainings/approval/chairman`;

  const {
    data: swrTrainingList,
    isLoading: swrTrainingListIsLoading,
    error: swrTrainingListError,
    mutate: mutateTrainingList,
  } = useSWR(trainingSecretariatUrl, fetchWithToken);

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
    columnHelper.accessor('location', {
      header: 'Location',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('trainingStart', {
      header: 'Start',
      filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('trainingEnd', {
      header: 'End',
      filterFn: 'equalsString',
      cell: (info) => dayjs(info.getValue()).format('MMMM DD, YYYY'),
    }),
    columnHelper.accessor('numberOfSlots', {
      header: 'Slots',
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('trainingPreparationStatus', {
      header: 'Status',
      cell: (info) => UseRenderTrainingStatus(info.getValue(), TextSize.TEXT_SM),
    }),
  ];

  // React Table initialization
  const { table } = useDataTable({
    columns: columns,
    data: trainingList,
    columnVisibility: { id: false, employeeId: false },
  });

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
      {/* Training List Load Failed */}
      {!isEmpty(errorTrainingList) ? (
        <>
          <ToastNotification toastType="error" notifMessage={`${errorTrainingList}: Failed to load Trainings.`} />
        </>
      ) : null}

      {/* Training List Load Failed */}
      {!isEmpty(postResponseApply) ? (
        <>
          <ToastNotification toastType="success" notifMessage={`Training Action submitted successfully.`} />
        </>
      ) : null}

      {/* failed to submit */}
      {!isEmpty(errorResponse) ? (
        <ToastNotification toastType="error" notifMessage={`${errorResponse}: Failed to Submit.`} />
      ) : null}

      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Personnel Development Comittee Approvals</title>
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
              title="Personnel Development Comittee Approvals"
              subtitle="Approve or disapprove Trainings"
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
                    showColumnFilter={false}
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

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const employeeDetails = employeeDummy;

//   return { props: { employeeDetails } };
// };

export const getServerSideProps: GetServerSideProps = withCookieSession(async (context: GetServerSidePropsContext) => {
  const employeeDetails = getUserDetails();

  return { props: { employeeDetails } };
});
