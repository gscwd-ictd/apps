import Head from 'next/head';
import { useEffect } from 'react';
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

import { SpinnerDotted } from 'spinners-react';
import { Button, Modal } from '@gscwd-apps/oneui';
import { PassSlipTabs } from '../../../../src/components/fixed/passslip/PassSlipTabs';
import { PassSlipTabWindow } from '../../../../src/components/fixed/passslip/PassSlipTabWindow';
import { PassSlipModalController } from '../../../../src/components/fixed/passslip/PassSlipListController';
import { usePassSlipStore } from '../../../../src/store/passslip.store';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { employeeDummy } from '../../../../src/types/employee.type';
import { applyPassSlip } from '../../../../src/utils/helpers/passslip-requests';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isEmpty } from 'lodash';

export default function PassSlip({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  // get state for the modal
  const modal = usePassSlipStore((state) => state.modal);

  // get loading state from store
  const isLoading = usePassSlipStore((state) => state.isLoading);

  // set tab state
  const tab = usePassSlipStore((state) => state.tab);

  // set loading state from store
  const setIsLoading = usePassSlipStore((state) => state.setIsLoading);

  // set state for the modal
  const setModal = usePassSlipStore((state) => state.setModal);

  const setAction = usePassSlipStore((state) => state.setAction);
  const action = usePassSlipStore((state) => state.action);

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );
  // set state for employee store
  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);
  const dateOfApplication = usePassSlipStore(
    (state) => state.dateOfApplication
  );
  const natureOfBusiness = usePassSlipStore((state) => state.natureOfBusiness);
  const estimateHours = usePassSlipStore((state) => state.estimateHours);
  const purposeDestination = usePassSlipStore(
    (state) => state.purposeDestination
  );
  const obTransportation = usePassSlipStore((state) => state.obTransportation);

  const setDateOfApplication = usePassSlipStore(
    (state) => state.setDateOfApplication
  );

  const setNatureOfBusiness = usePassSlipStore(
    (state) => state.setNatureOfBusiness
  );

  const setEstimateHours = usePassSlipStore((state) => state.setEstimateHours);

  const setPurposeDestination = usePassSlipStore(
    (state) => state.setPurposeDestination
  );

  const setObTransportation = usePassSlipStore(
    (state) => state.setObTransportation
  );

  // open the modal
  const openModal = () => {
    if (!modal.isOpen) {
      setAction('Apply');
      setModal({ ...modal, page: 1, isOpen: true });
      setNatureOfBusiness('');
      setEstimateHours(1);
      setPurposeDestination('');
      setObTransportation('');
      setDateOfApplication('');
    }
  };

  // cancel action for modal
  const modalCancel = async () => {
    setModal({ ...modal, isOpen: false });
    setIsLoading(true);
  };

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDetails);
    setIsLoading(true);
    console.log(employeeDetails);
  }, [employeeDetails, setEmployeeDetails, setIsLoading]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading, setIsLoading]);

  // modal action button
  const modalAction = async (e) => {
    e.preventDefault();
    if (action === 'Apply') {
      if (isEmpty(dateOfApplication)) {
        toast.error('Please enter date');
      } else if (isEmpty(natureOfBusiness)) {
        toast.error('Please select Nature of Business');
      } else if (isEmpty(estimateHours)) {
        toast.error('Please enter number of hours');
      } else if (
        estimateHours <= 0 &&
        natureOfBusiness == 'Personal Business'
      ) {
        toast.error('Please enter a valid number of hours');
      } else if (
        estimateHours <= 0 &&
        natureOfBusiness == 'Official Business'
      ) {
        toast.error('Please enter a valid number of hours');
      } else if (isEmpty(purposeDestination)) {
        toast.error('Please enter purpose or destination');
      } else if (
        natureOfBusiness === 'Official Business' &&
        isEmpty(obTransportation)
      ) {
        toast.error('Please select mode of transportation');
      } else {
        const data = applyPassSlip(
          employeeDetail.employmentDetails.userId,
          dateOfApplication,
          natureOfBusiness,
          estimateHours,
          purposeDestination,
          obTransportation
        );
        if (data) {
          modalCancel();
          toast.success('Pass Slip Application Successful!');

          console.log(data);
        } else {
          console.log(data);
          toast.error('Error');
        }
      }
    }
  };

  return (
    <>
      <>
        <ToastContainer
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
        />
        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Employee Pass Slips</title>
          </Head>

          <SideNav />

          <Modal size={'xl'} open={modal.isOpen} setOpen={openModal}>
            <Modal.Header>
              <h3 className="font-semibold text-2xl text-gray-700">
                <div className="px-5 flex justify-between">
                  <span>Pass Slip Authorization</span>
                  <button
                    className="hover:bg-slate-100 px-1 rounded-full"
                    onClick={modalCancel}
                  >
                    <HiX />
                  </button>
                </div>
              </h3>
            </Modal.Header>
            <Modal.Body>
              <form id="passSlipForm">
                <PassSlipModalController page={modal.page} />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-end gap-2">
                {/* <div className="flex flex-row">
                  <Button
                    variant={'primary'}
                    size={'md'}
                    loading={false}
                    onClick={modalCancel}
                    className="w-16"
                  >
                    {'Exit'}
                  </Button>
                </div> */}

                <div className="min-w-[6rem] max-w-auto">
                  <Button
                    variant={'primary'}
                    size={'md'}
                    loading={false}
                    className={`${modal.page != 3 ? '' : 'hidden'}`}
                    onClick={(e) => modalAction(e)}
                    form="passSlipForm"
                    type={`${modal.page == 1 ? 'submit' : 'button'}`}
                  >
                    {action}
                  </Button>

                  <Link
                    href={`/${router.query.id}/pass-slip/${employeeDetail.employmentDetails.userId}`}
                    target={'_blank'}
                    className={`${modal.page == 3 ? '' : 'hidden'}`}
                  >
                    <Button variant={'primary'} size={'md'} loading={false}>
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </Modal.Footer>
          </Modal>

          <MainContainer>
            <div className="w-full h-full px-32">
              <ContentHeader
                title="Employee Pass Slips"
                subtitle="Apply for pass slip"
              >
                <Button onClick={openModal}>
                  <div className="flex items-center w-full gap-2">
                    <HiDocumentAdd /> Apply Pass Slip
                  </div>
                </Button>
              </ContentHeader>
              {isLoading ? (
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
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const employeeDetails = employeeDummy;

  return { props: { employeeDetails } };
};

// export const getServerSideProps: GetServerSideProps = withSession(
//   async (context: GetServerSidePropsContext) => {
//     const employeeDetails = getUserDetails();

//     return { props: { employeeDetails } };
//   }
// );
