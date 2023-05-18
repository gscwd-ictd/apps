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
import { SpinnerCircularFixed, SpinnerDotted } from 'spinners-react';
import { DataPrivacyAct } from '../components/fixed/data-privacy-act/DataPrivacyAct';
import { useJobOpeningsStore } from '../store/job-openings.store';
import { usePageStore } from '../store/page.store';
import { usePublicationStore } from '../store/publication.store';
import { Modal } from '@gscwd-apps/oneui';
import { ViewJobDetailsModal } from '../components/fixed/modals/ViewJobDetailsModal';

const Home: NextPage = ({
  jobOpenings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const modal = useJobOpeningsStore((state) => state.modal);
  const checkboxTerms = useJobOpeningsStore((state) => state.checkboxTerms);
  const actionSelection = useJobOpeningsStore((state) => state.actionSelection);
  const isLoading = usePageStore((state) => state.isLoading);
  const publication = usePublicationStore((state) => state.publication);
  const setModal = useJobOpeningsStore((state) => state.setModal);
  const setCheckboxTerms = useJobOpeningsStore(
    (state) => state.setCheckboxTerms
  );
  const setIsLoading = usePageStore((state) => state.setIsLoading);
  const setActionSelection = useJobOpeningsStore(
    (state) => state.setActionSelection
  );

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
          closeModalAction={() => {
            setActionSelection('');
            setOpenDetailsModal(false);
          }}
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
