/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CardPreview } from '../../modular/cards/CardPreview';
import { CardContainer } from '../card/CardContainer';
import { LabelFieldPreview } from '../card/LabelFieldPreview';
import { NotApplicableVisual } from '../visuals/NotApplicableVisual';
import { isEmpty } from 'lodash';
import { CardQuestion, LabelQNA } from '../card/CardQNA';
import { Page } from '../../modular/pages/Page';
import { PrevButton } from '../navigation/button/PrevButton';
import { NextButton } from '../navigation/button/NextButton';
import { Eligibility } from '../../../types/data/eligibility.type';
import { Child } from '../../../types/data/family.type';
import { LearningDevelopment } from '../../../types/data/lnd.type';
import { VoluntaryWork } from '../../../types/data/vol-work.type';
import { WorkExperience } from '../../../types/data/work.type';
import { EducationInfo } from '../../../types/data/education.type';
import {
  Organization,
  Recognition,
  Skill,
} from '../../../types/data/other-info.type';
import { Reference } from '../../../types/data/supporting-info.type';
import { usePdsStore } from '../../../store/pds.store';
import { useTabStore } from '../../../store/tab.store';
import { HeadContainer } from '../head/Head';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';

export default function ReviewPanel(): JSX.Element {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const hasPds = useEmployeeStore((state) => state.hasPds);

  // call the following objects from pds store
  const personalInfo = usePdsStore((state) => state.personalInfo);
  const governmentIssuedIds = usePdsStore((state) => state.governmentIssuedIds);
  const residentialAddress = usePdsStore((state) => state.residentialAddress);
  const permanentAddress = usePdsStore((state) => state.permanentAddress);
  const spouse = usePdsStore((state) => state.spouse);
  const parents = usePdsStore((state) => state.parents);
  const children = usePdsStore((state) => state.children);
  const elementary = usePdsStore((state) => state.elementary);
  const secondary = usePdsStore((state) => state.secondary);
  const college = usePdsStore((state) => state.college);
  const vocational = usePdsStore((state) => state.vocational);
  const graduate = usePdsStore((state) => state.graduate);
  const eligibility = usePdsStore((state) => state.eligibility);
  const workExperience = usePdsStore((state) => state.workExperience);
  const voluntaryWork = usePdsStore((state) => state.voluntaryWork);
  const learningDevelopment = usePdsStore((state) => state.learningDevelopment);
  const skills = usePdsStore((state) => state.skills);
  const recognitions = usePdsStore((state) => state.recognitions);
  const organizations = usePdsStore((state) => state.organizations);
  const officeRelation = usePdsStore((state) => state.officeRelation);
  const convicted = usePdsStore((state) => state.convicted);
  const separatedService = usePdsStore((state) => state.separatedService);
  const candidateResigned = usePdsStore((state) => state.candidateResigned);
  const immigrant = usePdsStore((state) => state.immigrant);
  const indigenousPwdSoloParent = usePdsStore(
    (state) => state.indigenousPwdSoloParent
  );
  const references = usePdsStore((state) => state.references);
  const governmentIssuedId = usePdsStore((state) => state.governmentIssuedId);
  const guiltyCharged = usePdsStore((state) => state.guiltyCharged);

  return (
    <>
      <HeadContainer title="PDS - Review" />
      <Page title="" subtitle="">
        <>
          <div className="min-w-full">
            <CardContainer title="Basic Information" className="py-5" cols={1}>
              <>
                <div className="px-5">
                  <CardPreview title="Personal Information" subtitle="">
                    <>
                      {/* PERSONAL INFO */}
                      <LabelFieldPreview
                        label="Full Name:"
                        field={
                          <>
                            {personalInfo.firstName &&
                              personalInfo.firstName + ' '}
                            {personalInfo.middleName === 'N/A'
                              ? ''
                              : personalInfo.middleName + ' '}
                            {personalInfo.lastName &&
                              personalInfo.lastName + ' '}
                            {personalInfo.nameExtension === 'N/A'
                              ? ''
                              : personalInfo.nameExtension}
                            {!personalInfo.lastName &&
                              !personalInfo.firstName &&
                              !personalInfo.middleName &&
                              !personalInfo.nameExtension &&
                              'N/A'}
                          </>
                        }
                      />
                      <LabelFieldPreview
                        label="Birthdate:"
                        field={
                          personalInfo.birthDate
                            ? personalInfo.birthDate
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Sex:"
                        field={personalInfo.sex ? personalInfo.sex : 'N/A'}
                      />
                      <LabelFieldPreview
                        label="Place of Birth:"
                        field={
                          personalInfo.birthPlace
                            ? personalInfo.birthPlace
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Civil Status:"
                        field={
                          personalInfo.civilStatus
                            ? personalInfo.civilStatus
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Height:"
                        field={
                          personalInfo.height
                            ? personalInfo.height + ' meters'
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Weight:"
                        field={
                          personalInfo.weight
                            ? personalInfo.weight + ' kgs'
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Blood Type:"
                        field={
                          personalInfo.bloodType
                            ? personalInfo.bloodType
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Citizenship:"
                        field={
                          personalInfo.citizenship
                            ? personalInfo.citizenship
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Dual Citizenship Type:"
                        field={
                          personalInfo.citizenshipType &&
                          personalInfo.citizenship === 'Dual Citizenship'
                            ? personalInfo.citizenshipType
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Country:"
                        field={
                          personalInfo.country ? personalInfo.country : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Telephone No:"
                        field={
                          personalInfo.telephoneNumber
                            ? personalInfo.telephoneNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Mobile No:"
                        field={
                          personalInfo.mobileNumber
                            ? personalInfo.mobileNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Email Address:"
                        field={personalInfo.email ? personalInfo.email : 'N/A'}
                      />
                    </>
                  </CardPreview>
                  <CardPreview title="Government IDs" subtitle="">
                    <>
                      {/* GOVERNMENT IDS */}
                      <LabelFieldPreview
                        label="GSIS No:"
                        field={
                          governmentIssuedIds.gsisNumber
                            ? governmentIssuedIds.gsisNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Pag-ibig No:"
                        field={
                          governmentIssuedIds.pagibigNumber
                            ? governmentIssuedIds.pagibigNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Philhealth No:"
                        field={
                          governmentIssuedIds.philhealthNumber
                            ? governmentIssuedIds.philhealthNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="SSS No:"
                        field={
                          governmentIssuedIds.sssNumber
                            ? governmentIssuedIds.sssNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="TIN No:"
                        field={
                          governmentIssuedIds.tinNumber
                            ? governmentIssuedIds.tinNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Agency No:"
                        field={
                          governmentIssuedIds.agencyNumber
                            ? governmentIssuedIds.agencyNumber
                            : 'N/A'
                        }
                      />
                      {/* Contact */}
                    </>
                  </CardPreview>
                  <CardPreview title="Residential Address" subtitle="">
                    <>
                      <LabelFieldPreview
                        label="House/Block/Lot No:"
                        field={
                          residentialAddress.houseNumber
                            ? residentialAddress.houseNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Street:"
                        field={
                          residentialAddress.street
                            ? residentialAddress.street
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Subdivision:"
                        field={
                          residentialAddress.subdivision
                            ? residentialAddress.subdivision
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Barangay:"
                        field={
                          residentialAddress.barangay
                            ? residentialAddress.barangay
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="City:"
                        field={
                          residentialAddress.city
                            ? residentialAddress.city
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Province:"
                        field={
                          residentialAddress.province
                            ? residentialAddress.province
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Zipcode"
                        field={
                          residentialAddress.zipCode
                            ? residentialAddress.zipCode
                            : 'N/A'
                        }
                      />
                    </>
                  </CardPreview>
                  <CardPreview title="Permanent Address" subtitle="">
                    <>
                      <LabelFieldPreview
                        label="House/Block/Lot No:"
                        field={
                          permanentAddress.houseNumber
                            ? permanentAddress.houseNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Street:"
                        field={
                          permanentAddress.street
                            ? permanentAddress.street
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Subdivision:"
                        field={
                          permanentAddress.subdivision
                            ? permanentAddress.subdivision
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Barangay:"
                        field={
                          permanentAddress.barangay
                            ? permanentAddress.barangay
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="City:"
                        field={
                          permanentAddress.city ? permanentAddress.city : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Province:"
                        field={
                          permanentAddress.province
                            ? permanentAddress.province
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Zipcode"
                        field={
                          permanentAddress.zipCode
                            ? permanentAddress.zipCode
                            : 'N/A'
                        }
                      />
                    </>
                  </CardPreview>
                </div>
              </>
            </CardContainer>

            <CardContainer title="Family Background" className="py-5">
              <>
                <div className="px-5">
                  <CardPreview title="Spouse" subtitle="">
                    <>
                      <LabelFieldPreview
                        label="Last Name:"
                        field={spouse.lastName ? spouse.lastName : 'N/A'}
                      />
                      <LabelFieldPreview
                        label="First Name:"
                        field={spouse.firstName ? spouse.firstName : 'N/A'}
                      />
                      <LabelFieldPreview
                        label="Middle Name:"
                        field={spouse.middleName ? spouse.middleName : 'N/A'}
                      />
                      <LabelFieldPreview
                        label="Name Extension:"
                        field={
                          spouse.nameExtension ? spouse.nameExtension : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Employer/Business Name:"
                        field={spouse.employer ? spouse.employer : 'N/A'}
                      />
                      <LabelFieldPreview
                        label="Business Address:"
                        field={
                          spouse.businessAddress
                            ? spouse.businessAddress
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Telephone No:"
                        field={
                          spouse.telephoneNumber
                            ? spouse.telephoneNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Occupation:"
                        field={spouse.occupation ? spouse.occupation : 'N/A'}
                      />
                    </>
                  </CardPreview>
                  <CardPreview title="Father" subtitle="">
                    <>
                      <LabelFieldPreview
                        label="Last Name:"
                        field={
                          parents.fatherLastName
                            ? parents.fatherLastName
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="First Name:"
                        field={
                          parents.fatherFirstName
                            ? parents.fatherFirstName
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Middle Name:"
                        field={
                          parents.fatherMiddleName
                            ? parents.fatherMiddleName
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Name Extension:"
                        field={
                          parents.fatherNameExtension
                            ? parents.fatherNameExtension
                            : 'N/A'
                        }
                      />
                    </>
                  </CardPreview>
                  <CardPreview title="Mother" subtitle="">
                    <>
                      <LabelFieldPreview
                        label="Last Name:"
                        field={
                          parents.motherLastName
                            ? parents.motherLastName
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="First Name:"
                        field={
                          parents.motherFirstName
                            ? parents.motherFirstName
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Middle Name:"
                        field={
                          parents.motherMiddleName
                            ? parents.motherMiddleName
                            : 'N/A'
                        }
                      />
                      {/* <LabelFieldPreview label="Maiden Name:" field={parents.motherMaidenName ? parents.motherMaidenName : 'N/A'} /> */}
                    </>
                  </CardPreview>
                  <CardContainer
                    title="Children Information"
                    titleSize="xl"
                    isArray
                    cols={children.length}
                    titleClassName="font-medium"
                  >
                    <>
                      {children.length === 0 ? (
                        <div className="shadow-sm rounded-3xl shadow-slate-200">
                          <NotApplicableVisual />
                        </div>
                      ) : (
                        <>
                          {children.map((child: Child, childIdx: number) => {
                            const { birthDate, childName } = child;
                            return (
                              <div
                                className="h-30 col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-5 px-[5%] text-left align-middle shadow-md hover:border hover:bg-indigo-100"
                                key={childIdx}
                              >
                                <LabelFieldPreview
                                  label="Full Name:"
                                  field={childName}
                                />
                                <LabelFieldPreview
                                  label="Birthday:"
                                  field={birthDate}
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

            <CardContainer
              title="Educational Background"
              className="py-5"
              cols={1}
            >
              <>
                <div className="px-5">
                  <CardContainer
                    title="Elementary Education"
                    titleSize="xl"
                    titleClassName="font-medium"
                    isArray
                  >
                    <>
                      {elementary.schoolName === '' ||
                      elementary.schoolName === null ? (
                        <div className="shadow-sm rounded-3xl shadow-slate-200">
                          <NotApplicableVisual />
                        </div>
                      ) : (
                        <>
                          <div className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100">
                            <LabelFieldPreview
                              label="School:"
                              field={
                                elementary.schoolName
                                  ? elementary.schoolName
                                  : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Basic Education:"
                              field={
                                elementary.degree ? elementary.degree : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Year Started:"
                              field={elementary.from ? elementary.from : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Year Ended:"
                              field={elementary.to ? elementary.to : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Highest Level/Units Earned:"
                              field={
                                elementary.units ? elementary.units : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Year Graduated:"
                              field={
                                elementary.yearGraduated
                                  ? elementary.yearGraduated
                                  : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Academic Honors Received:"
                              field={
                                elementary.awards ? elementary.awards : 'N/A'
                              }
                            />
                          </div>
                        </>
                      )}
                    </>
                  </CardContainer>

                  <CardContainer
                    title="Secondary Education"
                    titleSize="xl"
                    titleClassName="font-medium"
                    isArray
                  >
                    <>
                      {secondary.schoolName === '' ||
                      secondary.schoolName === null ? (
                        <div className="shadow-sm rounded-3xl shadow-slate-200">
                          <NotApplicableVisual />
                        </div>
                      ) : (
                        <>
                          <div className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100">
                            <LabelFieldPreview
                              label="School:"
                              field={secondary.schoolName}
                            />
                            <LabelFieldPreview
                              label="Basic Education:"
                              field={
                                secondary.degree ? secondary.degree : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Year Started:"
                              field={secondary.from ? secondary.from : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Year Ended:"
                              field={secondary.to ? secondary.to : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Highest Level/Units Earned:"
                              field={secondary.units ? secondary.units : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Year Graduated:"
                              field={
                                secondary.yearGraduated
                                  ? secondary.yearGraduated
                                  : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Academic Honors Received:"
                              field={
                                secondary.awards ? secondary.awards : 'N/A'
                              }
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
                    cols={vocational.length}
                  >
                    <>
                      {vocational.length === 0 ? (
                        <div className="shadow-sm rounded-3xl shadow-slate-200">
                          <NotApplicableVisual />
                        </div>
                      ) : (
                        <>
                          {vocational.map(
                            (course: EducationInfo, courseIdx: number) => {
                              const {
                                schoolName,
                                degree,
                                from,
                                to,
                                units,
                                yearGraduated,
                                awards,
                              } = course;
                              return (
                                <div
                                  key={courseIdx}
                                  className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                                >
                                  <LabelFieldPreview
                                    label="School:"
                                    field={schoolName ? schoolName : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Degree/Course:"
                                    field={degree ? degree : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Started:"
                                    field={from ? from : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Ended:"
                                    field={
                                      isEmpty(to.toString()) &&
                                      isEmpty(yearGraduated.toString())
                                        ? 'Present'
                                        : !isEmpty(to.toString()) &&
                                          !isEmpty(yearGraduated.toString())
                                        ? yearGraduated
                                        : 'N/A'
                                    }
                                  />
                                  <LabelFieldPreview
                                    label="Highest Level/Units Earned:"
                                    field={units ? units : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Graduated:"
                                    field={
                                      yearGraduated ? yearGraduated : 'N/A'
                                    }
                                  />
                                  <LabelFieldPreview
                                    label="Academic Honors Received:"
                                    field={awards ? awards : 'N/A'}
                                  />
                                </div>
                              );
                            }
                          )}
                        </>
                      )}
                    </>
                  </CardContainer>
                  <CardContainer
                    title="College Education"
                    titleSize="xl"
                    titleClassName="font-medium"
                    isArray
                    cols={college.length}
                  >
                    <>
                      {college.length === 0 ? (
                        <div className="shadow-sm rounded-3xl shadow-slate-200">
                          <NotApplicableVisual />
                        </div>
                      ) : (
                        <>
                          {college.map(
                            (course: EducationInfo, courseIdx: number) => {
                              const {
                                schoolName,
                                degree,
                                from,
                                to,
                                units,
                                yearGraduated,
                                awards,
                              } = course;
                              return (
                                <div
                                  key={courseIdx}
                                  className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100"
                                >
                                  <LabelFieldPreview
                                    label="School:"
                                    field={schoolName ? schoolName : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Degree/Course:"
                                    field={degree ? degree : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Started:"
                                    field={from ? from : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Ended:"
                                    field={
                                      isEmpty(to.toString()) &&
                                      isEmpty(yearGraduated.toString())
                                        ? 'Present'
                                        : !isEmpty(to.toString()) &&
                                          !isEmpty(yearGraduated.toString())
                                        ? yearGraduated
                                        : 'N/A'
                                    }
                                  />
                                  <LabelFieldPreview
                                    label="Highest Level/Units Earned:"
                                    field={units ? units : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Graduated:"
                                    field={
                                      yearGraduated ? yearGraduated : 'N/A'
                                    }
                                  />
                                  <LabelFieldPreview
                                    label="Academic Honors Received:"
                                    field={awards ? awards : 'N/A'}
                                  />
                                </div>
                              );
                            }
                          )}
                        </>
                      )}
                    </>
                  </CardContainer>
                  <CardContainer
                    title="Graduate Education"
                    titleSize="xl"
                    titleClassName="font-medium"
                    isArray
                    cols={graduate.length}
                  >
                    <>
                      {graduate.length === 0 ? (
                        <div className="shadow-sm rounded-3xl shadow-slate-200">
                          <NotApplicableVisual />
                        </div>
                      ) : (
                        <>
                          {graduate.map(
                            (course: EducationInfo, courseIdx: number) => {
                              const {
                                schoolName,
                                degree,
                                from,
                                to,
                                units,
                                yearGraduated,
                                awards,
                              } = course;
                              return (
                                <div
                                  key={courseIdx}
                                  className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100"
                                >
                                  <LabelFieldPreview
                                    label="School:"
                                    field={schoolName ? schoolName : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Degree/Course:"
                                    field={degree ? degree : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Started:"
                                    field={from ? from : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Ended:"
                                    field={
                                      isEmpty(to.toString()) &&
                                      isEmpty(yearGraduated.toString())
                                        ? 'Present'
                                        : !isEmpty(to.toString()) &&
                                          !isEmpty(yearGraduated.toString())
                                        ? yearGraduated
                                        : 'N/A'
                                    }
                                  />
                                  <LabelFieldPreview
                                    label="Highest Level/Units Earned:"
                                    field={units ? units : 'N/A'}
                                  />
                                  <LabelFieldPreview
                                    label="Year Graduated:"
                                    field={
                                      yearGraduated ? yearGraduated : 'N/A'
                                    }
                                  />
                                  <LabelFieldPreview
                                    label="Academic Honors Received:"
                                    field={awards ? awards : 'N/A'}
                                  />
                                </div>
                              );
                            }
                          )}
                        </>
                      )}
                    </>
                  </CardContainer>
                </div>
              </>
            </CardContainer>

            <CardContainer title="Eligibility" className="py-5">
              <>
                <div className="px-5">
                  {eligibility.length === 0 ? (
                    <div className="shadow-sm rounded-3xl shadow-slate-200">
                      <NotApplicableVisual />
                    </div>
                  ) : (
                    <>
                      {eligibility.map((elig: Eligibility, eligIdx: number) => {
                        const {
                          name,
                          rating,
                          examDateFrom,
                          examDateTo,
                          examPlace,
                          licenseNumber,
                          validity,
                        } = elig;
                        return (
                          <div
                            key={eligIdx}
                            className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100"
                          >
                            <LabelFieldPreview
                              label="Name:"
                              field={name ? name : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Rating:"
                              field={rating ? rating : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Exam Date From:"
                              field={examDateFrom ? examDateFrom : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Exam Date To:"
                              field={examDateTo ? examDateTo : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Place of Examination:"
                              field={examPlace ? examPlace : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="License Number:"
                              field={licenseNumber ? licenseNumber : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Validity:"
                              field={validity ? validity.toString() : 'N/A'}
                            />
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
                <div className="px-5">
                  {workExperience.length === 0 ? (
                    <div className="shadow-sm rounded-3xl shadow-slate-200">
                      <NotApplicableVisual />
                    </div>
                  ) : (
                    <>
                      {workExperience.map(
                        (work: WorkExperience, workIdx: number) => {
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
                              className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                            >
                              <LabelFieldPreview
                                label="Position Title:"
                                field={positionTitle ? positionTitle : 'N/A'}
                              />
                              <LabelFieldPreview
                                label="Company Name:"
                                field={companyName ? companyName : 'N/A'}
                              />
                              <LabelFieldPreview
                                label="Date From:"
                                field={from ? from : 'N/A'}
                              />
                              <LabelFieldPreview
                                label="Date To:"
                                field={to ? to : 'N/A'}
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
                                field={
                                  salaryGrade ? (
                                    salaryGrade
                                  ) : (
                                    <span className="text-black">N/A</span>
                                  )
                                }
                              />
                              <LabelFieldPreview
                                label="Appointment Status:"
                                field={
                                  appointmentStatus ? appointmentStatus : 'N/A'
                                }
                              />
                            </div>
                          );
                        }
                      )}
                    </>
                  )}
                </div>
              </>
            </CardContainer>

            <CardContainer title="Voluntary Work Experience" className="py-5">
              <>
                <div className="px-5">
                  {voluntaryWork.length === 0 ? (
                    <div className="shadow-sm rounded-3xl shadow-slate-200">
                      <NotApplicableVisual />
                    </div>
                  ) : (
                    <>
                      {voluntaryWork.map((work: VoluntaryWork, workIdx) => {
                        const {
                          position,
                          organizationName,
                          from,
                          to,
                          numberOfHours,
                        } = work;
                        return (
                          <div
                            key={workIdx}
                            className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                          >
                            <LabelFieldPreview
                              label="Position Title:"
                              field={position ? position : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Organization:"
                              field={
                                organizationName ? organizationName : 'N/A'
                              }
                            />
                            <LabelFieldPreview
                              label="Date From:"
                              field={from ? from : 'N/A'}
                            />
                            <LabelFieldPreview
                              label="Date To:"
                              field={to ? to : 'N/A'}
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
                <div className="px-5">
                  {learningDevelopment.length === 0 ? (
                    <div className="shadow-sm rounded-3xl shadow-slate-200">
                      <NotApplicableVisual />
                    </div>
                  ) : (
                    <>
                      {learningDevelopment.map(
                        (
                          training: LearningDevelopment,
                          trainingIdx: number
                        ) => {
                          const {
                            title,
                            conductedBy,
                            from,
                            to,
                            numberOfHours,
                            type,
                          } = training;

                          return (
                            <div
                              key={trainingIdx}
                              className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                            >
                              <LabelFieldPreview
                                label="Title:"
                                field={title ? title : 'N/A'}
                              />
                              <LabelFieldPreview
                                label="Conducted by:"
                                field={conductedBy ? conductedBy : 'N/A'}
                              />
                              <LabelFieldPreview
                                label="Date From:"
                                field={from ? from : 'N/A'}
                              />
                              <LabelFieldPreview
                                label="Date To:"
                                field={to ? to : 'N/A'}
                              />
                              <LabelFieldPreview
                                label="Number of Hours:"
                                field={numberOfHours ? numberOfHours : 'N/A'}
                              />
                              <LabelFieldPreview
                                label="Type:"
                                field={type ? type : 'N/A'}
                              />
                            </div>
                          );
                        }
                      )}
                    </>
                  )}
                </div>
              </>
            </CardContainer>
            <CardContainer title="Skills" className="py-5">
              <>
                <div className="px-5">
                  {skills.length === 0 ? (
                    <div className="shadow-sm rounded-3xl shadow-slate-200">
                      <NotApplicableVisual />
                    </div>
                  ) : (
                    <>
                      {skills.map((title: Skill, titleIdx: number) => {
                        const { skill } = title;
                        return (
                          <div
                            key={titleIdx}
                            className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                          >
                            <LabelFieldPreview
                              label="Title"
                              field={skill ? skill : 'N/A'}
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </>
            </CardContainer>
            <CardContainer
              title="Non-Academic Distinctions & Recognitions"
              className="py-5"
            >
              <>
                <div className="px-5">
                  {recognitions.length === 0 ? (
                    <div className="shadow-sm rounded-3xl shadow-slate-200">
                      <NotApplicableVisual />
                    </div>
                  ) : (
                    <>
                      {recognitions.map(
                        (recog: Recognition, recogIdx: number) => {
                          const { recognition } = recog;
                          return (
                            <div
                              key={recogIdx}
                              className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                            >
                              <LabelFieldPreview
                                label="Title"
                                field={recognition ? recognition : 'N/A'}
                              />
                            </div>
                          );
                        }
                      )}
                    </>
                  )}
                </div>
              </>
            </CardContainer>
            <CardContainer title="Membership in Organizations" className="py-5">
              <>
                <div className="px-5">
                  {organizations.length === 0 ? (
                    <div className="shadow-sm rounded-3xl shadow-slate-200">
                      <NotApplicableVisual />
                    </div>
                  ) : (
                    <>
                      {organizations.map(
                        (membership: Organization, membershipIdx: number) => {
                          const { organization } = membership;
                          return (
                            <div
                              key={membershipIdx}
                              className="col-span-1 mb-[0.2%] justify-between rounded-3xl bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100 "
                            >
                              <LabelFieldPreview
                                label="Title"
                                field={organization ? organization : 'N/A'}
                              />
                            </div>
                          );
                        }
                      )}
                    </>
                  )}
                </div>
              </>
            </CardContainer>
            <CardContainer title="Questions" className="py-5">
              <>
                <div className="flex flex-col gap-4 p-5">
                  <CardQuestion
                    mainQuestion='Are you related by consanguinity or affinity to the appointing or recommending authority, or to the chief of bureau or office or to the
                      person who has immediate supervision over you in the Office, Bureau or Department where you will be apppointed,"'
                  >
                    <>
                      <LabelQNA
                        question="a. Within the third degree?"
                        cols={3}
                        answer={
                          officeRelation.withinThirdDegree.toString() === 'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1=""
                      />
                      <LabelQNA
                        question="b. Within the fourth degree (for Local Government Unit - Career Employees)?"
                        cols={3}
                        answer={
                          officeRelation.withinFourthDegree.toString() ===
                          'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1=""
                      />
                      <LabelQNA
                        question="Details"
                        answer={
                          (isEmpty(officeRelation.details) &&
                            officeRelation.withinThirdDegree.toString() ===
                              'true') ||
                          (isEmpty(officeRelation.details) &&
                            officeRelation.withinFourthDegree.toString() ===
                              'true') ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            officeRelation.details
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
                        answer={
                          guiltyCharged.isGuilty.toString() === 'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1={
                          isEmpty(guiltyCharged.guiltyDetails) &&
                          guiltyCharged.isGuilty.toString() === 'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            guiltyCharged.guiltyDetails
                          )
                        }
                      />
                      <LabelQNA
                        cols={4}
                        question="b. Have you been criminally charged before any court?"
                        answer={
                          guiltyCharged.isCharged.toString() === 'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1={
                          isEmpty(guiltyCharged.chargedDateFiled) &&
                          guiltyCharged.isCharged.toString() === 'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            guiltyCharged.chargedDateFiled
                          )
                        }
                        details2={
                          isEmpty(guiltyCharged.chargedCaseStatus) &&
                          guiltyCharged.isCharged.toString() === 'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            guiltyCharged.chargedCaseStatus
                          )
                        }
                      />
                    </>
                  </CardQuestion>
                  <CardQuestion>
                    <>
                      <LabelQNA
                        question=" Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any court or tribunal?"
                        answer={
                          convicted.isConvicted.toString() === 'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1={
                          isEmpty(convicted.details) &&
                          convicted.isConvicted.toString() === 'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            convicted.details
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
                        answer={
                          separatedService.isSeparated.toString() === 'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1={
                          isEmpty(separatedService.details) &&
                          separatedService.isSeparated.toString() === 'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            separatedService.details
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
                        answer={
                          candidateResigned.isCandidate.toString() === 'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1={
                          isEmpty(candidateResigned.candidateDetails) &&
                          candidateResigned.isCandidate.toString() ===
                            'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            candidateResigned.candidateDetails
                          )
                        }
                      />
                      <LabelQNA
                        question={
                          'b. Have you resigned from the government service during the three (3)-month period before the last election to promote/actively campaign for a national or local candidate?'
                        }
                        answer={
                          candidateResigned.isResigned.toString() === 'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1={
                          isEmpty(candidateResigned.resignedDetails) &&
                          candidateResigned.isResigned.toString() === 'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            candidateResigned.resignedDetails
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
                        answer={
                          immigrant.isImmigrant.toString() === 'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1={
                          isEmpty(immigrant.details) &&
                          immigrant.isImmigrant.toString() === 'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            immigrant.details
                          )
                        }
                      />
                    </>
                  </CardQuestion>

                  <CardQuestion mainQuestion="Pursuant to: (a) Indigenous People's Act (RA 8371); (b) Magna Carta for Disabled Persons (RA 7277); and (c) Solo Parents Welfare Act of 2000 (RA 8972), please answer the following items:">
                    <>
                      <LabelQNA
                        question={
                          'a. Are you a member of any indigenous group?'
                        }
                        answer={
                          indigenousPwdSoloParent.isIndigenousMember.toString() ===
                          'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1={
                          isEmpty(
                            indigenousPwdSoloParent.indigenousMemberDetails
                          ) &&
                          indigenousPwdSoloParent.isIndigenousMember.toString() ===
                            'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            indigenousPwdSoloParent.indigenousMemberDetails
                          )
                        }
                      />
                      <LabelQNA
                        question={'b. Are you a person with disability?'}
                        answer={
                          indigenousPwdSoloParent.isPwd.toString() === 'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1={
                          isEmpty(indigenousPwdSoloParent.pwdIdNumber) &&
                          indigenousPwdSoloParent.isPwd.toString() ===
                            'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            indigenousPwdSoloParent.pwdIdNumber
                          )
                        }
                      />
                      <LabelQNA
                        question={'c. Are you a solo parent?'}
                        answer={
                          indigenousPwdSoloParent.isSoloParent.toString() ===
                          'true'
                            ? 'Yes'
                            : 'No'
                        }
                        details1={
                          isEmpty(indigenousPwdSoloParent.soloParentIdNumber) &&
                          indigenousPwdSoloParent.isSoloParent.toString() ===
                            'true' ? (
                            <span className="text-sm text-indigo-600">
                              No answer provided
                            </span>
                          ) : (
                            indigenousPwdSoloParent.soloParentIdNumber
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
                <div className="flex flex-col gap-4 px-5">
                  {references.length === 0 ? (
                    <div className="shadow-sm rounded-3xl shadow-slate-200">
                      <NotApplicableVisual />
                    </div>
                  ) : (
                    <>
                      {references.map(
                        (reference: Reference, refIdx: number) => {
                          const { name, address, telephoneNumber } = reference;
                          return (
                            <div
                              key={refIdx}
                              className="col-span-1 mb-[0.2%] justify-between rounded-3xl border bg-white py-10 px-[5%] text-left align-middle shadow-md hover:bg-indigo-100"
                            >
                              <LabelFieldPreview
                                label="Name: "
                                field={
                                  name ? (
                                    name
                                  ) : (
                                    <span className="text-indigo-500 hover:text-indigo-900">
                                      No data provided
                                    </span>
                                  )
                                }
                              />
                              <LabelFieldPreview
                                label="Address: "
                                field={
                                  address ? (
                                    address
                                  ) : (
                                    <span className="text-indigo-500 hover:text-indigo-900">
                                      No data provided
                                    </span>
                                  )
                                }
                              />
                              <LabelFieldPreview
                                label="Telephone Number: "
                                field={
                                  telephoneNumber ? (
                                    telephoneNumber
                                  ) : (
                                    <span className="text-indigo-500 hover:text-indigo-900">
                                      No data provided
                                    </span>
                                  )
                                }
                              />
                            </div>
                          );
                        }
                      )}
                    </>
                  )}
                </div>
              </>
            </CardContainer>
            <CardContainer title="Presented Government ID" className="py-5">
              <>
                <div className="px-5">
                  <CardPreview title="" subtitle="">
                    <>
                      <LabelFieldPreview
                        label="Government ID: "
                        field={
                          governmentIssuedId.issuedId
                            ? governmentIssuedId.issuedId
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="ID number: "
                        field={
                          governmentIssuedId.idNumber
                            ? governmentIssuedId.idNumber
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Issued Date: "
                        field={
                          governmentIssuedId.issueDate
                            ? governmentIssuedId.issueDate
                            : 'N/A'
                        }
                      />
                      <LabelFieldPreview
                        label="Issued Place"
                        field={
                          governmentIssuedId.issuePlace
                            ? governmentIssuedId.issuePlace
                            : 'N/A'
                        }
                      />
                    </>
                  </CardPreview>
                </div>
              </>
            </CardContainer>
          </div>
        </>
      </Page>
      {/* PREV BUTTON */}
      <PrevButton action={() => handlePrevTab(selectedTab)} type="button" />

      {/* NEXT BUTTON */}
      {!hasPds && (
        <NextButton action={() => handleNextTab(selectedTab)} type="button" />
      )}
    </>
  );
}
