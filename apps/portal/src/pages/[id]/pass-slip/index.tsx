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
import { Button, Modal, ToastNotification } from '@gscwd-apps/oneui';
import { PassSlipTabs } from '../../../../src/components/fixed/passslip/PassSlipTabs';
import { PassSlipTabWindow } from '../../../../src/components/fixed/passslip/PassSlipTabWindow';
import { PassSlipModalController } from '../../../../src/components/fixed/passslip/PassSlipListController';
import { usePassSlipStore } from '../../../../src/store/passslip.store';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { employeeDummy } from '../../../../src/types/employee.type';
import {
  applyPassSlip,
  getEmployeePassSlips,
} from '../../../../src/utils/helpers/passslip-requests';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isEmpty } from 'lodash';
import { format } from 'date-fns';
import PassSlipApplicationModal from '../../../../src/components/fixed/passslip/PassSlipApplicationModal';

export default function PassSlip({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const {
    isGetPassSlipLoading,
    setIsGetPassSlipLoading,
    viewPassSlipModal,
    setViewPassSlipModal,
    applyPassSlipModalIsOpen,
    setApplyPassSlipModalIsOpen,
    pendingPassSlipList,
    setPendingPassSlipList,
    fulfilledPassSlipList,
    setFulfilledPassSlipList,
    tab,
    setTab,
    passSlipToSubmit,
    setEmployeeId,
    setDateOfApplication,
    setNatureOfBusiness,
    setEstimateHours,
    setPurposeDestination,
    setIsCancelled,
    setObTransportation,
  } = usePassSlipStore((state) => ({
    isGetPassSlipLoading: state.isGetPassSlipLoading,
    setIsGetPassSlipLoading: state.setIsGetPassSlipLoading,
    viewPassSlipModal: state.viewPassSlipModal,
    setViewPassSlipModal: state.setViewPassSlipModal,
    applyPassSlipModalIsOpen: state.applyPassSlipModalIsOpen,
    setApplyPassSlipModalIsOpen: state.setApplyPassSlipModalIsOpen,
    pendingPassSlipList: state.pendingPassSlipList,
    setPendingPassSlipList: state.setPendingPassSlipList,
    fulfilledPassSlipList: state.fulfilledPassSlipList,
    setFulfilledPassSlipList: state.setFulfilledPassSlipList,
    tab: state.tab,
    setTab: state.setTab,
    passSlipToSubmit: state.passSlipToSubmit,
    setEmployeeId: state.setEmployeeId,
    setDateOfApplication: state.setDateOfApplication,
    setNatureOfBusiness: state.setNatureOfBusiness,
    setEstimateHours: state.setEstimateHours,
    setPurposeDestination: state.setPurposeDestination,
    setIsCancelled: state.setIsCancelled,
    setObTransportation: state.setObTransportation,
  }));

  // // get state for the modal
  // const modal = usePassSlipStore((state) => state.modal);

  // // get loading state from store
  // const isLoading = usePassSlipStore((state) => state.isLoading);

  // const setAction = usePassSlipStore((state) => state.setAction);
  // const action = usePassSlipStore((state) => state.action);

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );

  // const [applicationSuccess, setApplicationSuccess] = useState<boolean>(false);
  const today = new Date();
  const dateToday = format(today, 'yyyy-MM-dd');

  // const [resetPassSlipList, setResetPassSlipList] = useState<boolean>(false);
  const passSlipList = usePassSlipStore((state) => state.passSlipList);

  // open the modal
  const openApplyPassSlipModal = () => {
    if (!applyPassSlipModalIsOpen) {
      setNatureOfBusiness('');
      setEstimateHours(1);
      setPurposeDestination('');
      setObTransportation('');
      setDateOfApplication(`${dateToday}`);
      setApplyPassSlipModalIsOpen(true);
    }
  };

  // cancel action for Pass Slip Application Modal
  const closeApplyPassSlipModal = async () => {
    setApplyPassSlipModalIsOpen(false);
    setIsGetPassSlipLoading(true);
  };

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
    setIsGetPassSlipLoading(true);
  }, [
    employeeDetails,
    passSlipList,
    setEmployeeDetails,
    isGetPassSlipLoading,
    setIsGetPassSlipLoading,
  ]);

  useEffect(() => {
    if (isGetPassSlipLoading) {
      setTimeout(() => {
        setIsGetPassSlipLoading(false);
      }, 500);
    }
  }, [isGetPassSlipLoading, setIsGetPassSlipLoading]);

  // modal action button
  const modalAction = async (e) => {
    // e.preventDefault();
    // if (action === 'Apply') {
    //   if (isEmpty(dateOfApplication)) {
    //     toast.error('Please enter date');
    //   } else if (isEmpty(natureOfBusiness)) {
    //     toast.error('Please select Nature of Business');
    //   } else if (
    //     isEmpty(estimateHours) &&
    //     natureOfBusiness != 'Undertime' &&
    //     natureOfBusiness != 'Half Day'
    //   ) {
    //     toast.error('Please enter number of hours');
    //   } else if (
    //     estimateHours <= 0 &&
    //     natureOfBusiness == 'Personal Business'
    //   ) {
    //     toast.error('Please enter a valid number of hours');
    //   } else if (
    //     estimateHours <= 0 &&
    //     natureOfBusiness == 'Official Business'
    //   ) {
    //     toast.error('Please enter a valid number of hours');
    //   } else if (isEmpty(purposeDestination)) {
    //     toast.error('Please enter purpose or destination');
    //   } else if (
    //     natureOfBusiness === 'Official Business' &&
    //     isEmpty(obTransportation)
    //   ) {
    //     toast.error('Please select mode of transportation');
    //   } else {
    //     const data = applyPassSlip(
    //       employeeDetail.employmentDetails.userId,
    //       dateOfApplication,
    //       natureOfBusiness,
    //       estimateHours,
    //       purposeDestination,
    //       obTransportation
    //     );
    //     if (data) {
    //       modalCancel();
    //       setApplicationSuccess(true);
    //     } else {
    //       console.log(data);
    //       toast.error('Error');
    //     }
    //   }
    // }
  };

  return (
    <>
      <>
        {/* <ToastContainer
          className={'uppercase text-xs'}
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        /> */}
        {/* {applicationSuccess ? (
          <ToastNotification
            toastType="success"
            notifMessage="Pass Slip Application Successful! Please wait for supervisor's decision on this application."
          />
        ) : null} */}

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
                          employeePassSlips={passSlipList}
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
