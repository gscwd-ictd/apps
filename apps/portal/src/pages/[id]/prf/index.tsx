/* eslint-disable @nx/enforce-module-boundaries */
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

import { EmployeeDetails, employeeDummy } from '../../../types/employee.type';
import { User } from '../../../types/user.type';
import { PrfDetails } from '../../../types/prf.types';

import { Roles } from '../../../utils/constants/user-roles';

import { usePrfStore } from '../../../store/prf.store';
import { useUserStore } from '../../../store/user.store';

import {
  createPrf,
  getDisapprovedPrfs,
  getForApprovalPrfs,
  getPendingPrfs,
  savePrf,
} from '../../../utils/helpers/prf.requests';

import { PrfModal } from '../../../components/fixed/prf/prf-modal/PrfModal';
import { PendingPrfList } from '../../../components/fixed/prf/prf-index/PendingPrfList';
import { ForApprovalPrfList } from '../../../components/fixed/prf/prf-index/ForApprovalPrfList';
import { TabHeader } from '../../../components/fixed/prf/prf-index/TabHeader';
import SideNav from '../../../../src/components/fixed/nav/SideNav';
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
import { Button, ToastNotification } from '@gscwd-apps/oneui';
import { HiDocumentAdd } from 'react-icons/hi';
import UseWindowDimensions from 'libs/utils/src/lib/functions/WindowDimensions';
import { NavButtonDetails } from 'apps/portal/src/types/nav.type';
import { UseNameInitials } from 'apps/portal/src/utils/hooks/useNameInitials';
import { DisapprovedPrfList } from 'apps/portal/src/components/fixed/prf/prf-index/DisapprovedPrfList';
import PendingPrfModal from 'apps/portal/src/components/fixed/prf/prf-modal/PendingPrfModal';
import { DisapprovedPrfModal } from 'apps/portal/src/components/fixed/prf/prf-modal/DisapprovedPrfModal';
import ForApprovalPrfModal from 'apps/portal/src/components/fixed/prf/prf-modal/ForApprovalPrfModal';
import useSWR from 'swr';
import { isEmpty } from 'lodash';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { useRouter } from 'next/router';

type PrfPageProps = {
  user: User;
  employee: EmployeeDetails;
};

