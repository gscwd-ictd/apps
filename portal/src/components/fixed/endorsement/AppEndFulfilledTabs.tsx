import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../../utils/hoc/fetcher';
import { useAppEndStore } from '../../../store/endorsement.store';
import { AllPublicationList } from './AllPublicationList';


export const AppEndFulfilledTabs = () => {
    // const random = useRef(Date.now());
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const publicationList = useAppEndStore((state) => state.publicationList);
    const setPublicationList = useAppEndStore((state) => state.setPublicationList);
    const setFulfilledIsLoaded = useAppEndStore((state) => state.setFulfilledIsLoaded);
    const fulfilledUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/publications/2da64692-60b1-4abe-9310-ccc59638d361/selected`;
    const { data: fulfilled, error: pendingError } = useSWR(fulfilledUrl, fetchWithSession);

    useEffect(() => {
        setPublicationList(fulfilled)
    }, [fulfilled])

    return <>
        {/* <AllPublicationList /> */}
    </>;
};
