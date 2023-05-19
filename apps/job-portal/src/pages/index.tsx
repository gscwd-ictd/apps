/* eslint-disable @nx/enforce-module-boundaries */
import {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import TopNavigation from '../components/page-header/TopNavigation';
import JobOpeningsTable from '../components/table/JobOpeningsTable';
import { FormModal } from '../components/modular/common/overlays/FormModal';
import { SpinnerCircularFixed } from 'spinners-react';
import { DataPrivacyAct } from '../components/fixed/data-privacy-act/DataPrivacyAct';
import { useJobOpeningsStore } from '../store/job-openings.store';
import { usePageStore } from '../store/page.store';
import { usePublicationStore } from '../store/publication.store';
import { ViewJobDetailsModal } from '../components/fixed/modals/ViewJobDetailsModal';
import { Publication } from 'apps/job-portal/utils/types/data/publication-type';

const Home: NextPage = ({
  jobOpenings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const isLoading = usePageStore((state) => state.isLoading);
  const { publication, setPublication } = usePublicationStore((state) => ({
    publication: state.publication,
    setPublication: state.setPublication,
  }));

  const setIsLoading = usePageStore((state) => state.setIsLoading);

  const {
    actionSelection,
    checkboxTerms,
    modal,
    setActionSelection,
    setCheckboxTerms,
    setModal,
    setPositionTab,
  } = useJobOpeningsStore((state) => ({
    modal: state.modal,
    checkboxTerms: state.checkboxTerms,
    actionSelection: state.actionSelection,
    setActionSelection: state.setActionSelection,
    setPositionTab: state.setPositionTab,
    setCheckboxTerms: state.setCheckboxTerms,
    setModal: state.setModal,
  }));

  const [openDetailsModal, setOpenDetailsModal] = useState<boolean>(false);

  const openModal = () => {
    setModal({ ...modal, page: 1, isOpen: true });
  };

  const onActionModal = () => {
    if (checkboxTerms) {
      setIsLoading(true);
      setTimeout(async () => {
        setIsLoading(false);
        localStorage.setItem('publication', JSON.stringify(publication));
        await router.push(
          `${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${publication.vppId}`
        );
        setModal({ ...modal, isOpen: false, page: 1 });
      }, 2000);
    }
  };

  const onCancelModal = () => {
    setModal({ ...modal, isOpen: false, page: 1 });
    setActionSelection('');
    setCheckboxTerms(false);
  };

  const onCloseModal = () => {
    setModal({ ...modal, isOpen: false, page: 1 });
    setActionSelection('');
    setCheckboxTerms(false);
  };

  const onCloseJobDetailsModal = () => {
    setPositionTab(0);
    setPublication({} as Publication);
    setActionSelection('');
    setOpenDetailsModal(false);
  };

  // removes the ssid_hrms cookie on page load
  const removeCookie = async () => {
    try {
      return await axios.post(
        `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (actionSelection === 'Position Details') setOpenDetailsModal(true);
  }, [actionSelection]);

  useEffect(() => {
    setCheckboxTerms(false);
    // localStorage.clear()
    // removeCookie();
  }, []);

  return (
    <div className="min-h-full">
      <TopNavigation />

      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            JOB OPENINGS
          </h1>
        </div>
      </header>

      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg h-96">
              <JobOpeningsTable jobOpenings={jobOpenings} />
            </div>
          </div>
        </div>
      </main>
      <section>
        <FormModal
          isOpen={modal.isOpen}
          setIsOpen={openModal}
          onAction={onActionModal}
          onCancel={onCancelModal}
          onClose={onCloseModal}
          modalSize="xxxxxxxl"
          title={'Data Privacy Act of 2012'}
          cancelBtnVariant="info"
          subtitle=""
          actionLabel={
            isLoading ? (
              <>
                <div className="flex justify-center w-full gap-2">
                  <SpinnerCircularFixed color="blue" size={20} />
                  <div>Processing...</div>
                </div>
              </>
            ) : (
              'Yes'
            )
          }
          cancelLabel="No"
          actionBtnClassName="min-w-[11rem]"
          cancelBtnClassName="w-[11rem]"
          disableActionBtn={checkboxTerms ? false : true}
          withActionBtn
          withCancelBtn
          withCloseBtn
        >
          <div className="h-auto">
            <DataPrivacyAct />
            <div className="mt-5"></div>
          </div>
        </FormModal>
      </section>
      <section>
        <ViewJobDetailsModal
          modalState={openDetailsModal}
          setModalState={setOpenDetailsModal}
          closeModalAction={onCloseJobDetailsModal}
        />
      </section>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/vacant-position-postings/publications/`
    );

    return {
      props: {
        jobOpenings: data,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
