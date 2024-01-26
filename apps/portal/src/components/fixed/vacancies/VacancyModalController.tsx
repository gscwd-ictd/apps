import { VacancyJobInformation } from './VacancyJobInformation';
import { JobOpeningDetails } from '../../../../src/types/vacancies.type';
import { VacancyWorkExperience } from './VacancyWorkExperience';
import { WorkExperiencePds } from '../../../../src/types/workexp.type';

type VacancyModalControllerProps = {
  page: number;
  dataJobOpening: JobOpeningDetails;
  workExperience: WorkExperiencePds;
};

export const VacancyModalController = ({ page, dataJobOpening, workExperience }: VacancyModalControllerProps) => {
  return (
    <div className="max-h-[90%]">
      <>
        {/* display vacant job information on modal */}
        {page === 1 && <VacancyJobInformation data={dataJobOpening} />}
        {/* display employee work experience module */}
        {page === 2 && <VacancyWorkExperience data={workExperience} />}
      </>
    </div>
  );
};
