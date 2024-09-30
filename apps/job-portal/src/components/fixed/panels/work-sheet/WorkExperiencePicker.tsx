import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useWorkExpSheetStore, WorkExperienceSheet } from '../../../../store/work-experience-sheet.store';
import { TabHeader } from '../../tabs/TabHeader';

type WorkExperiencePickerProps = {
  // workExperiences: Array<WorkExperience>
  tab: number;
  setTab: (tab: number) => void;
};
export const WorkExperiencePicker = ({ tab, setTab }: WorkExperiencePickerProps) => {
  const selectedWorkExperience = useWorkExpSheetStore((state) => state.selectedWorkExperience);
  const setSelectedWorkExperience = useWorkExpSheetStore((state) => state.setSelectedWorkExperience);
  const workExperiences = useWorkExpSheetStore((state) => state.workExperiences);

  const onChangeTabs = (workExperience: WorkExperienceSheet, index: number) => {
    setTab(index + 1);
    setSelectedWorkExperience(workExperience);
  };

  const dateTransformer = (date: string) => {
    return dayjs(date).format('MMM D, YYYY');
  };

  return (
    <>
      <div className="">
        <div className="h-auto overflow-y-auto">
          <div className="grid justify-between w-full  sm:grid-cols-1 lg:grid-cols-2 gap-4 align-middle">
            {/* LEFT */}
            <div className="flex sm:h-[22rem] sm:overflow-y-auto lg:h-full w-full rounded ">
              <div className="w-full">
                {workExperiences &&
                  workExperiences.map((workExp: WorkExperienceSheet, index: number) => {
                    return (
                      <div key={index} className="mb-2">
                        <TabHeader
                          icon={
                            <>
                              <div className=""></div>
                            </>
                          }
                          tab={tab}
                          tabIndex={index + 1}
                          selected={workExp.isSelected}
                          positionTitle={workExp.positionTitle}
                          companyName={workExp.companyName}
                          duration={`${dateTransformer(workExp.from)} to ${
                            workExp.to === null ? 'Present' : workExp.to
                          }`}
                          onClick={() => onChangeTabs(workExp, index)}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full rounded border border-slate-200 bg-slate-100">
              {tab === 0 ? (
                <>
                  <div className="w-full h-full">
                    <p className="flex items-center justify-center w-full h-full text-2xl">
                      No selected Work Experience
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify-between w-full gap-4 p-5">
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-500">Duration</p>
                    <>
                      {dateTransformer(selectedWorkExperience.from)} -{' '}
                      {selectedWorkExperience.to === null ? 'Present' : dateTransformer(selectedWorkExperience.to)}
                    </>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-500">Position</p>
                    <p>{selectedWorkExperience.positionTitle}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-500">Name of Agency/Organization and Location</p>
                    <p>{selectedWorkExperience.companyName}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-500">Appointment Status</p>
                    <p>{selectedWorkExperience.appointmentStatus}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-500">Monthly Salary</p>
                    <p>{selectedWorkExperience.monthlySalary}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium text-gray-500">Government Service</p>
                    <p>{selectedWorkExperience.isGovernmentService === false ? 'No' : 'Yes'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
