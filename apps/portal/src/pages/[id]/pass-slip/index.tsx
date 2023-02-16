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

  // open the modal
  const openModal = () => {
    if (!modal.isOpen) {
      setAction('Apply');
      setModal({ ...modal, page: 1, isOpen: true });
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

  //modal action button
  // const modalAction = () => (
  //   <PDFViewer>
  //     {/* <PassSlipPdf /> */}
  //   </PDFViewer>
  // );

  return (
    <>
      <>
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
              <PassSlipModalController page={modal.page} />
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

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const employeeDetails = getUserDetails();

    return { props: { employeeDetails } };
  }
);