export default function Prf({ user, employee }: PrfPageProps) {
  // access modal-open state from store
  const isOpen = usePrfStore((state) => state.isModalOpen);

  // access modal page from store
  const modalPage = usePrfStore((state) => state.modalPage);

  const withExam = usePrfStore((state) => state.withExam);

  const selectedPositions = usePrfStore((state) => state.selectedPositions);

  const pendingPrfs = usePrfStore((state) => state.pendingPrfs);

  const forApprovalPrfs = usePrfStore((state) => state.forApprovalPrfs);

  const disapprovedPrfs = usePrfStore((state) => state.disapprovedPrfs);

  const pendingPrfModalIsOpen = usePrfStore(
    (state) => state.pendingPrfModalIsOpen
  );
  const forApprovalPrfModalIsOpen = usePrfStore(
    (state) => state.forApprovalPrfModalIsOpen
  );
  const disapprovedPrfModalIsOpen = usePrfStore(
    (state) => state.disapprovedPrfModalIsOpen
  );
  const setPendingPrfModalIsOpen = usePrfStore(
    (state) => state.setPendingPrfModalIsOpen
  );
  const setForApprovalPrfModalIsOpen = usePrfStore(
    (state) => state.setForApprovalPrfModalIsOpen
  );
  const setDisapprovedPrfModalIsOpen = usePrfStore(
    (state) => state.setDisapprovedPrfModalIsOpen
  );

  const activeItem = usePrfStore((state) => state.activeItem);

  const setSelectedPositions = usePrfStore(
    (state) => state.setSelectedPositions
  );

  const setPendingPrfs = usePrfStore((state) => state.setPendingPrfs);

  const setForApprovalPrfs = usePrfStore((state) => state.setForApprovalPrfs);

  const setDisapprovedPrfs = usePrfStore((state) => state.setDisapprovedPrfs);

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

  const router = useRouter();
  const {
    patchResponse,
    patchError,
    getPrfDetailsForApprovalList,
    getPrfDetailsForApprovalListSuccess,
    getPrfDetailsForApprovalListFail,

    getPrfDetailsPendingList,
    getPrfDetailsPendingListSuccess,
    getPrfDetailsPendingListFail,

    getPrfDetailsDisapprovedList,
    getPrfDetailsDisapprovedListSuccess,
    getPrfDetailsDisapprovedListFail,

    emptyResponseAndError,
  } = usePrfStore((state) => ({
    patchResponse: state.response.patchResponse,
    patchError: state.errors.errorResponse,
    getPrfDetailsForApprovalList: state.getPrfDetailsForApprovalList,
    getPrfDetailsForApprovalListSuccess:
      state.getPrfDetailsForApprovalListSuccess,
    getPrfDetailsForApprovalListFail: state.getPrfDetailsForApprovalListFail,

    getPrfDetailsPendingList: state.getPrfDetailsPendingList,
    getPrfDetailsPendingListSuccess: state.getPrfDetailsPendingListSuccess,
    getPrfDetailsPendingListFail: state.getPrfDetailsPendingListFail,

    getPrfDetailsDisapprovedList: state.getPrfDetailsDisapprovedList,
    getPrfDetailsDisapprovedListSuccess:
      state.getPrfDetailsDisapprovedListSuccess,
    getPrfDetailsDisapprovedListFail: state.getPrfDetailsDisapprovedListFail,

    emptyResponseAndError: state.emptyResponseAndError,
  }));

  const prfUrl = process.env.NEXT_PUBLIC_HRIS_URL;
  // use useSWR, provide the URL and fetchWithSession function as a parameter

  //get pending prf detail list
  const {
    data: swrPendingPrfDetailsList,
    isLoading: swrPendingPrfListIsLoading,
    error: swrPendingPrfListError,
    mutate: mutatePendingPrfDetails,
  } = useSWR(
    `${prfUrl}/prf/${employee.user._id}?status=pending`,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
    }
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrPendingPrfListIsLoading) {
      getPrfDetailsPendingList(swrPendingPrfListIsLoading);
    }
  }, [swrPendingPrfListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrPendingPrfDetailsList)) {
      getPrfDetailsPendingListSuccess(
        swrPendingPrfListIsLoading,
        swrPendingPrfDetailsList
      );
    }

    if (!isEmpty(swrPendingPrfListError)) {
      getPrfDetailsPendingListFail(
        swrPendingPrfListIsLoading,
        swrPendingPrfListError.message
      );
    }
  }, [swrPendingPrfDetailsList, swrPendingPrfListError]);

  //get disapproved prf detail list
  const {
    data: swrDisapprovedPrfDetailsList,
    isLoading: swrDisapprovedPrfListIsLoading,
    error: swrDisapprovedPrfListError,
    mutate: mutateDisapprovedPrfDetails,
  } = useSWR(
    `${prfUrl}/prf/${employee.user._id}?status=disapproved`,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
    }
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrDisapprovedPrfListIsLoading) {
      getPrfDetailsDisapprovedList(swrDisapprovedPrfListIsLoading);
    }
  }, [swrDisapprovedPrfListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrDisapprovedPrfDetailsList)) {
      getPrfDetailsDisapprovedListSuccess(
        swrDisapprovedPrfListIsLoading,
        swrDisapprovedPrfDetailsList
      );
    }

    if (!isEmpty(swrDisapprovedPrfListError)) {
      getPrfDetailsDisapprovedListFail(
        swrDisapprovedPrfListIsLoading,
        swrDisapprovedPrfListError.message
      );
    }
  }, [swrDisapprovedPrfDetailsList, swrDisapprovedPrfListError]);

  //get for approval prf detail list
  const {
    data: swrForApprovalPrfDetailsList,
    isLoading: swrForApprovalPrfListIsLoading,
    error: swrForApprovalPrfListError,
    mutate: mutateForApprovalPrfDetails,
  } = useSWR(
    `${prfUrl}/prf-trail/employee/${employee.user._id}`,
    fetchWithToken,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: true,
    }
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrForApprovalPrfListIsLoading) {
      getPrfDetailsForApprovalList(swrForApprovalPrfListIsLoading);
    }
  }, [swrForApprovalPrfListIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrForApprovalPrfDetailsList)) {
      getPrfDetailsForApprovalListSuccess(
        swrForApprovalPrfListIsLoading,
        swrForApprovalPrfDetailsList
      );
    }

    if (!isEmpty(swrForApprovalPrfListError)) {
      getPrfDetailsForApprovalListFail(
        swrForApprovalPrfListIsLoading,
        swrForApprovalPrfListError.message
      );
    }
  }, [swrForApprovalPrfDetailsList, swrForApprovalPrfListError]);

  useEffect(() => {
    if (!isEmpty(patchResponse)) {
      mutateForApprovalPrfDetails();
      mutatePendingPrfDetails();
      mutateDisapprovedPrfDetails();
      setTimeout(() => {
        emptyResponseAndError();
      }, 500);
      if (swrForApprovalPrfDetailsList.length <= 1) {
        setTimeout(() => {
          router.reload();
        }, 2000);
      }
    }
  }, [patchResponse]);

  useEffect(() => {
    // update value of user
    setUser(user);

    // update value of employee
    setEmployee(employee);

    // update value of profile
    // setProfile(profile);

    setIsLoading(true);
  }, [employee]);

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
  };

  const { windowWidth } = UseWindowDimensions();

  const [navDetails, setNavDetails] = useState<NavButtonDetails>();

  useEffect(() => {
    setNavDetails({
      profile: user.email,
      fullName: `${employee.profile.firstName} ${employee.profile.lastName}`,
      initials: UseNameInitials(
        employee.profile.firstName,
        employee.profile.lastName
      ),
    });
  }, []);

  const closePendingPrfModal = async () => {
    setPendingPrfModalIsOpen(false);
  };
  const closeForApprovalPrfModal = async () => {
    setForApprovalPrfModalIsOpen(false);
  };
  const closeDisapprovedPrfModal = async () => {
    setDisapprovedPrfModalIsOpen(false);
  };

  return (
    <>
      {/* Disapprove PRF Success */}
      {!isEmpty(patchResponse) ? (
        <ToastNotification
          toastType="success"
          notifMessage={`PRF Action Submitted.`}
        />
      ) : null}

      {/* Disapprove PRF Failed Error */}
      {!isEmpty(patchError) ? (
        <ToastNotification toastType="error" notifMessage={`${patchError}`} />
      ) : null}

      {/* Pending PRF Modal */}
      <PendingPrfModal
        modalState={pendingPrfModalIsOpen}
        setModalState={setPendingPrfModalIsOpen}
        closeModalAction={closePendingPrfModal}
      />

      {/* Disapproved PRF Modal */}
      <DisapprovedPrfModal
        modalState={disapprovedPrfModalIsOpen}
        setModalState={setDisapprovedPrfModalIsOpen}
        closeModalAction={closeDisapprovedPrfModal}
      />

      {/* For Approval PRF Modal */}
      <ForApprovalPrfModal
        modalState={forApprovalPrfModalIsOpen}
        setModalState={setForApprovalPrfModalIsOpen}
        closeModalAction={closeForApprovalPrfModal}
      />

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
      <SideNav navDetails={navDetails} />
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
          {swrForApprovalPrfListIsLoading &&
          swrDisapprovedPrfListIsLoading &&
          swrPendingPrfListIsLoading ? (
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
                    <TabHeader />
                  </div>
                  <div className="w-full">
                    {activeItem === 0 && <PendingPrfList />}

                    {activeItem === 1 && <ForApprovalPrfList />}

                    {activeItem === 2 && <DisapprovedPrfList />}
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

    // check if user role is rank_and_file
    if (
      employee.employmentDetails.userRole === Roles.RANK_AND_FILE ||
      employee.employmentDetails.userRole === Roles.JOB_ORDER
    ) {
      // if true, the employee is not allowed to access this page
      return {
        redirect: {
          permanent: false,
          destination: `/${employee.user._id}`,
        },
      };
    }

    return {
      props: {
        user: employee.user,
        employee: employee,
      },
    };
  }
);
