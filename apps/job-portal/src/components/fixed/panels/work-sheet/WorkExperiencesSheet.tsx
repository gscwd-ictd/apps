import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';
import {
  useWorkExpSheetStore,
  WorkExperienceSheet,
} from '../../../../store/work-experience-sheet.store';
import { TabHeader } from '../../tabs/TabHeader';
import { Accomplishments } from './Accomplishments';
import { Duties } from './Duties';

export const WorkExperiencesSheet = () => {
  const selectedWorkExperience = useWorkExpSheetStore(
    (state) => state.selectedWorkExperience
  );
  const setSelectedWorkExperience = useWorkExpSheetStore(
    (state) => state.setSelectedWorkExperience
  );

  const {
    register,

    formState: { errors },
  } = useFormContext<WorkExperienceSheet>();

  const dateTransformer = (date: string) => {
    return dayjs(date).format('MMM D, YYYY');
  };
  return (
    <div>
      <section className="px-2">
        <TabHeader
          tab={0}
          tabIndex={0}
          icon
          selected={selectedWorkExperience.isSelected}
          invert={true}
          positionTitle={selectedWorkExperience.positionTitle}
          companyName={selectedWorkExperience.companyName}
          duration={`${dateTransformer(selectedWorkExperience.from)} - ${
            selectedWorkExperience.to === null
              ? 'Present'
              : dateTransformer(selectedWorkExperience.to)
          }`}
        />
      </section>

      <div className="w-full grid-cols-2 gap-4 px-2 pt-5 xs:flex-col lg:flex">
        <div className="flex flex-col w-full pb-2 ">
          <label htmlFor="supervisor" className="font-medium text-gray-700">
            Immediate Supervisor
          </label>
          <input
            id="supervisor"
            type="text"
            value={selectedWorkExperience.immediateSupervisor}
            className="w-full border-0 rounded bg-slate-100"
            {...register('immediateSupervisor')}
            onChange={(e) =>
              setSelectedWorkExperience({
                ...selectedWorkExperience,
                immediateSupervisor: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col w-full pb-2 ">
          <label htmlFor="officeunit" className="font-medium text-gray-700">
            Name of Office or Unit
          </label>
          <input
            id="officeunit"
            type="text"
            value={selectedWorkExperience.nameOfOffice}
            className="w-full border-0 rounded bg-slate-100"
            {...register('nameOfOffice')}
            onChange={(e) =>
              setSelectedWorkExperience({
                ...selectedWorkExperience,
                nameOfOffice: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="w-full h-full grid-cols-2 gap-4 px-2 pt-5 text-md xs:flex-col lg:flex">
        <Accomplishments />
        <Duties />
      </div>
    </div>
  );
};
