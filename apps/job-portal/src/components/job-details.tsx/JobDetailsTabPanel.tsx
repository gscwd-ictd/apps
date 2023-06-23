/* eslint-disable @nx/enforce-module-boundaries */
import { JobOpeningDetails } from 'apps/job-portal/utils/types/data/vacancies.type';
import { isEmpty } from 'lodash';
import { useJobOpeningsStore } from '../../store/job-openings.store';
import { PositionTab } from '../fixed/tabs/PositionTab';

type JobDetailsTabPanelProps = {
  jobOpeningDetails: JobOpeningDetails;
};

export const JobDetailsTabPanel = ({
  jobOpeningDetails,
}: JobDetailsTabPanelProps) => {
  const { positionTab } = useJobOpeningsStore((state) => ({
    positionTab: state.positionTab,
  }));
  return (
    <div className=" gap-2 mt-2 w-full grid grid-cols-12 h-[22rem] mb-2">
      <section className="flex col-span-2">
        <div className="w-full gap-1 sm:flex sm:flex-col md:flex md:flex-col lg:flex">
          {/* Core */}
          {!isEmpty(jobOpeningDetails.competencies.core) && (
            <PositionTab title="Core" index={0} />
          )}

          {/* Functional and Cross Cutting */}
          {(!isEmpty(jobOpeningDetails.competencies.crossCutting) ||
            !isEmpty(jobOpeningDetails.competencies.functional)) && (
            <PositionTab title="Functional / Cross-Cutting" index={1} />
          )}

          {/* Managerial */}
          {!isEmpty(jobOpeningDetails.competencies.managerial) && (
            <PositionTab title="Managerial" index={2} />
          )}

          {/*  Qualification Standards */}
          {!isEmpty(jobOpeningDetails.qualificationStandards) && (
            <PositionTab title="Qualification Standards" index={3} />
          )}
        </div>
      </section>
      <section className="flex rounded col-span-10 min-h-[22rem] h-[32rem] overflow-y-auto  border border-gray-400">
        {/* CORE COMPETENCIES */}
        {positionTab === 0 ? (
          <div className="w-full h-full p-2">
            <div className="flex items-center justify-center w-full py-1">
              <div className="font-medium text-gray-600 sm:text-xl md:text-xl lg:text-3xl">
                Core Competencies
              </div>
            </div>
            {jobOpeningDetails &&
              jobOpeningDetails.competencies.core.map((competency, index) => {
                return (
                  <div
                    key={index}
                    className="min-h-[6rem] p-2  rounded mb-2 border bg-gray-200"
                  >
                    <section className="grid w-full h-full grid-cols-2">
                      <section className="p-2 font-medium">
                        {competency.name}
                      </section>
                      <section className="p-2 font-medium underline">
                        {competency.level}
                      </section>
                      <section className="col-span-2 p-2 ">
                        {competency.description}
                      </section>
                    </section>
                  </div>
                );
              })}
          </div>
        ) : positionTab === 1 ? (
          <div className="w-full h-full p-2 transition-all ease-in-out">
            <div className="flex items-center justify-center w-full py-1 ">
              <div className="font-medium text-gray-600 sm:text-xl md:text-xl lg:text-3xl">
                Functional/Cross-Cutting Competencies
              </div>
            </div>
            {jobOpeningDetails &&
              jobOpeningDetails.competencies.functional.map(
                (competency, index) => {
                  return (
                    <div
                      key={index}
                      className="min-h-[6rem] p-2 rounded mb-2 border bg-gray-200"
                    >
                      <section className="grid w-full h-full grid-cols-2">
                        <section className="p-2 font-medium">
                          {competency.name}
                        </section>
                        <section className="p-2 font-medium underline">
                          {competency.level}
                        </section>
                        <section className="col-span-2 p-2 ">
                          {competency.description}
                        </section>
                      </section>
                    </div>
                  );
                }
              )}

            {jobOpeningDetails &&
              jobOpeningDetails.competencies.crossCutting.map(
                (competency, index) => {
                  return (
                    <div
                      key={index}
                      className="min-h-[6rem] p-2 rounded mb-2 border bg-gray-200"
                    >
                      <section className="grid w-full h-full grid-cols-2">
                        <section className="p-2 font-medium">
                          {competency.name}
                        </section>
                        <section className="p-2 font-medium underline">
                          {competency.level}
                        </section>
                        <section className="col-span-2 p-2 ">
                          {competency.description}
                        </section>
                      </section>
                    </div>
                  );
                }
              )}
          </div>
        ) : positionTab === 2 ? (
          <div className="w-full h-full p-2 transition-all ease-in-out">
            <div className="flex items-center justify-center w-full py-1 ">
              <div className="font-medium text-gray-600 sm:text-xl md:text-xl lg:text-3xl">
                Managerial Competencies
              </div>
            </div>
            {jobOpeningDetails &&
              jobOpeningDetails.competencies.managerial.map(
                (competency, index) => {
                  return (
                    <div
                      key={index}
                      className="min-h-[6rem] p-2 rounded mb-2 border bg-gray-200"
                    >
                      <section className="grid w-full h-full grid-cols-2">
                        <section className="p-2 font-medium">
                          {competency.name}
                        </section>
                        <section className="p-2 font-medium">
                          {competency.level}
                        </section>
                        <section className="col-span-2 p-2 ">
                          {competency.description}
                        </section>
                      </section>
                    </div>
                  );
                }
              )}
          </div>
        ) : positionTab === 3 ? (
          <div className="flex flex-col w-full h-full gap-2 p-2 bg-white border rounded">
            <div className="flex items-center justify-center w-full py-1">
              <div className="font-medium text-gray-600 sm:text-xl md:text-xl lg:text-3xl">
                Qualification Standards
              </div>
            </div>
            {/* EDUCATION */}
            <section className="w-full min-h-[6rem] bg-gray-200 p-2 rounded">
              <div className="p-2 mb-2 font-medium underline text-md">
                Education
              </div>
              <div className="p-2">
                {!isEmpty(jobOpeningDetails.qualificationStandards.education)
                  ? jobOpeningDetails.qualificationStandards.education
                  : 'Not Required'}
              </div>
            </section>

            {/* EDUCATION */}
            <section className="w-full min-h-[6rem] bg-gray-200 p-2 rounded">
              <div className="p-2 mb-2 font-medium underline text-md">
                Eligibility
              </div>
              <div className="p-2">
                {!isEmpty(jobOpeningDetails.qualificationStandards.eligibility)
                  ? jobOpeningDetails.qualificationStandards.eligibility
                  : 'Not Required'}
              </div>
            </section>

            {/* Experience */}
            <section className="w-full min-h-[6rem] bg-gray-200 p-2 rounded">
              <div className="p-2 mb-2 font-medium underline text-md">
                Experience
              </div>
              <div className="p-2">
                {!isEmpty(jobOpeningDetails.qualificationStandards.experience)
                  ? jobOpeningDetails.qualificationStandards.experience
                  : 'Not Required'}
              </div>
            </section>

            {/* Training */}
            <section className="w-full min-h-[6rem] bg-gray-200 p-2 rounded">
              <div className="p-2 mb-2 font-medium underline text-md">
                Training
              </div>
              <div className="p-2">
                {!isEmpty(jobOpeningDetails.qualificationStandards.training)
                  ? jobOpeningDetails.qualificationStandards.training
                  : 'Not Required'}
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </div>
  );
};
