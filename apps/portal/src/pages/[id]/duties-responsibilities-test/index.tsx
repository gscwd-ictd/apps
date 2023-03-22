/* eslint-disable @nrwl/nx/enforce-module-boundaries */
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
    getFilledDrcPositions,
    getFilledDrcPositionsFail,
    getFilledDrcPositionsSuccess,
    getUnfilledDrcPositions,
    getUnfilledDrcPositionsFail,
    getUnfilledDrcPositionsSuccess,
  } = usePositionStore((state) => ({
    getFilledDrcPositions: state.getFilledDrcPositions,
    getFilledDrcPositionsSuccess: state.getFilledDrcPositionsSuccess,
    getFilledDrcPositionsFail: state.getFilledDrcPositionsFail,
    getUnfilledDrcPositions: state.getUnfilledDrcPositions,
    getUnfilledDrcPositionsSuccess: state.getUnfilledDrcPositionsSuccess,
    getUnfilledDrcPositionsFail: state.getUnfilledDrcPositionsFail,
  }));

  // use modal store
  const tab = usePositionStore((state) => state.tab);

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
        <div className="w-full h-full px-32">
          <ContentHeader
            title="Position Duties, Responsibilities, & Competencies"
            subtitle="Set or Update"
          >
            <Button onClick={openModal}>
              <div className="flex items-center w-full gap-2">
                <HiSearch /> Find Position
              </div>
            </Button>
          </ContentHeader>
          <ContentBody>
            <>
              <div className="flex w-full">
                <div className="w-[58rem]">
                  <DrcTabs />
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

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();

    return { props: { employeeDetails } };
  }
);
