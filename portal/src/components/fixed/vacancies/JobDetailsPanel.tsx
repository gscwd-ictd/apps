import { format } from 'date-fns';
import {
  JobOpeningDetails,
  VacancyDetails,
} from '../../../types/vacancies.type';

export const JobDetailsPanel = (props: {
  data: JobOpeningDetails;
  details: VacancyDetails;
}): JSX.Element => {
  return (
    <>
      <div className="bg-slate-100 py-4 px-4 m-0 rounded-xl text-gray-800">
        <div className="pr-2 ">
          <label className="font-bold">Item Number: </label>
          {props.data.jobDescription.itemNumber}
        </div>
        <div className="pr-2">
          <label className="font-bold">Position Title: </label>
          {props.data.jobDescription.positionTitle}
        </div>
        <div className="pr-2">
          <label className="font-bold">Office: </label>
          {props.data.jobDescription.assignedTo.office}
        </div>
        <div className="pr-2">
          <label className="font-bold">Department: </label>
          {props.data.jobDescription.assignedTo.department}
        </div>
        <div className="pr-2">
          <label className="font-bold">Division: </label>
          {props.data.jobDescription.assignedTo.division}
        </div>
        <div className="pr-2">
          <label className="font-bold">Report To: </label>
          {props.data.jobDescription.reportsTo}
        </div>
        <div className="pr-2">
          <label className="font-bold">Salary Grade: </label>
          {props.data.jobDescription.salaryGrade}
        </div>
        <div className="pr-2">
          <label className="font-bold">Nature of Appointment: </label>
          {props.data.jobDescription.natureOfAppointment}
        </div>
        <div className="pr-2">
          <label className="font-bold">
            Description of the Office/Department/Division:{' '}
          </label>
          {props.data.jobDescription.summary}
        </div>
        <div className="pr-2">
          <label className="font-bold">Description of the Position: </label>
          {props.data.jobDescription.description}
        </div>
        <div>
          <label className="font-bold">Deadline: </label>
          {props.details.postingDeadline &&
            format(new Date(props.details.postingDeadline), 'MM/dd/yyyy')}
        </div>
      </div>
    </>
  );
};
