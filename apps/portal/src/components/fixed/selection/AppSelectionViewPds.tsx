/* eslint-disable @nx/enforce-module-boundaries */
import { useState } from 'react';
import dayjs from 'dayjs';
import { Pds } from 'apps/pds/src/store/pds.store';
import { Page } from '../pages/Page';

import { CardPreview } from '../../modular/cards/CardPreview';
import { NotApplicableVisual } from '../visuals/NotApplicableVisual';
import { Reference } from 'apps/pds/src/types/data/supporting-info.type';
import { isEmpty } from 'lodash';
import { Organization, Recognition, Skill } from 'apps/pds/src/types/data/other-info.type';
import { LearningDevelopment } from 'apps/pds/src/types/data/lnd.type';
import { VoluntaryWork } from 'apps/pds/src/types/data/vol-work.type';
import { WorkExperience } from 'apps/pds/src/types/data/work.type';
import { Eligibility } from 'apps/pds/src/types/data/eligibility.type';
import { EducationInfo } from 'apps/pds/src/types/data/education.type';
import { Child } from 'apps/pds/src/types/data/family.type';
import { LabelFieldPreview } from '../cards/LabelFieldPreview';
import { CardContainer } from '../cards/CardContainer';
import { CardQuestion, LabelQNA } from '../cards/CardQNA';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';

type AppEndViewPdsProps = {
  pds: Pds;
};

