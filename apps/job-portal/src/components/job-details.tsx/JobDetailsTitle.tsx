/* eslint-disable @nx/enforce-module-boundaries */
import { JobOpeningDetails } from 'apps/job-portal/utils/types/data/vacancies.type';
import { isEmpty } from 'lodash';

type JobDetailsTitleProps = {
  jobOpeningDetails: JobOpeningDetails;
};

export const JobDetailsTitle = ({
  jobOpeningDetails,
}: JobDetailsTitleProps) => {
  return (
    <div className="grid w-full grid-cols-2 px-5 py-4 font-medium text-gray-800 rounded  bg-slate-200">
      <div className="col-span-1">
        <div className="flex w-full">
          <span className="text-md font-light w-[30%]">
            {' '}
            Plantilla Item No:
          </span>
          <span className="text-lg w-[70%]">
            {jobOpeningDetails && jobOpeningDetails.jobDescription.itemNumber}
          </span>
        </div>

        <div className="flex w-full">
          <span className="text-md font-light w-[30%]"> Position Title: </span>

          <span className="text-lg w-[70%]">
            {jobOpeningDetails &&
              jobOpeningDetails.jobDescription.positionTitle}
          </span>
        </div>
      </div>

      <div className="col-span-1">
        <div className="flex w-full">
          <span className="text-md font-light w-[40%]">
            Salary Job / Pay Grade:{' '}
          </span>
          <span className="text-lg w-[60%]">
            {jobOpeningDetails &&
              Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP',
              }).format(jobOpeningDetails.jobDescription.salary.amount)}
            / SG-
            {jobOpeningDetails && jobOpeningDetails.competencies.salaryGrade}
          </span>
        </div>
        <div className="flex w-full">
          <span className="w-[40%] text-md font-light">Annual Salary: </span>
          <span className="w-[60%] text-lg">
            {jobOpeningDetails &&
              Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP',
              }).format(jobOpeningDetails.jobDescription.salary.amount * 12)}
          </span>
        </div>

        <div className="flex w-full">
          <span className="w-[40%] font-light text-md">
            Place of Assignment:{' '}
          </span>
          <span className="w-[60%] text-lg">
            {jobOpeningDetails &&
            !isEmpty(jobOpeningDetails.jobDescription.assignedTo.division)
              ? jobOpeningDetails.jobDescription.assignedTo.division.name
              : isEmpty(jobOpeningDetails.jobDescription.assignedTo.division) &&
                !isEmpty(jobOpeningDetails.jobDescription.assignedTo.department)
              ? jobOpeningDetails.jobDescription.assignedTo.department.name
              : isEmpty(jobOpeningDetails.jobDescription.assignedTo.division) &&
                isEmpty(
                  jobOpeningDetails.jobDescription.assignedTo.department
                ) &&
                !isEmpty(jobOpeningDetails.jobDescription.assignedTo.office)
              ? jobOpeningDetails.jobDescription.assignedTo.office.name
              : null}
          </span>
        </div>
      </div>
    </div>
  );
};
