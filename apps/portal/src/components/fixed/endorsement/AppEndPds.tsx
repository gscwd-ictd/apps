/* eslint-disable @nx/enforce-module-boundaries */
import { LoadingSpinner } from '@gscwd-apps/oneui';
import { useAppEndStore } from 'apps/portal/src/store/endorsement.store';
import { Applicant } from 'apps/portal/src/types/applicant.type';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import useSWR from 'swr';
import { Pds } from '../../../../../pds/src/store/pds.store';
import { AppEndViewPds } from './AppEndViewPds';

type AppEndPdsProps = {
  applicantDetails: Pick<Applicant, 'applicantId' | 'applicantType'>;
};

export const AppEndPds = ({ applicantDetails }: AppEndPdsProps) => {
  const externalApplicantUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/pds/${applicantDetails.applicantId}`;
  const internalApplicantUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/api/pds/${applicantDetails.applicantId}`;
  const { pds, setPds } = useAppEndStore((state) => ({
    pds: state.pds,
    setPds: state.setPds,
  }));

  const {
    data: swrApplicant,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(
    `${
      applicantDetails.applicantType === 'external'
        ? `${externalApplicantUrl}`
        : internalApplicantUrl
    }`,
    fetcherHRIS,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    if (swrIsLoading) setPds({} as Pds);
  }, [swrIsLoading]);

  useEffect(() => {
    if (!isEmpty(swrApplicant)) {
      setPds(swrApplicant.data);
    }
    if (swrError) {
      //
    }
  }, [swrApplicant, swrError]);

  if (swrError)
    return (
      <div className="flex justify-center w-full">
        <span>Cannot find PDS</span>
      </div>
    );
  if (!swrApplicant)
    return (
      <>
        <LoadingSpinner size="md" />
      </>
    );

  return (
    <>
      {swrIsLoading ? (
        <LoadingSpinner size="md" />
      ) : (
        <AppEndViewPds pds={pds} />
      )}
    </>
  );
};
