import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { HiDocumentAdd, HiX } from 'react-icons/hi';
import { SideNav } from '../../../components/fixed/nav/SideNav';
import { ContentBody } from '../../../components/modular/custom/containers/ContentBody';
import { ContentHeader } from '../../../components/modular/custom/containers/ContentHeader';
import { MainContainer } from '../../../components/modular/custom/containers/MainContainer';
import { EmployeeProvider } from '../../../context/EmployeeContext';
import { employee } from '../../../utils/constants/data';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next/types';
// import { getUserDetails, withSession } from '../../../utils/helpers/session';
import { getUserDetails, withSession } from '../../../utils/helpers/session';
import { useEmployeeStore } from '../../../store/employee.store';
import useSWR from 'swr';
import {
  fetchWithSession,
  fetchWithToken,
} from '../../../../src/utils/hoc/fetcher';
import { SpinnerDotted } from 'spinners-react';
import { Button } from '@gscwd-apps/oneui';
import { PassSlipTabs } from '../../../../src/components/fixed/passslip/PassSlipTabs';
import { PassSlipTabWindow } from '../../../../src/components/fixed/passslip/PassSlipTabWindow';
import { usePassSlipStore } from '../../../../src/store/passslip.store';
import React from 'react';
import { useRouter } from 'next/router';
import { employeeDummy } from '../../../../src/types/employee.type';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import PassSlipApplicationModal from '../../../../src/components/fixed/passslip/PassSlipApplicationModal';
import PassSlipPendingModal from '../../../../src/components/fixed/passslip/PassSlipPendingModal';
import PassSlipCompletedModal from '../../../../src/components/fixed/passslip/PassSlipCompletedModal';

export default function PassSlip({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const {
    tab,
    isGetPassSlipLoading,
    applyPassSlipModalIsOpen,
    pendingPassSlipModalIsOpen,
    completedPassSlipModalIsOpen,

    setTab,
    setIsGetPassSlipLoading,
    setApplyPassSlipModalIsOpen,
    setPendingPassSlipModalIsOpen,
    setCompletedPassSlipModalIsOpen,
  } = usePassSlipStore((state) => ({
    tab: state.tab,
    isGetPassSlipLoading: state.isGetPassSlipLoading,
    applyPassSlipModalIsOpen: state.applyPassSlipModalIsOpen,
    pendingPassSlipModalIsOpen: state.pendingPassSlipModalIsOpen,
    completedPassSlipModalIsOpen: state.completedPassSlipModalIsOpen,

    setTab: state.setTab,
    setIsGetPassSlipLoading: state.setIsGetPassSlipLoading,
    setApplyPassSlipModalIsOpen: state.setApplyPassSlipModalIsOpen,
    setPendingPassSlipModalIsOpen: state.setPendingPassSlipModalIsOpen,
    setCompletedPassSlipModalIsOpen: state.setCompletedPassSlipModalIsOpen,
  }));

  const { setEmployeeDetails } = useEmployeeStore((state) => ({
    setEmployeeDetails: state.setEmployeeDetails,
  }));

  // open the modal
  const openApplyPassSlipModal = () => {
    if (!applyPassSlipModalIsOpen) {
      setApplyPassSlipModalIsOpen(true);
    }
  };

  // cancel action for Pass Slip Application Modal
  const closeApplyPassSlipModal = async () => {
    setApplyPassSlipModalIsOpen(false);
    setIsGetPassSlipLoading(true);
  };

  // cancel action for Pass Slip Pending Modal
  const closePendingPassSlipModal = async () => {
    setPendingPassSlipModalIsOpen(false);
    setIsGetPassSlipLoading(true);
  };

  // cancel action for Pass Slip Completed Modal
  const closeCompletedPassSlipModal = async () => {
    setCompletedPassSlipModalIsOpen(false);
    setIsGetPassSlipLoading(true);
  };

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
    setIsGetPassSlipLoading(true);
  }, [employeeDetails]);

  useEffect(() => {
    if (isGetPassSlipLoading) {
      setTimeout(() => {
        setIsGetPassSlipLoading(false);
      }, 500);
    }
  }, [isGetPassSlipLoading]);

  return (
    <>
      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Employee Pass Slips</title>
        </Head>

        <SideNav />

        {/* Pass Slip Application Modal */}
        <PassSlipApplicationModal
          modalState={applyPassSlipModalIsOpen}
          setModalState={setApplyPassSlipModalIsOpen}
          closeModalAction={closeApplyPassSlipModal}
        />

        {/* Pass Slip Pending Modal */}
        <PassSlipPendingModal
          modalState={pendingPassSlipModalIsOpen}
          setModalState={setPendingPassSlipModalIsOpen}
          closeModalAction={closePendingPassSlipModal}
        />

        {/* Pass Slip Pending Modal */}
        <PassSlipCompletedModal
          modalState={completedPassSlipModalIsOpen}
          setModalState={setCompletedPassSlipModalIsOpen}
          closeModalAction={closeCompletedPassSlipModal}
        />

        <MainContainer>
          <div className="w-full h-full px-32">
            <ContentHeader
              title="Employee Pass Slips"
              subtitle="Apply for pass slip"
            >
              <Button onClick={openApplyPassSlipModal}>
                <div className="flex items-center w-full gap-2">
                  <HiDocumentAdd /> Apply Pass Slip
                </div>
              </Button>
            </ContentHeader>
            {isGetPassSlipLoading ? (
              <div className="w-full h-[90%]  static flex flex-col justify-items-center items-center place-items-center">
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
                <>
                  <div className="w-full flex">
                    <div className="w-[58rem]">
                      <PassSlipTabs tab={tab} />
                    </div>
                    <div className="w-full">
                      <PassSlipTabWindow
                        employeeId={employeeDetails.employmentDetails.userId}
                      />
                    </div>
                  </div>
                </>
              </ContentBody>
            )}
          </div>
        </MainContainer>
      </EmployeeProvider>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const employeeDetails = employeeDummy;

  // const employeePassSlips = await getEmployeePassSlips(
  //   employeeDetails.user._id
  // );
  return { props: { employeeDetails } };
};

// export const getServerSideProps: GetServerSideProps = withSession(
//   async (context: GetServerSidePropsContext) => {
//     const employeeDetails = getUserDetails();

//     return { props: { employeeDetails } };
//   }
// );
