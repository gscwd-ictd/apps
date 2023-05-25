/* eslint-disable @nx/enforce-module-boundaries */
import { Button } from '@gscwd-apps/oneui';
import { DrcAlertConfirmation } from 'apps/portal/src/components/fixed/dr/alert/DrcAlertConfirmation';
import { DrcAlertSuccess } from 'apps/portal/src/components/fixed/dr/alert/DrcAlertSuccess';
import DrcModal from 'apps/portal/src/components/fixed/dr/modal/DrcModal';
import { DrcTabs } from 'apps/portal/src/components/fixed/dr/tab/DrcTabs';
import { DrcTabWindow } from 'apps/portal/src/components/fixed/dr/tab/DrcTabWindow';
import { SideNav } from 'apps/portal/src/components/fixed/nav/SideNav';
import { ContentBody } from 'apps/portal/src/components/modular/custom/containers/ContentBody';
import { ContentHeader } from 'apps/portal/src/components/modular/custom/containers/ContentHeader';
import { MainContainer } from 'apps/portal/src/components/modular/custom/containers/MainContainer';
import { useEmployeeStore } from 'apps/portal/src/store/employee.store';
import { useModalStore } from 'apps/portal/src/store/modal.store';
import { usePositionStore } from 'apps/portal/src/store/position.store';
import { employeeDummy } from 'apps/portal/src/types/employee.type';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import {
  getUserDetails,
  withCookieSession,
} from 'apps/portal/src/utils/helpers/session';
import { isEmpty } from 'lodash';
import Head from 'next/head';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';
import useSWR from 'swr';

export default function DutiesResponsibilities({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { openModal } = useModalStore((state) => ({
    openModal: state.openModal,
  }));

  const setEmployee = useEmployeeStore((state) => state.setEmployeeDetails);

  const {
    data: swrUnfilledPositions,
    isLoading: swrUnfilledIsLoading,
    error: swrUnfilledError,
  } = useSWR(
    `/occupational-group-duties-responsibilities/${employeeDetails.employmentDetails.assignment.positionId}/pending`,
    fetcherHRIS
  );

  const {
    data: swrFilledPositions,
    isLoading: swrFilledIsLoading,
    error: swrFilledError,
  } = useSWR(
    `/occupational-group-duties-responsibilities/${employeeDetails.employmentDetails.assignment.positionId}/finished`,
    fetcherHRIS
  );

  // use position store
  const {
    filledPositions,
    unfilledPositions,
    getFilledDrcPositions,
    getFilledDrcPositionsFail,
    getFilledDrcPositionsSuccess,
    getUnfilledDrcPositions,
    getUnfilledDrcPositionsFail,
    getUnfilledDrcPositionsSuccess,
  } = usePositionStore((state) => ({
    unfilledPositions: state.unfilledPositions,
    filledPositions: state.filledPositions,
    getFilledDrcPositions: state.getFilledDrcPositions,
    getFilledDrcPositionsSuccess: state.getFilledDrcPositionsSuccess,
    getFilledDrcPositionsFail: state.getFilledDrcPositionsFail,
    getUnfilledDrcPositions: state.getUnfilledDrcPositions,
    getUnfilledDrcPositionsSuccess: state.getUnfilledDrcPositionsSuccess,
    getUnfilledDrcPositionsFail: state.getUnfilledDrcPositionsFail,
  }));

  // initialize unfilled loading
  useEffect(() => {
    if (swrUnfilledIsLoading) {
      getUnfilledDrcPositions(swrUnfilledIsLoading);
    }
  }, [swrUnfilledIsLoading]);

  // initialize filled loading
  useEffect(() => {
    if (swrFilledIsLoading) {
      getFilledDrcPositions(swrFilledIsLoading);
    }
  }, [swrFilledIsLoading]);

  // unfilled positions set
  useEffect(() => {
    if (!isEmpty(swrUnfilledPositions)) {
      getUnfilledDrcPositionsSuccess(swrUnfilledPositions.data);
    }
    if (!isEmpty(swrUnfilledError)) {
      getUnfilledDrcPositionsFail(swrUnfilledError);
    }
  }, [swrUnfilledError, swrUnfilledPositions]);

  // filled positions set
  useEffect(() => {
    if (!isEmpty(swrFilledPositions)) {
      getFilledDrcPositionsSuccess(swrFilledPositions.data);
    }

    if (!isEmpty(swrFilledError)) {
      getFilledDrcPositionsFail(swrFilledError);
    }
  }, [swrFilledError, swrFilledPositions]);

  // set employee store
  useEffect(() => {
    setEmployee(employeeDetails);
  }, []);

  return (
    <>
      <Head>
        <title>Setup Duties and Responsibilities</title>
      </Head>

      <SideNav />

      <DrcModal />

      <DrcAlertConfirmation />

      <DrcAlertSuccess />

      <MainContainer>
        <div
          className={`w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32 '
            `}
        >
          <ContentHeader
            title="Position Duties, Responsibilities, & Competencies"
            subtitle="Set or Update"
          >
            <Button onClick={openModal} className="hidden lg:block" size={`md`}>
              <div className="flex items-center w-full gap-2">
                <HiSearch /> Find Position
              </div>
            </Button>

            <Button onClick={openModal} className="block lg:hidden" size={`lg`}>
              <div className="flex items-center w-full gap-2">
                <HiSearch />
              </div>
            </Button>
          </ContentHeader>
          <ContentBody>
            <>
              <div className={`w-full flex lg:flex-row flex-col`}>
                <div className={`lg:w-[58rem] w-full`}>
                  <DrcTabs
                    positions={{
                      unfilled: unfilledPositions,
                      filled: filledPositions,
                    }}
                  />
                </div>
                <div className="w-full">
                  <DrcTabWindow />
                </div>
              </div>
            </>
          </ContentBody>
        </div>
      </MainContainer>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const employeeDetails = employeeDummy;

//   return { props: { employeeDetails } };
// };

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();

    return { props: { employeeDetails } };
  }
);
