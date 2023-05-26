/* eslint-disable @nx/enforce-module-boundaries */
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';

import { EmployeeDetails, employeeDummy } from '../../../types/employee.type';
import { User } from '../../../types/user.type';
import { PrfDetails } from '../../../types/prf.types';

import { Roles } from '../../../utils/constants/user-roles';

import { usePrfStore } from '../../../store/prf.store';
import { useUserStore } from '../../../store/user.store';

import {
  createPrf,
  getForApprovalPrfs,
  getPendingPrfs,
  savePrf,
} from '../../../utils/helpers/prf.requests';

import { PrfModal } from '../../../components/fixed/prf/prf-modal/PrfModal';
import { PendingPrfList } from '../../../components/fixed/prf/prf-index/PendingPrfList';
import { ForApprovalPrfList } from '../../../components/fixed/prf/prf-index/ForApprovalPrfList';
import { TabHeader } from '../../../components/fixed/prf/prf-index/TabHeader';
import { SideNav } from '../../../../src/components/fixed/nav/SideNav';
import { MainContainer } from '../../../../src/components/modular/custom/containers/MainContainer';
import { ContentHeader } from '../../../../src/components/modular/custom/containers/ContentHeader';
import { ContentBody } from '../../../../src/components/modular/custom/containers/ContentBody';
import { SpinnerDotted } from 'spinners-react';
import {
  getUserDetails,
  withCookieSession,
} from '../../../../src/utils/helpers/session';
import { useEmployeeStore } from '../../../../src/store/employee.store';
import { PageTitle } from '../../../components/modular/html/PageTitle';
import { Modal } from '../../../components/modular/overlays/Modal';
import { Button } from '@gscwd-apps/oneui';
import { HiDocumentAdd } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';

type PrfPageProps = {
  user: User;
  employee: EmployeeDetails;
  // profile: EmployeeProfile;
  pendingRequests: Array<PrfDetails>;
  forApproval: Array<any>;
};

