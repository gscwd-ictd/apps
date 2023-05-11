/* eslint-disable @nx/enforce-module-boundaries */
import { Applicant } from 'apps/portal/src/types/applicant.type';
import fetcherHRIS from 'apps/portal/src/utils/helpers/fetchers/FetcherHRIS';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Pds } from '../../../../../pds/src/store/pds.store';

type AppEndPdsProps = {
  applicantDetails: Pick<Applicant, 'applicantId' | 'applicantType'>;
};

export const AppEndPds = ({ applicantDetails }: AppEndPdsProps) => {
  const externalApplicantUrl = `${process.env.NEXT_PUBLIC_HRIS_URL}/pds/${applicantDetails.applicantId}`;
  const internalApplicantUrl = `${process.env.NEXT_PUBLIC_PORTAL_URL}/api/pds/${applicantDetails.applicantId}`;
  const [pds, setPds] = useState<Pds>({} as Pds);

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
    if (swrIsLoading) setPds({} as Pds);
  }, [swrIsLoading]);

  useEffect(() => {
    if (!isEmpty(swrApplicant)) {
      setPds(swrApplicant.data);
    }
  }, [swrApplicant, swrError]);

  return <>{swrIsLoading ? null : pds.personalInfo.firstName}</>;
};
