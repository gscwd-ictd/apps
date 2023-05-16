/* eslint-disable @nx/enforce-module-boundaries */
import { useState } from 'react';
import dayjs from 'dayjs';
import { Pds } from 'apps/pds/src/store/pds.store';

type AppEndViewPdsProps = {
  pds: Pds;
};

export const AppSelectionViewPds = ({ pds }: AppEndViewPdsProps) => {
  const [appInfoIsOpen, setAppInfoIsOpen] = useState<boolean>(true);

  return (
    <>
      <div className="flex flex-col justify-center">
        <div className="fixed top-0 flex items-center justify-between w-full h-12 px-8 font-semibold text-center text-indigo-900 bg-indigo-200 md:justify-center md:static">
          PERSONAL DATA SHEET
        </div>
        {
          // WILL ONLY DISPLAY APPLICANT DETAILS IF ITS NOT EMPTY (NORMALLY DUE TO INVALID/NON EXISTING APPLICANT ID)
          pds && pds.permanentAddress ? (
            <>
              <div
                className={`${
                  appInfoIsOpen ? 'block' : 'hidden'
                } text-sm h-full `}
              >
                <div className="flex flex-col p-2 bg-slate-100 text-slate-800">
                  <div className="flex flex-col">
                    <div className="gap-1 mr-2 font-bold">Name:</div>
                    <div className="flex flex-row gap-1 ">
                      <label>{pds.personalInfo.firstName} </label>
                      <label>{pds.personalInfo.middleName}</label>
                      <label>{pds.personalInfo.lastName}</label>
                      <label>{pds.personalInfo.nameExtension}</label>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="mr-2 font-bold">Date of Birth:</div>
                    {pds.personalInfo.birthDate &&
                      dayjs(pds.personalInfo.birthDate).format('MMMM DD, YYYY')}
                  </div>
                  <div className="flex flex-col">
                    <div className="mr-2 font-bold">Place of Birth:</div>
                    {pds.personalInfo.birthPlace}
                  </div>
                  <div className="flex">
                    <div className="mr-2 font-bold">Gender:</div>
                    {pds.personalInfo.sex}
                  </div>
                  <div className="flex">
                    <div className="mr-2 font-bold">Blood Type:</div>
                    {pds.personalInfo.bloodType}
                  </div>
                  <div className="flex">
                    <div className="mr-2 font-bold">Civil Status:</div>
                    {pds.personalInfo.civilStatus}
                  </div>
                  <div className="flex">
                    <div className="mr-2 font-bold">Citizenship:</div>
                    {pds.personalInfo.citizenship}
                  </div>
                  <div className="mr-2 font-bold">Permanent Address:</div>
                  <div>{pds.permanentAddress.city}</div>
                  <div className="mr-2 font-bold">Residential Address:</div>
                  <div>{pds.residentialAddress.city}</div>
                  <div className="flex">
                    <div className="mr-2 font-bold">Contact Number:</div>
                    {pds.personalInfo.telephoneNumber}
                  </div>
                  <div className="flex flex-col">
                    <div className="mr-2 font-bold">Email:</div>
                    {pds.personalInfo.email}
                  </div>

                  <div className="mr-2 font-bold">Elementary:</div>
                  <div>{pds.elementary.schoolName}</div>
                  <div className="mr-2 font-bold">Secondary:</div>
                  <div>{pds.secondary.schoolName}</div>

                  <div className="flex flex-col">
                    <div className="mr-2 font-bold">College:</div>
                    {/* MAP COLLEGE FROM PDS */}
                    {pds.college.map((college, collegeIdx) => {
                      return (
                        <div
                          key={collegeIdx}
                          className="flex flex-col pb-2 pl-1 text-sm"
                        >
                          <label>School: {college.schoolName}</label>
                          <label>Degree: {college.degree}</label>
                          <label>Graduated: {college.yearGraduated}</label>
                          <label>Awards: {college.awards}</label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <div className="mr-2 font-bold">
                      Civil Service Eligibility:
                    </div>
                    {/* MAP ELIGIBILITY FROM PDS */}
                    {pds.eligibility.map((cs, csIdx) => {
                      return (
                        <div
                          key={csIdx}
                          className="flex flex-col pb-2 pl-1 text-sm"
                        >
                          <label>Name: {cs.name}</label>
                          <label>Rating: {cs.rating}</label>
                          <label>
                            Date: {cs.examDate.from}{' '}
                            <span
                              className={`${cs.examDate.to ? '' : 'hidden'}`}
                            >
                              -
                            </span>
                            {cs.examDate.to}
                          </label>
                          <label>Place: {cs.examPlace}</label>
                          <label>License No.: {cs.licenseNumber}</label>
                          <label>
                            Validity:{' '}
                            {cs.validity &&
                              dayjs(cs.validity).format('MMMM DD, YYYY')}
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <div className="mr-2 font-bold">Work Experience:</div>
                    {/* MAP WORK EXPERIENCE FROM PDS */}
                    {pds.workExperience.map((work, workIdx) => {
                      return (
                        <div
                          key={workIdx}
                          className="flex flex-col pb-2 pl-1 text-sm"
                        >
                          <label>Title: {work.positionTitle}</label>
                          <label>Company: {work.companyName}</label>
                          <label>Salary: {work.monthlySalary}</label>
                          <label>Status: {work.appointmentStatus}</label>
                          <label>
                            From:{' '}
                            {work.from &&
                              dayjs(work.from).format('MMMM DD, YYYY')}
                          </label>
                          <label>
                            To:{' '}
                            {work.to && dayjs(work.to).format('MMMM DD, YYYY')}
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <div className="mr-2 font-bold">
                      Voluntary Work Experience:
                    </div>
                    {/* MAP VOLUNTARY WORK EXPERIENCE FROM PDS */}
                    {pds.voluntaryWork.map((vwork, vworkIdx) => {
                      return (
                        <div
                          key={vworkIdx}
                          className="flex flex-col pb-2 pl-1 text-sm"
                        >
                          <label>Title: {vwork.position}</label>
                          <label>Organization: {vwork.organizationName}</label>
                          <label>
                            From:{' '}
                            {vwork.from &&
                              dayjs(vwork.from).format('MMMM DD, YYYY')}
                          </label>
                          <label>
                            To:{' '}
                            {vwork.to &&
                              dayjs(vwork.to).format('MMMM DD, YYYY')}
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <div className="mr-2 font-bold">
                      Training Programs/Seminars:
                    </div>
                    {/* MAP TRAINING/SEMINARS FROM PDS */}
                    {pds.learningDevelopment.map((learning, learnIdx) => {
                      return (
                        <div
                          key={learnIdx}
                          className="flex flex-col pb-2 pl-1 text-sm"
                        >
                          <label>Title: {learning.title}</label>
                          <label>By: {learning.conductedBy}</label>
                          <label>Type: {learning.type}</label>
                          <label>
                            From:{' '}
                            {learning.from &&
                              dayjs(learning.from).format('MMMM DD, YYYY')}
                          </label>
                          <label>
                            To:{' '}
                            {learning.to &&
                              dayjs(learning.to).format('MMMM DD, YYYY')}
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <div className="mr-2 font-bold">
                      Special Skills/Hobbies:
                    </div>
                    {/* MAP SKILLS FROM PDS */}
                    {pds.skills.map((skills, skillsIdx) => {
                      return (
                        <div
                          key={skillsIdx}
                          className="flex flex-col pl-1 text-sm"
                        >
                          <label>{skills.skill}</label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <div className="pt-2 mr-2 font-bold">
                      Non-Academic Distinctions:
                    </div>
                    {/* MAP RECOGNITIONS FROM PDS */}
                    {pds.recognitions.map((recognitions, recognitionsIdx) => {
                      return (
                        <div
                          key={recognitionsIdx}
                          className="flex flex-col pl-1 text-sm"
                        >
                          <label>{recognitions.recognition}</label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <div className="pt-2 mr-2 font-bold">
                      Membership in Association:
                    </div>
                    {/* MAP MEMBERSHIP IN ASSOCIATIONS FROM PDS */}
                    {pds.organizations.map((org, orgIdx) => {
                      return (
                        <div
                          key={orgIdx}
                          className="flex flex-col pl-1 text-sm"
                        >
                          <label>{org.organization}</label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col">
                    <div className="pt-2 mr-2 font-bold">
                      Character References:
                    </div>
                    {/* MAP REFERENCES FROM PDS */}
                    {pds.references.map((reference, referenceIdx) => {
                      return (
                        <div
                          key={referenceIdx}
                          className="flex flex-col pb-2 pl-1 text-sm"
                        >
                          <label>Name: {reference.name}</label>
                          <label>Contact: {reference.telephoneNumber}</label>
                          <label>Address: {reference.address}</label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mr-2 font-bold">Spouse:</div>
                  <div className="flex flex-col pl-1">
                    <label>
                      Name: {pds.spouse.firstName} {pds.spouse.lastName}
                    </label>
                    <label>Occupation: {pds.spouse.occupation}</label>
                    <label>Employer: {pds.spouse.employer}</label>
                  </div>

                  <div className="flex flex-col">
                    <div className="pt-2 mr-2 font-bold">Children:</div>
                    {/* MAP FAMILY FROM PDS */}
                    {pds.children.map((c, cIdx) => {
                      return (
                        <div
                          key={cIdx}
                          className="flex flex-col pb-2 pl-1 text-sm"
                        >
                          <label>Name: {c.childName}</label>
                          <label>
                            Birth Date:{' '}
                            {c.birthDate &&
                              dayjs(c.birthDate).format('MMMM DD, YYYY')}
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {/* OTHER DETAILS */}
                  <div className="mr-2 font-bold">
                    Office Relation by Consanguinity / Affinity:
                  </div>
                  <div className="flex flex-col">
                    <div className="pl-1 mr-2">
                      Within 3rd Degree:{' '}
                      {pds.officeRelation.withinThirdDegree.toString()}
                    </div>
                    <div className="pl-1 mr-2">
                      Within 4th Degree:{' '}
                      {pds.officeRelation.withinFourthDegree.toString()}
                    </div>
                    <div className="pl-1 mr-2">Details:</div>
                    <label className="pb-2 pl-2">
                      {pds.officeRelation.details}
                    </label>
                  </div>

                  <div className="mr-2 font-bold">Others:</div>
                  <div className="flex flex-col">
                    <div className="pb-2 pl-1 mr-2">
                      <label className="">
                        Found guilty of administrative office:
                      </label>{' '}
                      {pds.guiltyCharged.isGuilty.toString()}
                    </div>

                    <div className="pl-1 mr-2">
                      <label className="">Been criminally charged: </label>{' '}
                      {pds.guiltyCharged.isCharged.toString()}
                    </div>
                    <div className="pl-1 mr-2">
                      <label className="">Charge Date: </label>
                      <label>
                        {pds.guiltyCharged.chargedDateFiled &&
                          dayjs(pds.guiltyCharged.chargedDateFiled).format(
                            'MMMM DD, YYYY'
                          )}
                      </label>
                    </div>
                    <div className="pl-1 mr-2">
                      <label className="">Status: </label>
                      {pds.guiltyCharged.chargedCaseStatus}
                    </div>
                    <div className="pl-1 mr-2">
                      <label className="">Charge Details:</label>
                    </div>
                    <label className="pb-2 pl-2">
                      {pds.guiltyCharged.guiltyDetails}
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <div className="pl-1 mr-2">
                      <label className="">Been convicted of any Crime: </label>
                      {pds.convicted.isConvicted.toString()}
                    </div>
                    <div className="pl-1 mr-2">
                      <label className="">Conviction Details:</label>
                    </div>
                    <label className="pb-2 pl-2">{pds.convicted.details}</label>
                  </div>

                  <div className="flex flex-col">
                    <div className="mr-2">
                      <label className="">Been separated from Service: </label>
                      {pds.separatedService.isSeparated.toString()}
                    </div>
                    <div className="mr-2">
                      <label className="">Separation Details:</label>
                    </div>
                    <label className="pb-2 pl-2">
                      {pds.separatedService.details}
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <div className="mr-2">
                      <label className="">
                        Been a candidate for Election:{' '}
                      </label>
                      {pds.candidateResigned.isCandidate.toString()}
                    </div>
                    <div className="mr-2">
                      <label className="">Candidacy Details:</label>
                    </div>
                    <label className="pb-2 pl-2">
                      {pds.candidateResigned.candidateDetails}
                    </label>

                    <div className="mr-2">
                      <label className="">
                        Been resigned from Governemnt Service:{' '}
                      </label>
                      {pds.candidateResigned.isResigned.toString()}
                    </div>
                    <div className="mr-2">
                      <label className="">Resignation Details:</label>
                    </div>
                    <label className="pb-2 pl-2">
                      {pds.candidateResigned.resignedDetails}
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <div className="mr-2">
                      <label className="">Member of Indigenous Group: </label>
                      {pds.indigenousPwdSoloParent.isIndigenousMember.toString()}
                    </div>
                    <div className="pb-2 mr-2">
                      <label className="">Indigenous Group: </label>
                      {pds.indigenousPwdSoloParent.indigenousMemberDetails}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="mr-2">
                      <label className="">A Person With Disability: </label>
                      {pds.indigenousPwdSoloParent.isPwd.toString()}
                    </div>
                    <div className="pb-2 mr-2">
                      <label className="">A Solo Parent: </label>
                      {pds.indigenousPwdSoloParent.isSoloParent.toString()}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="mr-2">
                      <label className="">An Immigrant: </label>
                      {pds.immigrant.isImmigrant.toString()}
                    </div>
                    <div className="pb-2 mr-2">
                      <label className="">Details: </label>
                      {pds.immigrant.details}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              className={`${
                appInfoIsOpen ? 'block' : 'hidden'
              } flex flex-col justify-center items-center text-4xl text-slate-400 m-2 h-screen md:flex -mt-14 md:-mt-12`}
            >
              <label className="text-lg uppercase">
                Applicant not yet selected
              </label>
            </div>
          )
        }
      </div>
    </>
  );
};
