import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { NavTab } from '../../../../components/fixed/tabs/NavTab';
import { Pds, usePdsStore } from '../../../../store/pds.store';
import { isEmpty, isEqual } from 'lodash';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useApplicantStore } from '../../../../store/applicant.store';
import { usePublicationStore } from '../../../../store/publication.store';
import { LoadingSpinner } from '@gscwd-apps/oneui';

type DashboardProps = {
  vppId: string;
  externalApplicantId: string;
  pdsDetails: Pds;
};

// const applicant: Partial<Pds> = {
//   personalInfo: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     firstName: 'Jofher',
//     middleName: 'L',
//     lastName: 'Nilapirot',
//     nameExtension: 'Jr.',
//     birthDate: '1991-03-03',
//     sex: 'Male',
//     civilStatus: 'Single',
//     height: 1.65,
//     weight: 62,
//     bloodType: 'O+',
//     mobileNumber: '09770912663',
//     telephoneNumber: '0835002252',
//     email: 'shiamshi@gmail.com',
//     citizenship: 'Dual Citizenship',
//     citizenshipType: 'By naturalization',
//     country: 'Australia',
//     birthPlace: 'Polomolok',
//   },
//   governmentIssuedIds: {
//     gsisNumber: '11111111111',
//     pagibigNumber: '1222222222',
//     philhealthNumber: '133333333333',
//     sssNumber: '1444444444',
//     tinNumber: '155555555555',
//     agencyNumber: 'S-002',
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//   },
//   residentialAddress: {
//     houseNumber: 'A4',
//     street: 'Ilang-Ilang',
//     subdivision: 'Cannery Housing',
//     province: 'Ilocos Norte',
//     provCode: '0128',
//     city: 'Adams',
//     cityCode: '012801',
//     barangay: 'Adams (Pob.)',
//     brgyCode: '012801001',
//     zipCode: '9504',
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//   },
//   permanentAddress: {
//     houseNumber: 'A4',
//     street: 'Ilang-Ilang',
//     subdivision: 'Cannery Housing',
//     province: 'Ilocos Norte',
//     provCode: '0128',
//     city: 'Adams',
//     cityCode: '012801',
//     barangay: 'Adams (Pob.)',
//     brgyCode: '012801001',
//     zipCode: '9504',
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//   },
//   spouse: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     firstName: 'Arliz',
//     middleName: 'Sovenestras',
//     nameExtension: 'N/A',
//     lastName: 'Nilapirot',
//     employer: 'N/A',
//     businessAddress: 'N/A',
//     occupation: 'N/A',
//     telephoneNumber: 'N/A',
//   },
//   parents: {
//     fatherLastName: 'Monkey',
//     fatherFirstName: 'Luffy',
//     fatherMiddleName: "D'",
//     fatherNameExtension: 'Sr.',
//     motherLastName: 'L',
//     motherFirstName: 'Jofera',
//     motherMiddleName: 'Dilapires',
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//   },
//   children: [
//     { applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc', childName: 'Jover S. Nilapirot', birthDate: '2012-04-02' },
//     { applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc', childName: 'Javier S. Nilapirot', birthDate: '2016-07-22' },
//   ],
//   elementary: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     schoolName: 'Elementary School',
//     degree: 'Primary Education',
//     from: 2000,
//     to: 2006,
//     yearGraduated: 2006,
//     units: 'Graduated',
//     awards: 'N/A',
//   },
//   secondary: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     schoolName: 'Secondary School',
//     degree: 'High School',
//     from: 2006,
//     to: 2009,
//     yearGraduated: 2009,
//     units: 'Graduated',
//     awards: 'N/A',
//   },
//   vocational: [
//     {
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//       schoolName: 'Skwelahan ni bado',
//       degree: 'Bachelor of Chingchong Ching',
//       from: 2017,
//       to: null,
//       yearGraduated: null,
//       units: 'N/A',
//       awards: 'N/A',
//     },
//   ],

