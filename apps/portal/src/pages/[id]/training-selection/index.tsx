/* eslint-disable @nx/enforce-module-boundaries */
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { HiDocumentAdd } from 'react-icons/hi';
import SideNav from '../../../components/fixed/nav/SideNav';
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
import { useEmployeeStore } from '../../../store/employee.store';
import useSWR from 'swr';
import { SpinnerDotted } from 'spinners-react';
import { Button, ToastNotification } from '@gscwd-apps/oneui';
import { PassSlipTabs } from '../../../../src/components/fixed/passslip/PassSlipTabs';
import { PassSlipTabWindow } from '../../../../src/components/fixed/passslip/PassSlipTabWindow';
import { usePassSlipStore } from '../../../../src/store/passslip.store';
import React from 'react';
import { employeeDummy } from '../../../../src/types/employee.type';
import 'react-toastify/dist/ReactToastify.css';
import PassSlipApplicationModal from '../../../../src/components/fixed/passslip/PassSlipApplicationModal';
import PassSlipPendingModal from '../../../../src/components/fixed/passslip/PassSlipPendingModal';
import PassSlipCompletedModal from '../../../../src/components/fixed/passslip/PassSlipCompletedModal';
import { isEmpty } from 'lodash';
import { fetchWithToken } from '../../../../src/utils/hoc/fetcher';
import {
  getUserDetails,
  withCookieSession,
} from '../../../../src/utils/helpers/session';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';

export default function PassSlip({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { setEmployeeDetails } = useEmployeeStore((state) => ({
    setEmployeeDetails: state.setEmployeeDetails,
  }));

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
  }, [employeeDetails]);

  return (
    <>
      <EmployeeProvider employeeData={employee}>
        <Head>
          <title>Training Attendee Selection</title>
        </Head>

        <SideNav employeeDetails={employeeDetails} />

        <MainContainer>
          <div className={`w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
            <ContentHeader
              title="Training Attendee Selection"
              subtitle="Select employees to attend training"
            ></ContentHeader>

            {!employeeDetails ? (
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
                <>
                  <div className={`w-full flex lg:flex-row flex-col`}>
                    <div className={`lg:w-[58rem] w-full`}>
                      <PassSlipTabs tab={1} />
                    </div>
                    <div className="w-full">
                      <PassSlipTabWindow />
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
