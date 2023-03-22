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
import {
  getUserDetails,
  withCookieSession,
} from 'apps/portal/src/utils/helpers/session';
import Head from 'next/head';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
import { useEffect } from 'react';
import { HiSearch } from 'react-icons/hi';

export default function DutiesResponsibilities({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { openModal } = useModalStore((state) => ({
    openModal: state.openModal,
  }));

  const tab = usePositionStore((state) => state.tab);

  const setEmployee = useEmployeeStore((state) => state.setEmployeeDetails);

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
                  <DrcTabWindow
                    positionId={
                      employeeDetails.employmentDetails.assignment.positionId
                    }
                  />
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