export const AppSelectionViewPds = ({ pds }: AppEndViewPdsProps) => {
  const [appInfoIsOpen, setAppInfoIsOpen] = useState<boolean>(true);

  return (
    <>
      <div className="flex flex-col justify-center">
        <div className="top-0 flex items-center justify-center w-full h-12 px-8 text-2xl font-semibold text-center text-indigo-900 bg-indigo-200 md:justify-center md:static">
          PERSONAL DATA SHEET
        </div>
        {
          // WILL ONLY DISPLAY APPLICANT DETAILS IF ITS NOT EMPTY (NORMALLY DUE TO INVALID/NON EXISTING APPLICANT ID)
          pds && pds.permanentAddress ? (
            <Page title="" subtitle="" pageClassName="pt-5 h-[46rem] ">
              <>
                <div className="min-w-full">
                  <CardContainer title="Basic Information" className="" cols={1}>
                    <>
                      <div className="px-2">
                        <CardPreview title="Personal Information" subtitle="">
                          <>
                            {/* PERSONAL INFO */}
                            <LabelFieldPreview
                              label="Full Name:"
                              field={
                                <>
                                  {pds.personalInfo.firstName && pds.personalInfo.firstName + ' '}
                                  {pds.personalInfo.middleName === 'N/A' ? '' : pds.personalInfo.middleName + ' '}
                                  {pds.personalInfo.lastName && pds.personalInfo.lastName + ' '}
                                  {pds.personalInfo.nameExtension === 'N/A' ? '' : pds.personalInfo.nameExtension}
                                  {!pds.personalInfo.lastName &&
                                    !pds.personalInfo.firstName &&
                                    !pds.personalInfo.middleName &&
                                    !pds.personalInfo.nameExtension &&
                                    'N/A'}
                                </>
                              }
                            />
                            <LabelFieldPreview
                              label="Birthdate:"
                              field={
                                pds.personalInfo.birthDate
                                  ? DateFormatter(pds.personalInfo.birthDate, 'MMMM DD, YYYY')
                                  : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Sex:"
                              field={pds.personalInfo.sex ? pds.personalInfo.sex : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Place of Birth:"
                              field={pds.personalInfo.birthPlace ? pds.personalInfo.birthPlace : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Civil Status:"
                              field={pds.personalInfo.civilStatus ? pds.personalInfo.civilStatus : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Height:"
                              field={pds.personalInfo.height ? pds.personalInfo.height + ' meters' : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Weight:"
                              field={pds.personalInfo.weight ? pds.personalInfo.weight + ' kgs' : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Blood Type:"
                              field={pds.personalInfo.bloodType ? pds.personalInfo.bloodType : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Citizenship:"
                              field={pds.personalInfo.citizenship ? pds.personalInfo.citizenship : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Dual Citizenship Type:"
                              field={
                                pds.personalInfo.citizenshipType && pds.personalInfo.citizenship === 'Dual Citizenship'
                                  ? pds.personalInfo.citizenshipType
                                  : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Country:"
                              field={pds.personalInfo.country ? pds.personalInfo.country : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Telephone No:"
                              field={pds.personalInfo.telephoneNumber ? pds.personalInfo.telephoneNumber : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Mobile No:"
                              field={pds.personalInfo.mobileNumber ? pds.personalInfo.mobileNumber : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Email Address:"
                              field={pds.personalInfo.email ? pds.personalInfo.email : 'N/A'}
                            />
                          </>
                        </CardPreview>
                        <CardPreview title="Government IDs" subtitle="">
                          <>
                            {/* GOVERNMENT IDS */}
                            <LabelFieldPreview
                              label="GSIS No:"
                              field={pds.governmentIssuedIds.gsisNumber ? pds.governmentIssuedIds.gsisNumber : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Pag-ibig No:"
                              field={
                                pds.governmentIssuedIds.pagibigNumber ? pds.governmentIssuedIds.pagibigNumber : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Philhealth No:"
                              field={
                                pds.governmentIssuedIds.philhealthNumber
                                  ? pds.governmentIssuedIds.philhealthNumber
                                  : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="SSS No:"
                              field={pds.governmentIssuedIds.sssNumber ? pds.governmentIssuedIds.sssNumber : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="TIN No:"
                              field={pds.governmentIssuedIds.tinNumber ? pds.governmentIssuedIds.tinNumber : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Agency No:"
                              field={
                                pds.governmentIssuedIds.agencyNumber ? pds.governmentIssuedIds.agencyNumber : 'N/A'
                              }
                            />
                            {/* Contact */}
                          </>
                        </CardPreview>
                        <CardPreview title="Residential Address" subtitle="">
                          <>
                            <LabelFieldPreview
                              label="House/Block/Lot No:"
                              field={pds.residentialAddress.houseNumber ? pds.residentialAddress.houseNumber : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Street:"
                              field={pds.residentialAddress.street ? pds.residentialAddress.street : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Subdivision:"
                              field={pds.residentialAddress.subdivision ? pds.residentialAddress.subdivision : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Barangay:"
                              field={pds.residentialAddress.barangay ? pds.residentialAddress.barangay : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="City:"
                              field={pds.residentialAddress.city ? pds.residentialAddress.city : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Province:"
                              field={pds.residentialAddress.province ? pds.residentialAddress.province : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Zipcode"
                              field={pds.residentialAddress.zipCode ? pds.residentialAddress.zipCode : 'N/A'}
                            />
                          </>
                        </CardPreview>
                        <CardPreview title="Permanent Address" subtitle="">
                          <>
                            <LabelFieldPreview
                              label="House/Block/Lot No:"
                              field={pds.permanentAddress.houseNumber ? pds.permanentAddress.houseNumber : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Street:"
                              field={pds.permanentAddress.street ? pds.permanentAddress.street : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Subdivision:"
                              field={pds.permanentAddress.subdivision ? pds.permanentAddress.subdivision : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Barangay:"
                              field={pds.permanentAddress.barangay ? pds.permanentAddress.barangay : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="City:"
                              field={pds.permanentAddress.city ? pds.permanentAddress.city : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Province:"
                              field={pds.permanentAddress.province ? pds.permanentAddress.province : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Zipcode"
                              field={pds.permanentAddress.zipCode ? pds.permanentAddress.zipCode : 'N/A'}
                            />
                          </>
                        </CardPreview>
                      </div>
                    </>
                  </CardContainer>

                  <CardContainer title="Family Background" className="py-5">
                    <>
                      <div className="px-2">
                        <CardPreview title="Spouse" subtitle="">
                          <>
                            <LabelFieldPreview
                              label="Last Name:"
                              field={pds.spouse.lastName ? pds.spouse.lastName : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="First Name:"
                              field={pds.spouse.firstName ? pds.spouse.firstName : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Middle Name:"
                              field={pds.spouse.middleName ? pds.spouse.middleName : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Name Extension:"
                              field={pds.spouse.nameExtension ? pds.spouse.nameExtension : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Employer/Business Name:"
                              field={pds.spouse.employer ? pds.spouse.employer : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Business Address:"
                              field={pds.spouse.businessAddress ? pds.spouse.businessAddress : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Telephone No:"
                              field={pds.spouse.telephoneNumber ? pds.spouse.telephoneNumber : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Occupation:"
                              field={pds.spouse.occupation ? pds.spouse.occupation : 'N/A'}
                            />
                          </>
                        </CardPreview>
                        <CardPreview title="Father" subtitle="">
                          <>
                            <LabelFieldPreview
                              label="Last Name:"
                              field={pds.parents.fatherLastName ? pds.parents.fatherLastName : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="First Name:"
                              field={pds.parents.fatherFirstName ? pds.parents.fatherFirstName : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Middle Name:"
                              field={pds.parents.fatherMiddleName ? pds.parents.fatherMiddleName : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Name Extension:"
                              field={pds.parents.fatherNameExtension ? pds.parents.fatherNameExtension : 'N/A'}
                            />
                          </>
                        </CardPreview>
                        <CardPreview title="Mother" subtitle="">
                          <>
                            <LabelFieldPreview
                              label="Last Name:"
                              field={pds.parents.motherLastName ? pds.parents.motherLastName : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="First Name:"
                              field={pds.parents.motherFirstName ? pds.parents.motherFirstName : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Middle Name:"
                              field={pds.parents.motherMiddleName ? pds.parents.motherMiddleName : 'N/A'}
                            />
                            {/* <LabelFieldPreview label="Maiden Name:" field={pds.parents.motherMaidenName ? pds.parents.motherMaidenName : 'N/A'} /> */}
                          </>
                        </CardPreview>
                        <CardContainer
                          title="Children Information"
                          titleSize="xl"
                          isArray
                          cols={pds.children.length}
                          titleClassName="font-medium"
                        >
                          <>
                            {pds.children.length === 0 ? (
                              <div className="rounded shadow-sm shadow-slate-200">
                                <NotApplicableVisual />
                              </div>
                            ) : (
                              <>
                                {pds.children.map((child: Child, childIdx: number) => {
                                  const { birthDate, childName } = child;
                                  return (
                                    <div
                                      className="h-30 col-span-1 mb-[0.2%] justify-between border rounded bg-white py-5 px-[5%] text-left align-middle shadow-md hover:border hover:bg-indigo-100"
                                      key={childIdx}
                                    >
                                      <LabelFieldPreview label="Full Name:" field={childName} />
                                      <LabelFieldPreview
                                        label="Birthday:"
                                        field={DateFormatter(birthDate, 'MMMM DD, YYYY')}
                                      />
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </>
                        </CardContainer>
                      </div>
                    </>
                  </CardContainer>

                  <CardContainer title="Educational Background" className="py-5" cols={1}>
                    <>
                      <div className="px-2">
                        <CardContainer title="Elementary Education" titleSize="xl" titleClassName="font-medium" isArray>
                          <>
                            {pds.elementary.schoolName === '' || pds.elementary.schoolName === null ? (
                              <div className="rounded shadow-sm shadow-slate-200">
                                <NotApplicableVisual />
                              </div>
                            ) : (
                              <>
                                <div className="col-span-1 mb-[0.2%] justify-between rounded border bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100">
                                  <LabelFieldPreview
                                    label="School:"
                                    field={pds.elementary.schoolName ? pds.elementary.schoolName : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Basic Education:"
                                    field={pds.elementary.degree ? pds.elementary.degree : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Started:"
                                    field={pds.elementary.from ? pds.elementary.from : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Ended:"
                                    field={pds.elementary.to ? pds.elementary.to : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Highest Level/Units Earned:"
                                    field={pds.elementary.units ? pds.elementary.units : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Graduated:"
                                    field={pds.elementary.yearGraduated ? pds.elementary.yearGraduated : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Academic Honors Received:"
                                    field={pds.elementary.awards ? pds.elementary.awards : 'N/A'}
                                  />
                                </div>
                              </>
                            )}
                          </>
                        </CardContainer>

                        <CardContainer title="Secondary Education" titleSize="xl" titleClassName="font-medium" isArray>
                          <>
                            {pds.secondary.schoolName === '' || pds.secondary.schoolName === null ? (
                              <div className="rounded shadow-sm shadow-slate-200">
                                <NotApplicableVisual />
                              </div>
                            ) : (
                              <>
                                <div className="col-span-1 mb-[0.2%] justify-between border rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100">
                                  <LabelFieldPreview label="School:" field={pds.secondary.schoolName} />
                                  <LabelFieldPreview
                                    label="Basic Education:"
                                    field={pds.secondary.degree ? pds.secondary.degree : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Started:"
                                    field={pds.secondary.from ? pds.secondary.from : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Ended:"
                                    field={pds.secondary.to ? pds.secondary.to : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Highest Level/Units Earned:"
                                    field={pds.secondary.units ? pds.secondary.units : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Graduated:"
                                    field={pds.secondary.yearGraduated ? pds.secondary.yearGraduated : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Academic Honors Received:"
                                    field={pds.secondary.awards ? pds.secondary.awards : 'N/A'}
                                  />
                                </div>
                              </>
                            )}
                          </>
                        </CardContainer>
                        <CardContainer
                          title="Vocational Education"
                          titleSize="xl"
                          titleClassName="font-medium"
                          isArray
                          cols={pds.vocational.length}
                        >
                          <>
                            {pds.vocational.length === 0 ? (
                              <div className="rounded shadow-sm shadow-slate-200">
                                <NotApplicableVisual />
                              </div>
                            ) : (
                              <>
                                {pds.vocational.map((course: EducationInfo, courseIdx: number) => {
                                  const { schoolName, degree, from, to, units, yearGraduated, awards } = course;
                                  return (
                                    <div
                                      key={courseIdx}
                                      className="col-span-1 mb-[0.2%] justify-between border rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                                    >
                                      <LabelFieldPreview label="School:" field={schoolName ? schoolName : 'N/A'} />
                                      <LabelFieldPreview label="Degree/Course:" field={degree ? degree : 'N/A'} />
                                      <LabelFieldPreview label="Year Started:" field={from ? from : 'N/A'} />
                                      <LabelFieldPreview
                                        label="Year Ended:"
                                        field={
                                          (isEmpty(to.toString()) || to === null) &&
                                          (isEmpty(yearGraduated.toString()) || yearGraduated === null)
                                            ? 'Present'
                                            : to
                                        }
                                      />
                                      <LabelFieldPreview
                                        label="Highest Level/Units Earned:"
                                        field={units ? units : 'N/A'}
                                      />
                                      <LabelFieldPreview
                                        label="Year Graduated:"
                                        field={yearGraduated ? yearGraduated : 'N/A'}
                                      />
                                      <LabelFieldPreview
                                        label="Academic Honors Received:"
                                        field={awards ? awards : 'N/A'}
                                      />
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </>
                        </CardContainer>
                        <CardContainer
                          title="College Education"
                          titleSize="xl"
                          titleClassName="font-medium"
                          isArray
                          cols={pds.college.length}
                        >
                          <>
                            {pds.college.length === 0 ? (
                              <div className="rounded shadow-sm shadow-slate-200">
                                <NotApplicableVisual />
                              </div>
                            ) : (
                              <>
                                {pds.college.map((course: EducationInfo, courseIdx: number) => {
                                  const { schoolName, degree, from, to, units, yearGraduated, awards } = course;

                                  return (
                                    <div
                                      key={courseIdx}
                                      className="col-span-1 mb-[0.2%] justify-between rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100"
                                    >
                                      <LabelFieldPreview label="School:" field={schoolName ? schoolName : 'N/A'} />
                                      <LabelFieldPreview label="Degree/Course:" field={degree ? degree : 'N/A'} />
                                      <LabelFieldPreview label="Year Started:" field={from ? from : 'N/A'} />
                                      <LabelFieldPreview
                                        label="Year Ended:"
                                        field={
                                          (isEmpty(to.toString()) || to === null) &&
                                          (isEmpty(yearGraduated.toString()) || yearGraduated === null)
                                            ? 'Present'
                                            : to
                                        }
                                      />
                                      <LabelFieldPreview
                                        label="Highest Level/Units Earned:"
                                        field={units ? units : 'N/A'}
                                      />
                                      <LabelFieldPreview
                                        label="Year Graduated:"
                                        field={yearGraduated ? yearGraduated : 'N/A'}
                                      />
                                      <LabelFieldPreview
                                        label="Academic Honors Received:"
                                        field={awards ? awards : 'N/A'}
                                      />
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </>
                        </CardContainer>
                        <CardContainer
                          title="Graduate Education"
                          titleSize="xl"
                          titleClassName="font-medium"
                          isArray
                          cols={pds.graduate.length}
                        >
                          <>
                            {pds.graduate.length === 0 ? (
                              <div className="rounded shadow-sm shadow-slate-200">
                                <NotApplicableVisual />
                              </div>
                            ) : (
                              <>
                                {pds.graduate.map((course: EducationInfo, courseIdx: number) => {
                                  const { schoolName, degree, from, to, units, yearGraduated, awards } = course;
                                  return (
                                    <div
                                      key={courseIdx}
                                      className="col-span-1 mb-[0.2%] justify-between rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100"
                                    >
                                      <LabelFieldPreview label="School:" field={schoolName ? schoolName : 'N/A'} />
                                      <LabelFieldPreview label="Degree/Course:" field={degree ? degree : 'N/A'} />
                                      <LabelFieldPreview label="Year Started:" field={from ? from : 'N/A'} />
                                      <LabelFieldPreview
                                        label="Year Ended:"
                                        field={
                                          (isEmpty(to.toString()) || to === null) &&
                                          (isEmpty(yearGraduated.toString()) || yearGraduated === null)
                                            ? 'Present'
                                            : to
                                        }
                                      />
                                      <LabelFieldPreview
                                        label="Highest Level/Units Earned:"
                                        field={units ? units : 'N/A'}
                                      />
                                      <LabelFieldPreview
                                        label="Year Graduated:"
                                        field={yearGraduated ? yearGraduated : 'N/A'}
                                      />
                                      <LabelFieldPreview
                                        label="Academic Honors Received:"
                                        field={awards ? awards : 'N/A'}
                                      />
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </>
                        </CardContainer>
                      </div>
                    </>
                  </CardContainer>

                  <CardContainer title="Eligibility" className="py-5">
                    <>
                      <div className="px-2">
                        {pds.eligibility.length === 0 ? (
                          <div className="rounded shadow-sm shadow-slate-200">
                            <NotApplicableVisual />
                          </div>
                        ) : (
                          <>
                            {pds.eligibility.map((elig: Eligibility, eligIdx: number) => {
                              const {
                                name,
                                rating,
                                examDateFrom,
                                examDateTo,
                                examPlace,
                                licenseNumber,
                                examDate,
                                validity,
                              } = elig;

                              return (
                                <div
                                  key={eligIdx}
                                  className="col-span-1 mb-[0.2%] justify-between border rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100"
                                >
                                  <LabelFieldPreview label="Name:" field={name ? name : 'N/A'} />
                                  <LabelFieldPreview label="Rating:" field={rating ? rating : 'N/A'} />
                                  <LabelFieldPreview
                                    label="Exam Date From:"
                                    field={examDate.from ? DateFormatter(examDate.from, 'MMMM DD, YYYY') : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Exam Date To:"
                                    field={examDate.to ? DateFormatter(examDate.to, 'MMMM DD, YYYY') : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Place of Examination:"
                                    field={examPlace ? examPlace : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="License Number:"
                                    field={licenseNumber ? licenseNumber : 'N/A'}
                                  />
                                  <LabelFieldPreview label="Validity:" field={validity ? validity.toString() : 'N/A'} />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </>
                  </CardContainer>
                  <CardContainer title="Work Experience" className="py-5">
                    <>
                      <div className="px-2">
                        {pds.workExperience.length === 0 ? (
                          <div className="rounded shadow-sm shadow-slate-200">
                            <NotApplicableVisual />
                          </div>
                        ) : (
                          <>
                            {pds.workExperience.map((work: WorkExperience, workIdx: number) => {
                              const {
                                positionTitle,
                                companyName,
                                from,
                                to,
                                monthlySalary,
                                isGovernmentService,
                                salaryGrade,
                                appointmentStatus,
                              } = work;
                              return (
                                <div
                                  key={workIdx}
                                  className="col-span-1 mb-[0.2%] justify-between border rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                                >
                                  <LabelFieldPreview
                                    label="Position Title:"
                                    field={positionTitle ? positionTitle : 'N/A'}
                                  />
                                  <LabelFieldPreview label="Company Name:" field={companyName ? companyName : 'N/A'} />
                                  <LabelFieldPreview
                                    label="Date From:"
                                    field={from ? DateFormatter(from, 'MMMM DD, YYYY') : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Date To:"
                                    field={to ? DateFormatter(to, 'MMMM DD, YYYY') : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Monthly Salary:"
                                    field={monthlySalary ? monthlySalary : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Government Service:"
                                    field={
                                      isGovernmentService.toString() === 'true'
                                        ? 'Yes'
                                        : isGovernmentService.toString() === 'false'
                                        ? 'No'
                                        : 'N/A'
                                    }
                                  />
                                  <LabelFieldPreview
                                    label="Salary Grade:"
                                    field={salaryGrade ? salaryGrade : <span className="text-black">N/A</span>}
                                  />
                                  <LabelFieldPreview
                                    label="Appointment Status:"
                                    field={appointmentStatus ? appointmentStatus : 'N/A'}
                                  />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </>
                  </CardContainer>

                  <CardContainer title="Voluntary Work Experience" className="py-5">
                    <>
                      <div className="px-2">
                        {pds.voluntaryWork.length === 0 ? (
                          <div className="rounded shadow-sm shadow-slate-200">
                            <NotApplicableVisual />
                          </div>
                        ) : (
                          <>
                            {pds.voluntaryWork.map((work: VoluntaryWork, workIdx) => {
                              const { position, organizationName, from, to, numberOfHours } = work;
                              return (
                                <div
                                  key={workIdx}
                                  className="col-span-1 mb-[0.2%] justify-between border rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                                >
                                  <LabelFieldPreview label="Position Title:" field={position ? position : 'N/A'} />
                                  <LabelFieldPreview
                                    label="Organization:"
                                    field={organizationName ? organizationName : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Date From:"
                                    field={from ? DateFormatter(from, 'MMMM DD, YYYY') : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Date To:"
                                    field={to ? DateFormatter(to, 'MMMM DD, YYYY') : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Number of Hours:"
                                    field={numberOfHours ? numberOfHours : 'N/A'}
                                  />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </>
                  </CardContainer>
                  <CardContainer title="Learning and Development" className="py-5">
                    <>
                      <div className="px-2">
                        {pds.learningDevelopment.length === 0 ? (
                          <div className="rounded shadow-sm shadow-slate-200">
                            <NotApplicableVisual />
                          </div>
                        ) : (
                          <>
                            {pds.learningDevelopment.map((training: LearningDevelopment, trainingIdx: number) => {
                              const { title, conductedBy, from, to, numberOfHours, type } = training;

                              return (
                                <div
                                  key={trainingIdx}
                                  className="col-span-1 mb-[0.2%] justify-between border rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                                >
                                  <LabelFieldPreview label="Title:" field={title ? title : 'N/A'} />
                                  <LabelFieldPreview label="Conducted by:" field={conductedBy ? conductedBy : 'N/A'} />
                                  <LabelFieldPreview
                                    label="Date From:"
                                    field={from ? DateFormatter(from, 'MMMM DD, YYYY') : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Date To:"
                                    field={to ? DateFormatter(to, 'MMMM DD, YYYY') : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Number of Hours:"
                                    field={numberOfHours ? numberOfHours : 'N/A'}
                                  />
                                  <LabelFieldPreview label="Type:" field={type ? type : 'N/A'} />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </>
                  </CardContainer>
                  <CardContainer title="Skills" className="py-5">
                    <>
                      <div className="px-2">
                        {pds.skills.length === 0 ? (
                          <div className="rounded shadow-sm shadow-slate-200">
                            <NotApplicableVisual />
                          </div>
                        ) : (
                          <>
                            {pds.skills.map((title: Skill, titleIdx: number) => {
                              const { skill } = title;
                              return (
                                <div
                                  key={titleIdx}
                                  className="col-span-1 mb-[0.2%] justify-between border rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                                >
                                  <LabelFieldPreview label="Title" field={skill ? skill : 'N/A'} />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </>
                  </CardContainer>
                  <CardContainer title="Non-Academic Distinctions & Recognitions" className="py-5">
                    <>
                      <div className="px-2">
                        {pds.recognitions.length === 0 ? (
                          <div className="rounded shadow-sm shadow-slate-200">
                            <NotApplicableVisual />
                          </div>
                        ) : (
                          <>
                            {pds.recognitions.map((recog: Recognition, recogIdx: number) => {
                              const { recognition } = recog;
                              return (
                                <div
                                  key={recogIdx}
                                  className="col-span-1 mb-[0.2%] justify-between border rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                                >
                                  <LabelFieldPreview label="Title" field={recognition ? recognition : 'N/A'} />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </>
                  </CardContainer>
                  <CardContainer title="Membership in Organizations" className="py-5">
                    <>
                      <div className="px-2">
                        {pds.organizations.length === 0 ? (
                          <div className="rounded shadow-sm shadow-slate-200">
                            <NotApplicableVisual />
                          </div>
                        ) : (
                          <>
                            {pds.organizations.map((membership: Organization, membershipIdx: number) => {
                              const { organization } = membership;
                              return (
                                <div
                                  key={membershipIdx}
                                  className="col-span-1 mb-[0.2%] justify-between border rounded bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                                >
                                  <LabelFieldPreview label="Title" field={organization ? organization : 'N/A'} />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </>
                  </CardContainer>
                  <CardContainer title="Questions" className="py-5">
                    <>
                      <div className="flex flex-col gap-4 px-2">
                        <CardQuestion
                          mainQuestion='Are you related by consanguinity or affinity to the appointing or recommending authority, or to the chief of bureau or office or to the
                      person who has immediate supervision over you in the Office, Bureau or Department where you will be apppointed,"'
                        >
                          <>
                            <LabelQNA
                              question="a. Within the third degree?"
                              cols={3}
                              answer={pds.officeRelation.withinThirdDegree.toString() === 'true' ? 'Yes' : 'No'}
                              details1=""
                            />
                            <LabelQNA
                              question="b. Within the fourth degree (for Local Government Unit - Career Employees)?"
                              cols={3}
                              answer={pds.officeRelation.withinFourthDegree.toString() === 'true' ? 'Yes' : 'No'}
                              details1=""
                            />
                            <LabelQNA
                              question="Details"
                              answer={
                                (isEmpty(pds.officeRelation.details) &&
                                  pds.officeRelation.withinThirdDegree.toString() === 'true') ||
                                (isEmpty(pds.officeRelation.details) &&
                                  pds.officeRelation.withinFourthDegree.toString() === 'true') ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.officeRelation.details
                                )
                              }
                              details1=""
                            />
                          </>
                        </CardQuestion>
                        <CardQuestion>
                          <>
                            <LabelQNA
                              question="a. Have you ever been found guilty of any administrative offense?"
                              answer={pds.guiltyCharged.isGuilty.toString() === 'true' ? 'Yes' : 'No'}
                              details1={
                                isEmpty(pds.guiltyCharged.guiltyDetails) &&
                                pds.guiltyCharged.isGuilty.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.guiltyCharged.guiltyDetails
                                )
                              }
                            />
                            <LabelQNA
                              cols={4}
                              question="b. Have you been criminally charged before any court?"
                              answer={pds.guiltyCharged.isCharged.toString() === 'true' ? 'Yes' : 'No'}
                              details1={
                                (isEmpty(pds.guiltyCharged.chargedDateFiled) ||
                                  pds.guiltyCharged.chargedDateFiled !== null) &&
                                pds.guiltyCharged.isCharged.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.guiltyCharged.chargedDateFiled
                                )
                              }
                              details2={
                                isEmpty(pds.guiltyCharged.chargedCaseStatus) &&
                                pds.guiltyCharged.isCharged.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.guiltyCharged.chargedCaseStatus
                                )
                              }
                            />
                          </>
                        </CardQuestion>
                        <CardQuestion>
                          <>
                            <LabelQNA
                              question=" Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?"
                              answer={pds.convicted.isConvicted.toString() === 'true' ? 'Yes' : 'No'}
                              details1={
                                isEmpty(pds.convicted.details) && pds.convicted.isConvicted.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.convicted.details
                                )
                              }
                            />
                          </>
                        </CardQuestion>
                        <CardQuestion>
                          <>
                            <LabelQNA
                              question=" Have you ever been separated from the service in any of the following modes: resignation, retirement, dropped from the rolls, dismissal,
                      termination, end of term, finished contract or phased out (abolition) in the public or private sector?"
                              answer={pds.separatedService.isSeparated.toString() === 'true' ? 'Yes' : 'No'}
                              details1={
                                isEmpty(pds.separatedService.details) &&
                                pds.separatedService.isSeparated.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.separatedService.details
                                )
                              }
                            />
                          </>
                        </CardQuestion>
                        <CardQuestion>
                          <>
                            <LabelQNA
                              question={
                                'a. Have you ever been a candidate in a national or local election held within the last year (except Barangay election)?'
                              }
                              answer={pds.candidateResigned.isCandidate.toString() === 'true' ? 'Yes' : 'No'}
                              details1={
                                isEmpty(pds.candidateResigned.candidateDetails) &&
                                pds.candidateResigned.isCandidate.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.candidateResigned.candidateDetails
                                )
                              }
                            />
                            <LabelQNA
                              question={
                                'b. Have you resigned from the government service during the three (3)-month period before the last election to promote/actively campaign for a national or local candidate?'
                              }
                              answer={pds.candidateResigned.isResigned.toString() === 'true' ? 'Yes' : 'No'}
                              details1={
                                isEmpty(pds.candidateResigned.resignedDetails) &&
                                pds.candidateResigned.isResigned.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.candidateResigned.resignedDetails
                                )
                              }
                            />
                          </>
                        </CardQuestion>

                        <CardQuestion>
                          <>
                            <LabelQNA
                              question={
                                'Have you acquired the status of an immigrant or permanent resident of another country?'
                              }
                              answer={pds.immigrant.isImmigrant.toString() === 'true' ? 'Yes' : 'No'}
                              details1={
                                isEmpty(pds.immigrant.details) && pds.immigrant.isImmigrant.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.immigrant.details
                                )
                              }
                            />
                          </>
                        </CardQuestion>

                        <CardQuestion mainQuestion="Pursuant to: (a) Indigenous People's Act (RA 8371); (b) Magna Carta for Disabled Persons (RA 7277); and (c) Solo pds.parents Welfare Act of 2000 (RA 8972), please answer the following items:">
                          <>
                            <LabelQNA
                              question={'a. Are you a member of any indigenous group?'}
                              answer={
                                pds.indigenousPwdSoloParent.isIndigenousMember.toString() === 'true' ? 'Yes' : 'No'
                              }
                              details1={
                                isEmpty(pds.indigenousPwdSoloParent.indigenousMemberDetails) &&
                                pds.indigenousPwdSoloParent.isIndigenousMember.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.indigenousPwdSoloParent.indigenousMemberDetails
                                )
                              }
                            />
                            <LabelQNA
                              question={'b. Are you a person with disability?'}
                              answer={pds.indigenousPwdSoloParent.isPwd.toString() === 'true' ? 'Yes' : 'No'}
                              details1={
                                isEmpty(pds.indigenousPwdSoloParent.pwdIdNumber) &&
                                pds.indigenousPwdSoloParent.isPwd.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.indigenousPwdSoloParent.pwdIdNumber
                                )
                              }
                            />
                            <LabelQNA
                              question={'c. Are you a solo parent?'}
                              answer={pds.indigenousPwdSoloParent.isSoloParent.toString() === 'true' ? 'Yes' : 'No'}
                              details1={
                                isEmpty(pds.indigenousPwdSoloParent.soloParentIdNumber) &&
                                pds.indigenousPwdSoloParent.isSoloParent.toString() === 'true' ? (
                                  <span className="text-sm text-indigo-600">No answer provided</span>
                                ) : (
                                  pds.indigenousPwdSoloParent.soloParentIdNumber
                                )
                              }
                            />
                          </>
                        </CardQuestion>
                      </div>
                    </>
                  </CardContainer>
                  <CardContainer title="References" className="py-5">
                    <>
                      <div className="flex flex-col gap-4 px-2">
                        {pds.references.length === 0 ? (
                          <div className="rounded shadow-sm shadow-slate-200">
                            <NotApplicableVisual />
                          </div>
                        ) : (
                          <>
                            {pds.references.map((reference: Reference, refIdx: number) => {
                              const { name, address, telephoneNumber } = reference;
                              return (
                                <div
                                  key={refIdx}
                                  className="col-span-1 mb-[0.2%] justify-between rounded border bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100"
                                >
                                  <LabelFieldPreview
                                    label="Name: "
                                    field={
                                      name ? (
                                        name
                                      ) : (
                                        <span className="text-indigo-500 hover:text-indigo-900">No data provided</span>
                                      )
                                    }
                                  />
                                  <LabelFieldPreview
                                    label="Address: "
                                    field={
                                      address ? (
                                        address
                                      ) : (
                                        <span className="text-indigo-500 hover:text-indigo-900">No data provided</span>
                                      )
                                    }
                                  />
                                  <LabelFieldPreview
                                    label="Telephone Number: "
                                    field={
                                      telephoneNumber ? (
                                        telephoneNumber
                                      ) : (
                                        <span className="text-indigo-500 hover:text-indigo-900">No data provided</span>
                                      )
                                    }
                                  />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    </>
                  </CardContainer>
                  <CardContainer title="Presented Government ID" className="py-5">
                    <>
                      <div className="px-2">
                        <CardPreview title="" subtitle="">
                          <>
                            <LabelFieldPreview
                              label="Government ID: "
                              field={pds.governmentIssuedId.issuedId ? pds.governmentIssuedId.issuedId : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="ID number: "
                              field={pds.governmentIssuedId.idNumber ? pds.governmentIssuedId.idNumber : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Issued Date: "
                              field={
                                pds.governmentIssuedId.issueDate
                                  ? DateFormatter(pds.governmentIssuedId.issueDate, 'MMMM DD, YYYY')
                                  : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Issued Place"
                              field={pds.governmentIssuedId.issuePlace ? pds.governmentIssuedId.issuePlace : 'N/A'}
                            />
                          </>
                        </CardPreview>
                      </div>
                    </>
                  </CardContainer>
                </div>
              </>
            </Page>
          ) : (
            <div
              className={`${
                appInfoIsOpen ? 'block' : 'hidden'
              } flex flex-col justify-center items-center text-4xl text-slate-400 m-2 h-screen md:flex -mt-14 md:-mt-12`}
            >
              <label className="text-lg uppercase">No PDS found</label>
            </div>
          )
        }
      </div>
    </>
  );
};
