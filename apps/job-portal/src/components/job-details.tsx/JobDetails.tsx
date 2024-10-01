/* eslint-disable @nx/enforce-module-boundaries */
import { Publication } from 'apps/job-portal/utils/types/data/publication-type';
import { JobOpeningDetails } from 'apps/job-portal/utils/types/data/vacancies.type';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcher from '../modular/fetcher/Fetcher';
import { JobDetailsTabPanel } from './JobDetailsTabPanel';
import { JobDetailsTitle } from './JobDetailsTitle';

type JobDetailsProps = {
  publication: Publication;
};

export const JobDetails = ({ publication }: JobDetailsProps) => {
  const {
    data: swrJobDetails,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/vacant-position-postings/job-description/${publication.vppId}`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  const [jobOpeningDetails, setJobOpeningDetails] = useState<JobOpeningDetails>({} as JobOpeningDetails);

  useEffect(() => {
    if (swrIsLoading) setJobOpeningDetails({} as JobOpeningDetails);
  }, [swrIsLoading]);

  useEffect(() => {
    if (!isEmpty(swrJobDetails)) {
      setJobOpeningDetails(swrJobDetails.data);
    }

    if (!isEmpty(swrError)) {
      //
    }
  }, [swrJobDetails, swrError]);
  return (
    <>
      {swrIsLoading ? null : !isEmpty(jobOpeningDetails) ? (
        <>
          <div className="w-full  flex flex-col sm:px-0 lg:px-5 ">
            <JobDetailsTitle jobOpeningDetails={jobOpeningDetails} />
            <JobDetailsTabPanel jobOpeningDetails={jobOpeningDetails} />
          </div>
        </>
      ) : null}
    </>
  );
};
