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
import { employeeDummy } from '../../../../src/types/employee.type';
import 'react-toastify/dist/ReactToastify.css';
import { getUserDetails, withCookieSession } from '../../../../src/utils/helpers/session';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import { useTrainingSelectionStore } from 'apps/portal/src/store/training-selection.store';
import { TrainingTable } from 'apps/portal/src/components/fixed/training-selection/TrainingTable';
import { ToastNotification } from '@gscwd-apps/oneui';
import TrainingDetailsModal from 'apps/portal/src/components/fixed/training-selection/TrainingDetailsModal';
import TrainingNominationModal from 'apps/portal/src/components/fixed/training-selection/TrainingNominationModal';
import { useRouter } from 'next/router';

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
    loadingTrainingList,
    errorTrainingList,
    trainingModalIsOpen,
    setTrainingModalIsOpen,
    getTrainingSelectionList,
    getTrainingSelectionListSuccess,
    getTrainingSelectionListFail,
    trainingNominationModalIsOpen,
    setTrainingNominationModalIsOpen,
  } = useTrainingSelectionStore((state) => ({
    trainingList: state.trainingList,
    loadingTrainingList: state.loading.loadingTrainingList,
    errorTrainingList: state.error.errorTrainingList,
    trainingModalIsOpen: state.trainingModalIsOpen,
    setTrainingModalIsOpen: state.setTrainingModalIsOpen,
    getTrainingSelectionList: state.getTrainingSelectionList,
    getTrainingSelectionListSuccess: state.getTrainingSelectionListSuccess,
    getTrainingSelectionListFail: state.getTrainingSelectionListFail,
    trainingNominationModalIsOpen: state.trainingNominationModalIsOpen,
    setTrainingNominationModalIsOpen: state.setTrainingNominationModalIsOpen,
  }));

  const router = useRouter();

  const trainingUrl = `${process.env.NEXT_PUBLIC_LMS}api/lms/v1/training-details?lsp-type=individual`;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  const {
    data: swrTrainingList,
    isLoading: swrTrainingListIsLoading,
    error: swrTrainingListError,
    mutate: mutateTraining,
  } = useSWR(trainingUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  // Initial zustand state update
  useEffect(() => {
    if (swrTrainingListIsLoading) {
      getTrainingSelectionList(swrTrainingListIsLoading);
    }
  }, [swrTrainingListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrTrainingList)) {
      getTrainingSelectionListSuccess(swrTrainingListIsLoading, swrTrainingList.items);
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

  return (
    <>
      {/* Training List Load Failed */}
      {!isEmpty(errorTrainingList) ? (
        <>
          <ToastNotification toastType="error" notifMessage={`${errorTrainingList}: Failed to load Trainings.`} />
        </>
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
          <div className={`w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader
              title="Training Attendee Selection"
              subtitle="Select employees to attend training"
              backUrl={`/${router.query.id}`}
            ></ContentHeader>

            {loadingTrainingList ? (
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
                <SpinnerDotted
                  speed={70}
                  thickness={70}
                  className="flex w-full h-full transition-all "
                  color="slateblue"
                  size={100}
                />
              </div>
            ) : (
              <ContentBody>
                <div className="pb-10">
                  <TrainingTable employeeDetails={employeeDetails} />
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
