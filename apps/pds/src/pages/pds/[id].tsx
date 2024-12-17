import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { NavTab } from '../../components/fixed/tabs/NavTab';
import { useEmployeeStore } from '../../store/employee.store';
import { usePdsStore } from '../../store/pds.store';
import { isEmpty, isEqual } from 'lodash';
import { SpinnerDotted } from 'spinners-react';
import { getUserDetails, withCookieSessionPds } from '../../../utils/helpers/session';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { pdsToSubmit } from '../../../utils/helpers/pds.helper';
import { tabs, tabsHasPds } from '../../../utils/constants/tabs';
import axios from 'axios';
import { useTabStore } from '../../store/tab.store';
import { useRouter } from 'next/router';
import LoadingIndicator from '../../components/fixed/loader/LoadingIndicator';

dayjs.extend(utc);

export default function Dashboard({ employee, pdsDetails }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);
  const setHasPds = useEmployeeStore((state) => state.setHasPds);
  const setEmployeeDetails = useEmployeeStore((state) => state.setEmployeeDetails);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingEmployeeData, setIsLoadingEmployeeData] = useState<boolean>(false);
  const [isLoadingPdsData, setIsLoadingPdsData] = useState<boolean>(false);
  const { employmentDetails, profile, user } = employeeDetails;
  const pds = pdsToSubmit(usePdsStore((state) => state));
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const setInitialPdsState = usePdsStore((state) => state.setInitialPdsState);
  const setCheckboxAddressInitialState = usePdsStore((state) => state.setCheckboxAddressInitialState);
  const numberOfTabs = useTabStore((state) => state.numberOfTabs);
  const setNumberOfTabs = useTabStore((state) => state.setNumberOfTabs);
  const background = useTabStore((state) => state.background);
  const permanentAddressOnEdit = usePdsStore((state) => state.permanentAddressOnEdit);

  const {
    personalInfo,
    residentialAddress,
    permanentAddress,
    governmentIssuedIds,
    spouse,
    parents,
    elementary,
    secondary,
    governmentIssuedId,
    setGuiltyCharged,
    setConvicted,
    setSeparatedService,
    setCandidateResigned,
    setImmigrant,
    setIndigenousPwdSoloParent,
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
    guiltyCharged: state.guiltyCharged,
    convicted: state.convicted,
    separatedService: state.separatedService,
    candidateResigned: state.candidateResigned,
    immigrant: state.immigrant,
    indigenousPwdSoloParent: state.indigenousPwdSoloParent,
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
    setGuiltyCharged: state.setGuiltyCharged,
    setConvicted: state.setConvicted,
    setSeparatedService: state.setSeparatedService,
    setCandidateResigned: state.setCandidateResigned,
    setImmigrant: state.setImmigrant,
    setIndigenousPwdSoloParent: state.setIndigenousPwdSoloParent,
    setReferences: state.setReferences,
    setGovernmentIssuedId: state.setGovernmentIssuedId,
  }));

  async function setEmployeeOnLoad() {
    setPersonalInfo({
      ...personalInfo,
      employeeId: employmentDetails.userId,
      lastName: profile.lastName,
      firstName: profile.firstName,
      middleName: isEmpty(profile.middleName) ? 'N/A' : profile.middleName,
      nameExtension: isEmpty(profile.nameExtension) ? 'N/A' : profile.nameExtension,
      birthDate: profile.birthDate,
      sex: profile.sex,
      email: user.email,
    });
  }

  async function setPdsDetailsOnLoad() {
    if (hasPds) {
      setNumberOfTabs(tabsHasPds.length);
      setPersonalInfo({
        ...personalInfo,
        employeeId: employmentDetails.userId,
        lastName: profile.lastName,
        firstName: profile.firstName,
        middleName: isEmpty(profile.middleName) ? 'N/A' : profile.middleName,
        nameExtension: isEmpty(profile.nameExtension) ? 'N/A' : profile.nameExtension,
        birthDate: profile.birthDate,
        sex: profile.sex,
        email: user.email,
        birthPlace: pdsDetails.personalInfo.birthPlace,
        civilStatus: pdsDetails.personalInfo.civilStatus,
        height: pdsDetails.personalInfo.height,
        weight: pdsDetails.personalInfo.weight,
        bloodType: pdsDetails.personalInfo.bloodType,
        citizenship: pdsDetails.personalInfo.citizenship,
        citizenshipType: pdsDetails.personalInfo.citizenshipType,
        country: pdsDetails.personalInfo.country,
        telephoneNumber: pdsDetails.personalInfo.telephoneNumber,
        mobileNumber: pdsDetails.personalInfo.mobileNumber,
      });

      setGovernmentIssuedIds({
        ...governmentIssuedIds,

        gsisNumber: pdsDetails.governmentIssuedIds.gsisNumber,
        pagibigNumber: pdsDetails.governmentIssuedIds.pagibigNumber,
        philhealthNumber: pdsDetails.governmentIssuedIds.philhealthNumber,
        sssNumber: pdsDetails.governmentIssuedIds.sssNumber,
        tinNumber: pdsDetails.governmentIssuedIds.tinNumber,
        agencyNumber: pdsDetails.governmentIssuedIds.agencyNumber,
      });

      setResidentialAddress({
        ...residentialAddress,
        houseNumber: pdsDetails.residentialAddress.houseNumber,
        street: pdsDetails.residentialAddress.street,
        subdivision: pdsDetails.residentialAddress.subdivision,
        provCode: pdsDetails.residentialAddress.provCode,
        province: pdsDetails.residentialAddress.province,
        cityCode: pdsDetails.residentialAddress.cityCode,
        city: pdsDetails.residentialAddress.city,
        barangay: pdsDetails.residentialAddress.barangay,
        brgyCode: pdsDetails.residentialAddress.brgyCode,
        zipCode: pdsDetails.residentialAddress.zipCode,
      });

      setPermanentAddress({
        ...permanentAddress,
        houseNumber: pdsDetails.permanentAddress.houseNumber,
        street: pdsDetails.permanentAddress.street,
        subdivision: pdsDetails.permanentAddress.subdivision,
        provCode: pdsDetails.permanentAddress.provCode,
        province: pdsDetails.permanentAddress.province,
        cityCode: pdsDetails.permanentAddress.cityCode,
        city: pdsDetails.permanentAddress.city,
        barangay: pdsDetails.permanentAddress.barangay,
        brgyCode: pdsDetails.permanentAddress.brgyCode,
        zipCode: pdsDetails.permanentAddress.zipCode,
      });

      setSpouse({
        ...spouse,
        lastName: pdsDetails.spouse.lastName,
        firstName: pdsDetails.spouse.firstName,
        middleName: pdsDetails.spouse.middleName,
        nameExtension: pdsDetails.spouse.nameExtension,
        employer: pdsDetails.spouse.employer,
        businessAddress: pdsDetails.spouse.businessAddress,
        telephoneNumber: pdsDetails.spouse.telephoneNumber,
        occupation: pdsDetails.spouse.occupation,
      });

      setParents({
        ...parents,
        fatherLastName: pdsDetails.parents.fatherLastName,
        fatherFirstName: pdsDetails.parents.fatherFirstName,
        fatherMiddleName: pdsDetails.parents.fatherMiddleName,
        fatherNameExtension: pdsDetails.parents.fatherNameExtension,
        motherLastName: pdsDetails.parents.motherLastName,
        motherFirstName: pdsDetails.parents.motherFirstName,
        motherMiddleName: pdsDetails.parents.motherMiddleName,
      });

      setChildren(pdsDetails.children);

      setElementary({
        ...elementary,
        schoolName: pdsDetails.elementary.schoolName,
        degree: pdsDetails.elementary.degree,
        from: pdsDetails.elementary.from,
        to: pdsDetails.elementary.to,
        units: pdsDetails.elementary.units,
        yearGraduated: pdsDetails.elementary.yearGraduated,
        awards: pdsDetails.elementary.awards,
      });

      setSecondary({
        ...secondary,
        schoolName: pdsDetails.secondary.schoolName,
        degree: pdsDetails.secondary.degree,
        from: pdsDetails.secondary.from,
        to: pdsDetails.secondary.to,
        units: pdsDetails.secondary.units,
        yearGraduated: pdsDetails.secondary.yearGraduated,
        awards: pdsDetails.secondary.awards,
      });

      setCollege(pdsDetails.college);

      setVocational(pdsDetails.vocational);

      setGraduate(pdsDetails.graduate);

      setEligibility(pdsDetails.eligibility);

      setWorkExperience(pdsDetails.workExperience);

      setVoluntaryWork(pdsDetails.voluntaryWork);

      setLearningDevelopment(pdsDetails.learningDevelopment);

      setSkills(pdsDetails.skills);

      setRecognitions(pdsDetails.recognitions);

      setOrganizations(pdsDetails.organizations);

      setOfficeRelation(pdsDetails.officeRelation);

      setGuiltyCharged(pdsDetails.guiltyCharged);

      setConvicted(pdsDetails.convicted);

      setSeparatedService(pdsDetails.separatedService);

      setCandidateResigned(pdsDetails.candidateResigned);

      setImmigrant(pdsDetails.immigrant);

      setIndigenousPwdSoloParent(pdsDetails.indigenousPwdSoloParent);

      setReferences(pdsDetails.references);

      setGovernmentIssuedId({
        ...governmentIssuedId,
        idNumber: pdsDetails.governmentIssuedId.idNumber,
        issueDate: pdsDetails.governmentIssuedId.issueDate,
        issuedId: pdsDetails.governmentIssuedId.issuedId,
        issuePlace: pdsDetails.governmentIssuedId.issuePlace,
      });
    } else {
      setNumberOfTabs(tabs.length);
    }
    setIsLoadingPdsData(true);
  }

  // set the employee details state from server side props
  useEffect(() => {
    setEmployeeDetails(employee);

    if (isEmpty(pdsDetails)) setHasPds(false);
    else {
      setHasPds(true);
    }
  }, []);

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

  // if employee details state is changed call employee on load and set loading employee data to true
  useEffect(() => {
    setEmployeeOnLoad();
    setIsLoadingEmployeeData(true);
  }, [employeeDetails]);

  // if loading employee data is true call pds details on load and set loading pds data to true
  useEffect(() => {
    if (isLoadingEmployeeData) {
      setPdsDetailsOnLoad();
      // setIsLoadingPdsData(true);
    }
  }, [isLoadingEmployeeData]);

  // if loading pds data is true, re-render the nav tab component using timeout and set is loading to false
  useEffect(() => {
    if (isLoadingPdsData) {
      setInitialPdsState({ ...pds });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [isLoadingPdsData]);

  // set the checkbox to true if residential address and permanent address is the same
  useEffect(() => {
    if (isLoading === false) {
      if (hasPds && !permanentAddressOnEdit && isEqual(residentialAddress, permanentAddress)) {
        setCheckboxAddressInitialState(true);
        setTimeout(() => {
          setCheckboxAddress(true);
        }, 1000);
      }
    }
  }, [isLoading, residentialAddress, permanentAddress]);

  //! uncomment this code if needed to lock, redirect to closed page
  // useEffect(() => {
  //   router.push(`${process.env.NEXT_PUBLIC_PERSONAL_DATA_SHEET}/closed`);
  // }, []);

  return (
    <>
      <div className="w-full min-h-screen col-span-1 ">
        <div className={`min-h-screen ${background}`}>
          {isLoading ? (
            <>
              <div className="flex items-center justify-center w-full h-screen">
                <LoadingIndicator />
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

export const getServerSideProps: GetServerSideProps = withCookieSessionPds(
  async (context: GetServerSidePropsContext) => {
    const employee = getUserDetails();
    /*
    , {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      }
    */
    try {
      const applicantPds = await axios.get(`${process.env.NEXT_PUBLIC_PORTAL_BE_URL}/pds/v2/${context.params?.id}`, {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      });

      if (applicantPds.status === 200 && employee.employmentDetails.userId === context.params?.id) {
        return { props: { employee, pdsDetails: applicantPds.data } };
      } else if (applicantPds.status === 200 && employee.employmentDetails.userId !== context.params?.id) {
        return {
          props: {},
          redirect: { destination: '/404', permanent: false },
        };
      } else {
        return {
          props: {},
          redirect: {
            destination: `${process.env.NEXT_PUBLIC_PORTAL_FE_URL}/login`,
            permanent: false,
          },
        };
      }
    } catch {
      if (employee.employmentDetails.userId === context.params?.id) {
        return {
          props: { employee, pdsDetails: {} },
          // redirect: { destination: '/404', permanent: false },
        };
      } else if (employee.employmentDetails.userId !== context.params?.id) {
        return {
          props: {},
          redirect: { destination: '/401', permanent: false },
        };
      } else
        return {
          props: {},
          redirect: { destination: '/404', permanent: false },
        };
    }
  }
);
