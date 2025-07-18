/* eslint-disable @nx/enforce-module-boundaries */
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import JobOpeningsTable from '../components/table/JobOpeningsTable';
import { FormModal } from '../components/modular/common/overlays/FormModal';
import { SpinnerCircularFixed } from 'spinners-react';
import { DataPrivacyAct } from '../components/fixed/data-privacy-act/DataPrivacyAct';
import { useJobOpeningsStore } from '../store/job-openings.store';
import { usePageStore } from '../store/page.store';
import { usePublicationStore } from '../store/publication.store';
import { ViewJobDetailsModal } from '../components/fixed/modals/ViewJobDetailsModal';
import { Publication } from 'apps/job-portal/utils/types/data/publication-type';
import { PageContentContext } from '../components/fixed/page/PageContent';
import { CardContainer } from '../components/modular/cards/CardContainer';
import { HiInformationCircle } from 'react-icons/hi';

const Home: NextPage = ({ jobOpenings }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const isLoading = usePageStore((state) => state.isLoading);
  const { publication, setPublication } = usePublicationStore((state) => ({
    publication: state.publication,
    setPublication: state.setPublication,
  }));

  const setIsLoading = usePageStore((state) => state.setIsLoading);

  const { actionSelection, checkboxTerms, modal, setActionSelection, setCheckboxTerms, setModal, setPositionTab } =
    useJobOpeningsStore((state) => ({
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

        await router.push(`${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${publication.vppId}`);
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

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  useEffect(() => {
    if (actionSelection === 'Position Details') setOpenDetailsModal(true);
  }, [actionSelection]);

  useEffect(() => {
    setCheckboxTerms(false);
  }, []);

  return (
    <div className="flex flex-col h-full ">
      <header className="w-full bg-white shadow shrink-0">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">JOB OPENINGS</h1>
        </div>
      </header>

      <main className="flex-grow overflow-auto pb-20">
        <CardContainer
          className="rounded-xl p-5 mx-2 lg:mx-[20%]"
          bgColor={'bg-yellow-100'}
          title={''}
          remarks={''}
          subtitle={''}
        >
          <div className="flex gap-2">
            <section>
              <HiInformationCircle size={40} className="text-slate-600" />
            </section>
            <section className="text-xs sm:text-xs md:text-md lg:text-sm">
              • {'  '}Do not use Incognito Mode or Private Mode as it may conflict with the user experience.
              <br />• {'  '}Do not refresh the page after application. Any changes made will be discarded.
            </section>
          </div>
        </CardContainer>

        <JobOpeningsTable jobOpenings={jobOpenings} />
      </main>

      <section>
        <FormModal
          isOpen={modal.isOpen}
          setIsOpen={openModal}
          onAction={onActionModal}
          onCancel={onCancelModal}
          onClose={onCloseModal}
          modalSize={isMobile ? 'full' : 'xxxxl'}
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
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/vacant-position-postings/publications/`);

    return {
      props: {
        jobOpenings: data,
      },
    };
  } catch (error) {
    console.log('Error GET vpp', error.message);
    return {
      props: {},
    };
  }
};