export default function Prf({
  user,
  employee,
  // profile,
  pendingRequests,
  forApproval,
}: PrfPageProps) {
  // access modal-open state from store
  const isOpen = usePrfStore((state) => state.isModalOpen);

  // access modal page from store
  const modalPage = usePrfStore((state) => state.modalPage);

  const withExam = usePrfStore((state) => state.withExam);

  const selectedPositions = usePrfStore((state) => state.selectedPositions);

  const pendingPrfs = usePrfStore((state) => state.pendingPrfs);

  const forApprovalPrfs = usePrfStore((state) => state.forApprovalPrfs);

  const activeItem = usePrfStore((state) => state.activeItem);

  const setSelectedPositions = usePrfStore(
    (state) => state.setSelectedPositions
  );

  const setPendingPrfs = usePrfStore((state) => state.setPendingPrfs);

  const setForApprovalPrfs = usePrfStore((state) => state.setForApprovalPrfs);

  // access function to control with exam value
  const setWithExam = usePrfStore((state) => state.setWithExam);

  // access function to control modal page
  const setModalPage = usePrfStore((state) => state.setModalPage);

  // access function to set modal-open
  const setIsOpen = usePrfStore((state) => state.setIsModalOpen);

  // access function to set user state
  const setUser = useUserStore((state) => state.setUser);

  // access function to set employee state
  const setEmployee = useEmployeeStore((state) => state.setEmployeeDetails);
  const employeeDetail = useEmployeeStore((state) => state.employeeDetails);

  // get loading state from store
  const isLoading = usePrfStore((state) => state.isLoading);
  // set loading state from store
  const setIsLoading = usePrfStore((state) => state.setIsLoading);

  useEffect(() => {
    // update value of user
    setUser(user);

    // update value of employee
    setEmployee(employee);

    // update value of profile
    // setProfile(profile);

    setPendingPrfs(pendingRequests);

    setForApprovalPrfs(forApproval);

    setIsLoading(true);
  }, [employee]);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading, setIsLoading]);

  useEffect(() => console.log(forApprovalPrfs), [forApprovalPrfs]);

  const handleCancel = () => {
    // check if current modal page is the first page
    modalPage === 1 ? setIsOpen(false) : setModalPage(modalPage - 1);
  };

  const handleConfirm = async () => {
    // check if current modal page is 1
    if (modalPage === 1) setModalPage(modalPage + 1);

    // check if current modal page is greater than 1
    if (modalPage > 1) {
      // create a prf object
      const prf = createPrf(
        selectedPositions,
        withExam,
        employee.employmentDetails.userId
      );

      // save the newly created prf object in the database
      const { error, result } = await savePrf(prf);

      // check if there is no error
      if (!error) {
        // set pending prfs state
        setPendingPrfs([...pendingPrfs, result.prf.prfDetails]);

        setForApprovalPrfs([...forApprovalPrfs]);

        // close the modal
        setIsOpen(false);
      }
    }
  };

  const handleOpen = () => {
    // set modal page to default
    setModalPage(1);

    // revert value to default
    setWithExam(false);

    // set selected positions to default
    setSelectedPositions([]);

    // make the modal visible
    setIsOpen(true);
    // console.log(employeeDetail, 'employee store');
  };

  const { windowWidth } = UseWindowDimensions();

  return (
    <>
      <Modal
        title="Position Request"
        subtitle="Request for new personnel"
        isOpen={isOpen}
        size={`${windowWidth > 1300 ? 'xl' : 'full'}`}
        child={<PrfModal />}
        cancelLabel={modalPage === 1 ? 'Cancel' : 'Go Back'}
        confirmLabel={modalPage === 2 ? 'Confirm' : 'Proceed'}
        isConfirmDisabled={selectedPositions.length === 0 ? true : false}
        setIsOpen={setIsOpen}
        onClose={() => null}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />

      <PageTitle title="Position Request" />
      <SideNav />
      <MainContainer>
        <div className={`w-full h-full pl-4 pr-4 lg:pl-32 lg:pr-32`}>
          <ContentHeader
            title="Position Request"
            subtitle="Request for new personnel"
          >
            <Button
              className="hidden lg:block"
              size={`md`}
              onClick={handleOpen}
            >
              <div className="flex items-center w-full gap-2">
                <HiDocumentAdd /> Create Request
              </div>
            </Button>

            <Button
              className="block lg:hidden"
              size={`lg`}
              onClick={handleOpen}
            >
              <div className="flex items-center w-full gap-2">
                <HiDocumentAdd />
              </div>
            </Button>
          </ContentHeader>
          {isLoading ? (
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
                  <div className={`lg:w-[58rem] w-full md:w-[95%]`}>
                    <TabHeader />
                  </div>
                  <div className="w-full">
                    {activeItem === 0 && <PendingPrfList />}

                    {activeItem === 1 && <ForApprovalPrfList />}
                  </div>
                </div>
              </>
            </ContentBody>
          )}
        </div>
      </MainContainer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withCookieSession(
  async () => {
    const employee = getUserDetails();
    // const employee = employeeDummy;
    // get user details
    //const user = await getUserDetails(employee.userId);

    // get employee profile
    //const profile = await getEmployeeProfile(user._id);

    // get all pending prfs
    const pendingRequests = await getPendingPrfs(employee.user._id);

    // get all approved prfs
    const forApproval = await getForApprovalPrfs(employee.user._id);

    // check if user role is rank_and_file
    if (employee.employmentDetails.userRole === Roles.RANK_AND_FILE) {
      // if true, the employee is not allowed to access this page
      return {
        redirect: {
          permanent: false,
          destination: `/${employee.profile.firstName.toLowerCase()}.${employee.profile.lastName.toLowerCase()}`,
        },
      };
    }

    return {
      props: {
        user: employee.user,
        employee: employee,
        // profile: employee.profile,
        pendingRequests,
        forApproval,
      },
    };
  }
);

// export const getServerSideProps: GetServerSideProps = async () => {
//   return { props: { user, employee: employeeDetails, profile } };
// };
