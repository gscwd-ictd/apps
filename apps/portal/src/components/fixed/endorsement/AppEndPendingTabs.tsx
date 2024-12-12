import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../../src/utils/hoc/fetcher';
import { useAppEndStore } from '../../../store/endorsement.store';
import { AllPublicationList } from './AllPublicationList';

export const AppEndPendingTabs = () => {
  // generate this for caching
  // const random = useRef(Date.now());
  const publicationList = useAppEndStore((state) => state.publicationList);
  const setPublicationList = useAppEndStore((state) => state.setPublicationList);
  const pendingUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/publications/2da64692-60b1-4abe-9310-ccc59638d361/pending`; //! Replace with Requesting entity employee id
  const { data: pending, error: pendingError } = useSWR(pendingUrl, fetchWithSession, {});

  useEffect(() => {
    setPublicationList(pending);
  }, [pending]);

  return <>{/* <AllPublicationList /> */}</>;
};
