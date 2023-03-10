import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { Button } from '../../../components/modular/forms/buttons/Button';
import { PageTitle } from '../../../components/modular/html/PageTitle';
import { Modal } from '../../../components/modular/overlays/Modal';
import {
  EmployeeDetailsPrf,
  EmployeeProfile,
} from '../../../types/employee.type';
import { User } from '../../../types/user.type';
import { Roles } from '../../../utils/constants/user-roles';
import { usePrfStore } from '../../../store/prf.store';
import { useEmployeeStore } from '../../../store/employee-prf.store';
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
import { PrfDetails } from '../../../types/prf.types';
import { SideNav } from '../../../../src/components/fixed/nav/SideNav';
import { MainContainer } from '../../../../src/components/modular/custom/containers/MainContainer';
import { ContentHeader } from '../../../../src/components/modular/custom/containers/ContentHeader';
import { ContentBody } from '../../../../src/components/modular/custom/containers/ContentBody';
import { SpinnerDotted } from 'spinners-react';
import {
  withCookieSession,
  getUserDetails,
} from '../../../../src/utils/helpers/session';

type PrfPageProps = {
  user: User;
  employee: EmployeeDetailsPrf;
  profile: EmployeeProfile;
  pendingRequests: Array<PrfDetails>;
  forApproval: Array<any>;
};

export default function Prf({
  user,
  employee,
  profile,
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
  const setEmployee = useEmployeeStore((state) => state.setEmployee);

  // acacess function to set profile state
  const setProfile = useEmployeeStore((state) => state.setProfile);

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
    setProfile(profile);

    setPendingPrfs(pendingRequests);

    setForApprovalPrfs(forApproval);

    setIsLoading(true);
  }, []);

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
      const prf = createPrf(selectedPositions, withExam, employee.userId);

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
  };

  return (
    <>
      <Modal
        title="Position Request"
        subtitle="Request for new personnel"
        isOpen={isOpen}
        size="xl"
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
        <div className="w-full h-full px-32">
          <ContentHeader
            title="Position Request"
            subtitle="Request for new personnel"
          >
            <Button
              btnLabel="Create Request"
              shadow
              strong
              onClick={handleOpen}
            />
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
                <div className="flex w-full">
                  <div className="w-[58rem]">
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
        employee: employee.employmentDetails,
        profile: employee.profile,
        pendingRequests,
        forApproval,
      },
    };
  }
);

// export const getServerSideProps: GetServerSideProps = async () => {
//   return { props: { user, employee: employeeDetails, profile } };
// };
