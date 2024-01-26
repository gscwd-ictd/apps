import { JobOpeningDetails, JobCompetencies } from '../../../types/vacancies.type';
import { useWorkExpStore } from 'apps/portal/src/store/workexperience.store';

export const VacancyJobInformation = (props: { data: JobOpeningDetails }): JSX.Element => {
  const { hasApplied } = useWorkExpStore((state) => ({
    hasApplied: state.hasApplied,
  }));

  return (
    <>
      <div className="px-2 py-4 m-2 text-gray-800 bg-slate-100 rounded-xl">
        <div className="px-2">
          <label className="font-bold">Item Number: </label>
          {props.data.jobDescription.itemNumber}
        </div>
        <div className="px-2">
          <label className="font-bold">Office: </label>
          {props.data.jobDescription.assignedTo.office.name}
        </div>
        <div className="px-2">
          <label className="font-bold">Department: </label>
          {props.data.jobDescription.assignedTo.department.name}
        </div>
        <div className="px-2">
          <label className="font-bold">Division: </label>
          {props.data.jobDescription.assignedTo.division.name}
        </div>
        <div className="px-2">
          <label className="font-bold">Report To: </label>
          {props.data.jobDescription.reportsTo}
        </div>
        <div className="px-2">
          <label className="font-bold">Salary Grade: </label>
          {props.data.jobDescription.salary.salaryGrade}
        </div>
        <div className="px-2">
          <label className="font-bold">Nature of Appointment: </label>
          {props.data.jobDescription.natureOfAppointment}
        </div>
        <div className="px-2">
          <label className="font-bold">Description of the Office/Department/Division: </label>
          {props.data.jobDescription.summary}
        </div>

        <div className="px-2">
          <label className="font-bold">Description of the Position: </label>
          {props.data.jobDescription.description}
        </div>
      </div>

      <div className="py-2 m-2 text-gray-800 bg-slate-100 rounded-xl">
        <div className="px-2 pt-4">
          <label className="pl-2 font-bold">Qualification Standards: </label>
        </div>
        <div className="px-2 pt-2">
          <label className="pl-2 font-bold">Education: </label>
          {props.data.qualificationStandards.education}
        </div>
        <div className="px-2">
          <label className="pl-2 font-bold">Training: </label>
          {props.data.qualificationStandards.training}
        </div>
        <div className="px-2">
          <label className="pl-2 font-bold">Eligibility: </label>
          {props.data.qualificationStandards.eligibility}
        </div>
        <div className="px-2 pb-4">
          <label className="pl-2 font-bold">Experience: </label>
          {props.data.qualificationStandards.experience}
        </div>
      </div>

      <div className="p-2 m-2 text-gray-800 bg-slate-100 rounded-xl">
        <div className="pt-4 pb-4 pr-2">
          <label className="pl-2 font-bold">Competencies: </label>
        </div>

        {props.data.competencies.functional.length > 0 && (
          <>
            <div>
              <label className="pl-2 font-bold">Functional/Cross Cutting Competency: </label>
            </div>
            {props.data.competencies.functional.map((competency: JobCompetencies, Idx: number) => {
              return (
                <div className="px-4 py-2 my-2 text-justify bg-white border rounded-xl" key={Idx}>
                  <div>
                    <label className="font-bold">Name: </label>
                    {competency.name}
                  </div>
                  <div>
                    <label className="font-bold">Level: </label>
                    {competency.level}
                  </div>
                  <div>
                    <label className="font-bold">Description: </label>
                    {competency.description}
                  </div>
                  <div className="pb-4">
                    <label className="font-bold">Key Actions: </label>
                    {competency.keyActions}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {props.data.competencies.crossCutting.length > 0 && (
          <>
            {props.data.competencies.crossCutting.map((competency: JobCompetencies, Idx: number) => {
              return (
                <div className="px-4 py-2 my-2 text-justify bg-white border rounded-xl" key={Idx}>
                  <div>
                    <label className="font-bold">Name: </label>
                    {competency.name}
                  </div>
                  <div>
                    <label className="font-bold">Level: </label>
                    {competency.level}
                  </div>
                  <div>
                    <label className="font-bold">Description: </label>
                    {competency.description}
                  </div>
                  <div className="pb-4">
                    <label className="font-bold">Key Actions: </label>
                    {competency.keyActions}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {props.data.competencies.managerial.length > 0 && (
        <>
          <div className="p-2 m-2 text-gray-800 bg-slate-100 rounded-xl">
            <div className="pt-4 pb-4 pr-2">
              <label className="pl-2 font-bold">Managerial Competency: </label>
            </div>
            {props.data.competencies.managerial.map((competency: JobCompetencies, Idx: number) => {
              return (
                <div className="px-4 py-2 my-2 text-justify bg-white border rounded-xl" key={Idx}>
                  <div>
                    <label className="font-bold">Name: </label>
                    {competency.name}
                  </div>
                  <div>
                    <label className="font-bold">Level: </label>
                    {competency.level}
                  </div>
                  <div>
                    <label className="font-bold">Description: </label>
                    {competency.description}
                  </div>
                  <div className="pb-4">
                    <label className="font-bold">Key Actions: </label>
                    {competency.keyActions}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};