//   college: [
//     {
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//       schoolName: 'Notre Dame of Dadiangas University',
//       degree: 'Bachelor of Chingchong Ching',
//       from: 2013,
//       to: 2016,
//       yearGraduated: 2013,
//       units: 'Graduated',
//       awards: 'N/A',
//     },
//     {
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//       schoolName: 'Mindanao State University',
//       degree: 'Bachelor of Science in Information and Technology',
//       from: 2009,
//       to: 2013,
//       yearGraduated: null,
//       units: 'N/A',
//       awards: 'N/A',
//     },
//   ],
//   graduate: [
//     {
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//       schoolName: 'Ateneo de Davao',
//       degree: 'Bachelor of Science in Information and Technology',
//       from: 2020,
//       to: null,
//       yearGraduated: null,
//       units: 'N/A',
//       awards: 'N/A',
//     },
//   ],
//   eligibility: [
//     {
//       name: 'Civil Service Professional',
//       rating: '97.08',
//       examDate: { from: '2019-03-17', to: null },
//       examPlace: 'General Santos City',
//       licenseNumber: '',
//       validity: '',
//       isOneDayOfExam: true,
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     },
//   ],
//   workExperience: [
//     {
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//       positionTitle: 'General Manager',
//       companyName: 'Polomolok Water District',
//       from: '2015-03-22',
//       to: '',
//       monthlySalary: 128696,
//       isGovernmentService: true,
//       salaryGrade: '26-1',
//       appointmentStatus: 'Permanent',
//     },
//   ],
//   voluntaryWork: [
//     {
//       position: 'General Manager',
//       organizationName: 'Polomolok Water District',
//       from: '2015-03-22',
//       to: '',
//       numberOfHours: null,
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     },
//   ],
//   learningDevelopment: [
//     {
//       title: 'Chichi Burichi',
//       conductedBy: 'Polomolok Water District',
//       from: '2019-05-02',
//       to: '2019-05-04',
//       numberOfHours: 15,
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//       type: 'Managerial/Leadership',
//     },
//   ],
//   skills: [
//     {
//       skill: 'Boxer',
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     },
//     {
//       skill: 'Fighter',
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     },
//     {
//       skill: 'Biker',
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     },
//     {
//       skill: 'Swimmer',
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     },
//   ],
//   recognitions: [
//     {
//       recognition: 'Pedal King',
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     },
//   ],
//   organizations: [
//     {
//       organization: 'Yakuza',
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     },
//   ],

//   officeRelation: {
//     withinThirdDegree: true,
//     details: 'The assistant general manager is my uncle.',
//     withinFourthDegree: false,
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//   },
//   guiltyCharged: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     isCharged: false,
//     chargedCaseStatus: '',
//     chargedDateFiled: '',
//     isGuilty: false,
//     guiltyDetails: '',
//   },
//   convicted: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     isConvicted: false,
//     details: '',
//   },
//   separatedService: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     isSeparated: false,
//     details: '',
//   },
//   candidateResigned: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     isCandidate: false,
//     candidateDetails: '',
//     isResigned: false,
//     resignedDetails: '',
//   },
//   immigrant: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     isImmigrant: true,
//     details: 'Australia',
//   },
//   indigenousPwdSoloParent: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     isIndigenousMember: false,
//     indigenousMemberDetails: '',
//     isPwd: false,
//     pwdIdNumber: '',
//     isSoloParent: false,
//     soloParentIdNumber: '',
//   },
//   references: [
//     {
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//       name: 'John Seigfred Derla',
//       address: 'General Santos City',
//       telephoneNumber: '0833080744',
//     },
//     {
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//       name: 'Ricardo Vicente Narvaiza',
//       address: 'General Santos City',
//       telephoneNumber: '0833080745',
//     },
//     {
//       applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//       name: 'Paul Ryner Ogdamin',
//       address: 'Polomolok, South Cotabato',
//       telephoneNumber: '0833080745',
//     },
//   ],
//   governmentIssuedId: {
//     applicantId: '7bda7038-9a26-44a0-b649-475a6118eccc',
//     idNumber: '1234678476',
//     issueDate: '2012-04-15',
//     issuedId: "Driver's License",
//     issuePlace: 'Polomolok, South Cotabato',
//   },
// }

