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
import { LeavesTabs } from '../../../components/fixed/leaves/LeavesTabs';
import { LeavesTabWindow } from '../../../components/fixed/leaves/LeavesTabWindow';
import { LeavesModalController } from '../../../components/fixed/leaves/LeavesListController';
import { Button, Modal } from '@gscwd-apps/oneui';
import { useLeaveStore } from '../../../../src/store/leave.store';
import { employeeDummy } from '../../../../src/types/employee.type';

export default function Leaves({
  employeeDetails,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // get state for the modal

  // set state for employee store
  const setEmployeeDetails = useEmployeeStore(
    (state) => state.setEmployeeDetails
  );

  // open the modal
  const openModal = () => {
    // if (!modal.isOpen) {
    //   setAction('Apply');
    //   setModal({ ...modal, page: 1, isOpen: true });
    // }
  };

  // // close the modal
  // const closeModal = () => {
  //   setModal({ ...modal, isOpen: false });
  //   setIsLoading(true);
  // };

  // // cancel action for modal
  const modalCancel = async () => {
    setModal({ ...modal, isOpen: false });
    setIsLoading(true);
  };

  // set the employee details on page load
  useEffect(() => {
    setEmployeeDetails(employeeDummy);
    setIsLoading(true);
  }, [setEmployeeDetails, setIsLoading]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading, setIsLoading]);

  return (
    <>
      <>
        <EmployeeProvider employeeData={employee}>
          <Head>
            <title>Employee Leaves</title>
          </Head>

          <SideNav />

          <Modal size={'xl'} open={modal.isOpen} setOpen={openModal}>
            <Modal.Header>
              <h3 className="font-semibold text-2xl text-gray-700">
                <div className="px-5 flex justify-between">
                  <span>Leave Applicattion</span>
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
              <LeavesModalController page={modal.page} />
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-end gap-2">
                <Button
                  variant={'primary'}
                  size={'md'}
                  loading={false}
                  onClick={modalCancel}
                >
                  {action}
                </Button>

                {/* <div className="min-w-[6rem] max-w-auto">
                  <Button variant={'primary'} size={'md'} loading={false}>
                    {'Apply'}
                  </Button>
                </div> */}
              </div>
            </Modal.Footer>
          </Modal>

          <MainContainer>
            <div className="w-full h-full px-32">
              <ContentHeader
                title="Employee Leaves"
                subtitle="Apply for company leave"
              >
                <Button onClick={openModal}>
                  <div className="flex items-center w-full gap-2">
                    <HiDocumentAdd /> Apply for Leave
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
                        <LeavesTabs tab={tab} />
                      </div>
                      <div className="w-full">
                        <LeavesTabWindow
                          employeeId={employeeDummy.employmentDetails.userId}
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
  const employeeDetails = getUserDetails();

  return { props: { employeeDummy } };
};
