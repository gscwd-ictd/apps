import { format } from 'date-fns';
import { JobOpeningDetails, VacancyDetails } from '../../../types/vacancies.type';
import { useWorkExpStore } from 'apps/portal/src/store/workexperience.store';
import BadgePill from '../../modular/badges/BadgePill';
import { TextSize } from 'libs/utils/src/lib/enums/text-size.enum';

export const JobDetailsPanel = (props: { data: JobOpeningDetails; details: VacancyDetails }): JSX.Element => {
  const { hasApplied } = useWorkExpStore((state) => ({
    hasApplied: state.hasApplied,
  }));

  return (
    <>
      <div className="flex flex-col gap-2 px-4 py-4 m-0 text-gray-800 bg-slate-100 rounded-xl">
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-col justify-start items-start w-full md:w-1/2 px-0.5 pb-3  ">
            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Item Number:</label>

            <div className="w-auto ml-5">
              <label className="text-md font-medium"> {props.data.jobDescription.itemNumber}</label>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start w-full md:w-1/2 px-0.5 pb-3  ">
            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5 ">Position Title:</label>

            <div className="w-auto ml-5">
              <label className=" text-md font-medium">{props.data.jobDescription.positionTitle}</label>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start w-full md:w-1/2 px-0.5 pb-3  ">
            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Department:</label>

            <div className="w-auto ml-5">
              <label className="text-md font-medium"> {props.data.jobDescription.assignedTo.department.name}</label>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start w-full md:w-1/2 px-0.5 pb-3  ">
            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Report To:</label>

            <div className="w-auto ml-5">
              <label className="text-md font-medium"> {props.data.jobDescription.reportsTo}</label>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Nature of Appointment:</label>

            <div className="w-auto ml-5">
              <label className="text-md font-medium">
                {' '}
                {props.data.jobDescription.natureOfAppointment.charAt(0).toUpperCase() +
                  props.data.jobDescription.natureOfAppointment.slice(1)}
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Salary Grade:</label>

            <div className="w-auto ml-5">
              <label className="text-md font-medium"> {props.data.jobDescription.salary.salaryGrade}</label>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start w-full sm:w-1/2 px-0.5 pb-3  ">
            <label className="text-slate-500 text-md whitespace-nowrap pb-0.5">Deadline:</label>

            <div className="w-auto ml-5">
              <label className="text-md font-medium">
                {' '}
                {props.details.postingDeadline && format(new Date(props.details.postingDeadline), 'MM/dd/yyyy')}
              </label>
            </div>
          </div>

          {hasApplied ? (
            <div className="flex flex-col justify-center items-end w-full px-0.5 pb-1 ">
              <div>
                <BadgePill
                  textSize={TextSize.TEXT_SM}
                  variant="primary"
                  label={'You have already applied for this position.'}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
