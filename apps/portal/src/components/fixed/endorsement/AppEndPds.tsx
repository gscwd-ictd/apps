/* eslint-disable @nx/enforce-module-boundaries */
import { Applicant } from 'apps/portal/src/types/applicant.type';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

type AppEndPdsProps = {
  applicantDetails: Pick<Applicant, 'postingApplicantId' | 'applicantType'>;
};

export const AppEndPds = ({ applicantDetails }: AppEndPdsProps) => {
  const externalApplicantUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/pds/${applicantDetails.postingApplicantId}`;
  const internalApplicantUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/api/pds/${applicantDetails.postingApplicantId}`;
  const [pds, setPds] = useState<any>({});

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
    fetcherHRIS
  );

  useEffect(() => {
    if (swrApplicant) {
      console.log(pds);
      setPds(swrApplicant);
    }
  }, [swrApplicant, swrError]);

  return <>{swrIsLoading ? <></> : 'DONE'}</>;
};
