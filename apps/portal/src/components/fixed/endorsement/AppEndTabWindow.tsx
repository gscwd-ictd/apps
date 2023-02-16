import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchWithSession } from '../../../../utils/hoc/fetcher';
import { useEmployeeStore } from '../../../store/employee.store';
import { useAppEndStore } from '../../../store/endorsement.store';
import { AllPublicationListTab } from './AllPublicationListTab';

type AppEndTabWindowProps = {
    employeeId: string
}

export const AppEndTabWindow = ({ employeeId }: AppEndTabWindowProps): JSX.Element => {


    const pendingUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/publications/${employeeId}/pending`;
    const fulfilledUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/applicant-endorsement/publications/${employeeId}/selected`;
    const { data: pendingPublications } = useSWR(pendingUrl, fetchWithSession);

    const { data: fulfilledPublications } = useSWR(fulfilledUrl, fetchWithSession);

    const pendingPublicationList = useAppEndStore((state) => state.pendingPublicationList);

    const fulfilledPublicationList = useAppEndStore((state) => state.fulfilledPublicationList);

    const setPendingPublicationList = useAppEndStore((state) => state.setPendingPublicationList);

    const setFulfilledPublicationList = useAppEndStore((state) => state.setFulfilledPublicationList);

    const tab = useAppEndStore((state) => state.tab);

    useEffect(() => setPendingPublicationList(pendingPublications), [pendingPublications]);

    useEffect(() => setFulfilledPublicationList(fulfilledPublications), [fulfilledPublications]);

    return (
        <>
            <div className="w-full bg-inherit rounded px-5 h-[28rem] overflow-y-auto">
                {tab === 1 && <AllPublicationListTab publications={pendingPublicationList} tab={tab} />}
                {tab === 2 && <AllPublicationListTab publications={fulfilledPublicationList} tab={tab} />}

            </div>
        </>
    );
};
