import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import axios from 'axios';
import { ApplicantDetails } from '../../components/fixed/layout/ApplicantDetails';
import { usePageStore } from '../../store/page.store';
import { useEffect } from 'react';
import { usePublicationStore } from '../../store/publication.store';

export default function InitialApplication({ publication }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const page = usePageStore((state) => state.page);
  const setPage = usePageStore((state) => state.setPage);
  const setPublication = usePublicationStore((state) => state.setPublication);

  useEffect(() => {
    setPublication(publication);
    setPage(1);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white">
        <header className="shadow ">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{publication.positionTitle}</h1>
          </div>
        </header>
        <main>
          <div className="flex items-center justify-center">
            <ApplicantDetails page={page} />
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/vacant-position-postings/publications/${context.params!.vpp_id}`
    );

    return {
      props: {
        publication: data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: `/404`,
        permanent: false,
      },
    };
  }
};
