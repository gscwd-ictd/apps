/* eslint-disable @nx/enforce-module-boundaries */
import { Publication } from 'apps/job-portal/utils/types/data/publication-type';
import { JobOpeningDetails } from 'apps/job-portal/utils/types/data/vacancies.type';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { PositionTab } from '../fixed/tabs/PositionTab';
import fetcher from '../modular/fetcher/Fetcher';

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

  const [jobOpeningDetails, setJobOpeningDetails] = useState<JobOpeningDetails>(
    {} as JobOpeningDetails
  );

  useEffect(() => {
    if (swrIsLoading) setJobOpeningDetails({} as JobOpeningDetails);
  }, [swrIsLoading]);

  useEffect(() => {
    if (!isEmpty(swrJobDetails)) {
      console.log(swrJobDetails.data);
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
          <div className="w-full h-[44rem] flex flex-col max-h-[44rem] px-5 text-gray-700">
            <div className="text-xl">
              {jobOpeningDetails && jobOpeningDetails.jobDescription.itemNumber}
            </div>
            <div className="text-2xl">
              {jobOpeningDetails &&
                jobOpeningDetails.jobDescription.positionTitle}
            </div>

            <div className="text-lg">
              {jobOpeningDetails &&
              !isEmpty(jobOpeningDetails.jobDescription.assignedTo.division)
                ? jobOpeningDetails.jobDescription.assignedTo.division.name
                : isEmpty(
                    jobOpeningDetails.jobDescription.assignedTo.division
                  ) &&
                  !isEmpty(
                    jobOpeningDetails.jobDescription.assignedTo.department
                  )
                ? jobOpeningDetails.jobDescription.assignedTo.department.name
                : isEmpty(
                    jobOpeningDetails.jobDescription.assignedTo.division
                  ) &&
                  isEmpty(
                    jobOpeningDetails.jobDescription.assignedTo.department
                  ) &&
                  !isEmpty(jobOpeningDetails.jobDescription.assignedTo.office)
                ? jobOpeningDetails.jobDescription.assignedTo.office.name
                : null}
              <PositionTab title="Competency" />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
