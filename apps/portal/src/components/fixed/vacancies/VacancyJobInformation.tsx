import {
  JobOpeningDetails,
  JobCompetencies,
} from '../../../types/vacancies.type';

export const VacancyJobInformation = (props: {
  data: JobOpeningDetails;
}): JSX.Element => {
  return (
    <>
      <div className="bg-slate-100 py-4 px-2 m-2 rounded-xl text-gray-800">
        <div className="px-2">
          <label className="font-bold">Item Number: </label>
          {props.data.jobDescription.itemNumber}
        </div>
        <div className="px-2">
          <label className="font-bold">Office: </label>
          {props.data.jobDescription.assignedTo.office}
        </div>
        <div className="px-2">
          <label className="font-bold">Department: </label>
          {props.data.jobDescription.assignedTo.department}
        </div>
        <div className="px-2">
          <label className="font-bold">Division: </label>
          {props.data.jobDescription.assignedTo.division}
        </div>
        <div className="px-2">
          <label className="font-bold">Report To: </label>
          {props.data.jobDescription.reportsTo}
        </div>
        <div className="px-2">
          <label className="font-bold">Salary Grade: </label>
          {props.data.jobDescription.salaryGrade}
        </div>
        <div className="px-2">
          <label className="font-bold">Nature of Appointment: </label>
          {props.data.jobDescription.natureOfAppointment}
        </div>
        <div className="px-2">
          <label className="font-bold">
            Description of the Office/Department/Division:{' '}
          </label>
          {props.data.jobDescription.summary}
        </div>

        <div className="px-2">
          <label className="font-bold">Description of the Position: </label>
          {props.data.jobDescription.description}
        </div>
      </div>

      <div className="bg-slate-100 py-2 m-2 rounded-xl text-gray-800">
        <div className="pt-4 px-2">
          <label className="font-bold pl-2">Qualification Standards: </label>
        </div>
        <div className="pt-2 px-2">
          <label className="font-bold pl-2">Education: </label>
          {props.data.qualificationStandards.education}
        </div>
        <div className="px-2">
          <label className="font-bold pl-2">Training: </label>
          {props.data.qualificationStandards.training}
        </div>
        <div className="px-2">
          <label className="font-bold pl-2">Eligibility: </label>
          {props.data.qualificationStandards.eligibility}
        </div>
        <div className="px-2 pb-4">
          <label className="font-bold pl-2">Experience: </label>
          {props.data.qualificationStandards.experience}
        </div>
      </div>

      <div className="p-2 m-2 bg-slate-100 rounded-xl text-gray-800">
        <div className="pt-4 pr-2 pb-4">
          <label className="font-bold pl-2">Competencies: </label>
        </div>

        {props.data.competencies.functional.length > 0 && (
          <>
            <div>
              <label className="font-bold pl-2">
                Functional/Cross Cutting Competency:{' '}
              </label>
            </div>
            {props.data.competencies.functional.map(
              (competency: JobCompetencies, Idx: number) => {
                return (
                  <div
                    className="px-4 py-2 my-2 bg-white border rounded-xl text-justify"
                    key={Idx}
                  >
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
                      {competency.description}
                    </div>
                  </div>
                );
              }
            )}
          </>
        )}

        {props.data.competencies.crossCutting.length > 0 && (
          <>
            {props.data.competencies.crossCutting.map(
              (competency: JobCompetencies, Idx: number) => {
                return (
                  <div
                    className="px-8 py-2 my-2 bg-white border rounded-xl text-justify"
                    key={Idx}
                  >
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
                      {competency.description}
                    </div>
                  </div>
                );
              }
            )}
          </>
        )}
      </div>

      {props.data.competencies.managerial.length > 0 && (
        <>
          <div className="p-2 m-2  bg-slate-100 rounded-xl text-gray-800">
            <div className="pt-4 pr-2 pb-4">
              <label className="font-bold pl-2">Managerial Competency: </label>
            </div>
            {props.data.competencies.managerial.map(
              (competency: JobCompetencies, Idx: number) => {
                return (
                  <div
                    className="px-8 py-2 my-2 bg-white border rounded-xl text-justify"
                    key={Idx}
                  >
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
                      {competency.description}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </>
      )}
    </>
  );
};