export default function Dashboard({ vppId, pdsDetails, externalApplicantId }: DashboardProps) {
  dayjs.extend(utc);

  const publication = usePublicationStore((state) => state.publication);
  const setPublication = usePublicationStore((state) => state.setPublication);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const [isLoadedInitialState, setIsLoadedInitialState] = useState<boolean>(false);
  const externalApplicant = useApplicantStore((state) => state.applicant);
  const setExternalApplicant = useApplicantStore((state) => state.setApplicant);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingApplicantData, setIsLoadingApplicantData] = useState<boolean>(false);
  const [isLoadingPdsData, setIsLoadingPdsData] = useState<boolean>(false);

  const { isExistingApplicant, setIsExistingApplicant } = useApplicantStore((state) => ({
    isExistingApplicant: state.isExistingApplicant,
    setIsExistingApplicant: state.setIsExistingApplicant,
  }));

  const {
    personalInfo,
    residentialAddress,
    permanentAddress,
    governmentIssuedIds,
    spouse,
    parents,
    elementary,
    secondary,
    officeRelation,
    governmentIssuedId,
    setGovernmentIssuedId,
    setReferences,
    setOfficeRelation,
    setSkills,
    setRecognitions,
    setOrganizations,
    setLearningDevelopment,
    setVoluntaryWork,
    setWorkExperience,
    setEligibility,
    setGraduate,
    setVocational,
    setCollege,
    setSecondary,
    setElementary,
    setChildren,
    setCheckboxAddress,
    setPersonalInfo,
    setGovernmentIssuedIds,
    setResidentialAddress,
    setPermanentAddress,
    setSpouse,
    setParents,
  } = usePdsStore((state) => ({
    personalInfo: state.personalInfo,
    residentialAddress: state.residentialAddress,
    permanentAddress: state.permanentAddress,
    governmentIssuedIds: state.governmentIssuedIds,
    spouse: state.spouse,
    parents: state.parents,
    elementary: state.elementary,
    secondary: state.secondary,
    college: state.college,
    vocational: state.vocational,
    graduate: state.graduate,
    eligibility: state.eligibility,
    workExperience: state.workExperience,
    voluntaryWork: state.voluntaryWork,
    learningDevelopment: state.learningDevelopment,
    skills: state.skills,
    recognitions: state.recognitions,
    organizations: state.organizations,
    officeRelation: state.officeRelation,
    references: state.references,
    governmentIssuedId: state.governmentIssuedId,
    setPersonalInfo: state.setPersonalInfo,
    setResidentialAddress: state.setResidentialAddress,
    setPermanentAddress: state.setPermanentAddress,
    setCheckboxAddress: state.setCheckboxAddress,
    setGovernmentIssuedIds: state.setGovernmentIssuedIds,
    setSpouse: state.setSpouse,
    setParents: state.setParents,
    setChildren: state.setChildren,
    setElementary: state.setElementary,
    setSecondary: state.setSecondary,
    setCollege: state.setCollege,
    setVocational: state.setVocational,
    setGraduate: state.setGraduate,
    setEligibility: state.setEligibility,
    setWorkExperience: state.setWorkExperience,
    setVoluntaryWork: state.setVoluntaryWork,
    setLearningDevelopment: state.setLearningDevelopment,
    setSkills: state.setSkills,
    setRecognitions: state.setRecognitions,
    setOrganizations: state.setOrganizations,
    setOfficeRelation: state.setOfficeRelation,
    setReferences: state.setReferences,
    setGovernmentIssuedId: state.setGovernmentIssuedId,
  }));

  useEffect(() => {
    setIsLoadingApplicantData(true);
    if (isEmpty(pdsDetails)) {
      setIsExistingApplicant(false);
    } else {
      setIsExistingApplicant(true);
    }
    setPublication({ ...publication, vppId: vppId });
  }, []);

  useEffect(() => {
    if (isLoadingApplicantData && isExistingApplicant) setPdsDetailsOnLoad();
    else if (isLoadingApplicantData && isExistingApplicant === false) setApplicantInfo();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoadingApplicantData, isExistingApplicant]);

  /**
   *  i have delayed the setting of checkbox address to true or false because it picks up a null value from use ref on page load
   *  as long as the residential address and permanent address is hydrated, you may now set the checkbox to true or false
   */

  useEffect(() => {
    if (isLoading === false) {
      if (isExistingApplicant && isLoadedInitialState === false) {
        setInitialPdsState({ ...pdsDetails });
        setIsLoadedInitialState(true);
        if (isEqual(residentialAddress, permanentAddress)) {
          setTimeout(() => {
            setCheckboxAddress(true);
          }, 1000);
        }
      }
    }
  }, [isLoading, isLoadedInitialState, residentialAddress, permanentAddress]);

  const setPdsDetailsOnLoad = async () => {
    const applicant = pdsDetails;
    // set the external applicant id
    setExternalApplicant({
      ...externalApplicant,
      applicantId: externalApplicantId,
    });

    setPersonalInfo({
      ...personalInfo,
      lastName: applicant.personalInfo.lastName,
      firstName: applicant.personalInfo.firstName!,
      middleName: isEmpty(applicant.personalInfo.middleName) ? 'N/A' : applicant.personalInfo.middleName,
      nameExtension: isEmpty(applicant.personalInfo.nameExtension) ? 'N/A' : applicant.personalInfo.nameExtension!,
      birthDate: dayjs.utc(applicant.personalInfo.birthDate).format('YYYY-MM-DD').toString(),
      sex: applicant.personalInfo.sex,
      birthPlace: applicant.personalInfo.birthPlace,
      civilStatus: applicant.personalInfo.civilStatus,
      height: applicant.personalInfo.height,
      weight: applicant.personalInfo.weight,
      bloodType: applicant.personalInfo.bloodType,
      citizenship: applicant.personalInfo.citizenship,
      citizenshipType: applicant.personalInfo.citizenshipType,
      country: applicant.personalInfo.citizenship === 'Filipino' ? 'Philippines' : applicant.personalInfo.country,
      telephoneNumber: applicant.personalInfo.telephoneNumber,
      mobileNumber: applicant.personalInfo.mobileNumber,
      email: applicant.personalInfo.email,
    });

    setGovernmentIssuedIds({
      ...governmentIssuedIds,
      gsisNumber: applicant.governmentIssuedIds.gsisNumber,
      pagibigNumber: applicant.governmentIssuedIds.pagibigNumber,
      philhealthNumber: applicant.governmentIssuedIds.philhealthNumber,
      sssNumber: applicant.governmentIssuedIds.sssNumber,
      tinNumber: applicant.governmentIssuedIds.tinNumber,
      agencyNumber: applicant.governmentIssuedIds.agencyNumber,
    });

    setResidentialAddress({
      ...residentialAddress,
      houseNumber: applicant.residentialAddress.houseNumber,
      street: applicant.residentialAddress.street,
      subdivision: applicant.residentialAddress.subdivision,
      provCode: applicant.residentialAddress.provCode,
      province: applicant.residentialAddress.province,
      cityCode: applicant.residentialAddress.cityCode,
      city: applicant.residentialAddress.city,
      barangay: applicant.residentialAddress.barangay,
      brgyCode: applicant.residentialAddress.brgyCode,
      zipCode: applicant.residentialAddress.zipCode,
    });

    setPermanentAddress({
      ...permanentAddress,
      houseNumber: applicant.permanentAddress.houseNumber,
      street: applicant.permanentAddress.street,
      subdivision: applicant.permanentAddress.subdivision,
      provCode: applicant.permanentAddress.provCode,
      province: applicant.permanentAddress.province,
      cityCode: applicant.permanentAddress.cityCode,
      city: applicant.permanentAddress.city,
      barangay: applicant.permanentAddress.barangay,
      brgyCode: applicant.permanentAddress.brgyCode,
      zipCode: applicant.permanentAddress.zipCode,
    });

    setSpouse({
      ...spouse,
      lastName: applicant.spouse.lastName,
      firstName: applicant.spouse.firstName,
      middleName: applicant.spouse.middleName,
      nameExtension: applicant.spouse.nameExtension,
      employer: applicant.spouse.employer,
      businessAddress: applicant.spouse.businessAddress,
      telephoneNumber: applicant.spouse.telephoneNumber,
      occupation: applicant.spouse.occupation,
    });

    setParents({
      ...parents,
      fatherLastName: applicant.parents.fatherLastName,
      fatherFirstName: applicant.parents.fatherFirstName,
      fatherMiddleName: applicant.parents.fatherMiddleName,
      fatherNameExtension: applicant.parents.fatherNameExtension,
      motherLastName: applicant.parents.motherLastName,
      motherFirstName: applicant.parents.motherFirstName,
      motherMiddleName: applicant.parents.motherMiddleName,
    });

    setChildren(applicant.children);

    setElementary({
      ...elementary,
      schoolName: applicant.elementary.schoolName,
      degree: applicant.elementary.degree,
      from: applicant.elementary.from,
      to: applicant.elementary.to,
      units: applicant.elementary.units,
      yearGraduated: applicant.elementary.yearGraduated,
      awards: applicant.elementary.awards,
    });

    setSecondary({
      ...secondary,
      schoolName: applicant.secondary.schoolName,
      degree: applicant.secondary.degree,
      from: applicant.secondary.from,
      to: applicant.secondary.to,
      units: applicant.secondary.units,
      yearGraduated: applicant.secondary.yearGraduated,
      awards: applicant.secondary.awards,
    });

    setCollege(applicant.college);

    setVocational(applicant.vocational);

    setGraduate(applicant.graduate);

    setEligibility(applicant.eligibility);

    setWorkExperience(applicant.workExperience);

    setVoluntaryWork(applicant.voluntaryWork);

    setLearningDevelopment(applicant.learningDevelopment);

    setSkills(applicant.skills);

    setRecognitions(applicant.recognitions);

    setOrganizations(applicant.organizations);

    setOfficeRelation({
      ...officeRelation,
      details: applicant.officeRelation.details,
      withinFourthDegree: applicant.officeRelation.withinFourthDegree,
      withinThirdDegree: applicant.officeRelation.withinThirdDegree,
    });

    setReferences(applicant.references);

    setGovernmentIssuedId({
      ...governmentIssuedId,
      idNumber: applicant.governmentIssuedId.idNumber,
      issueDate: dayjs.utc(applicant.governmentIssuedId.issueDate).format('YYYY-MM-DD').toString(),
      issuedId: applicant.governmentIssuedId.issuedId,
      issuePlace: applicant.governmentIssuedId.issuePlace,
    });
  };

  const setApplicantInfo = async () => {
    const applicant = JSON.parse(localStorage.getItem('applicant')!);
    setPersonalInfo({
      ...personalInfo,
      lastName: applicant.lastName,
      firstName: applicant.firstName,
      middleName: applicant.middleName,
      nameExtension: applicant.nameExtension,
      email: applicant.email,
    });
  };

  // prompts when window or tab is being closed
  useEffect(() => {
    const handleTabClose = (e: any) => {
      e.preventDefault();

      return (e.returnValue = 'Are you sure you want to exit?');
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  return (
    <>
      <div className="w-full min-h-screen col-span-1">
        <div className="min-h-screen bg-slate-100">
          {isLoading ? (
            <>
              <div className="flex items-center justify-center w-full h-screen">
                <LoadingSpinner size={'lg'} />
                {/* <SpinnerDotted
                  speed={150}
                  thickness={120}
                  color="indigo"
                  size={100}
                  className="flex w-full h-full transition-all animate-pulse "
                /> */}
              </div>
            </>
          ) : (
            <>
              <NavTab />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/pds`, {
      withCredentials: true,
      headers: { Cookie: `${context.req.headers.cookie}` },
    });

    return {
      props: {
        vppId: data.vppId,
        pdsDetails: data.pdsDetails,
        externalApplicantId: data.externalApplicantId,
      },
    };
  } catch (error) {
    return { props: { vppId: context.query.vpp_id } };
  }
};
