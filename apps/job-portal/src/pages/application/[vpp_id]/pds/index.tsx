/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
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
    if (isLoadingApplicantData && isExistingApplicant) {
      setPdsDetailsOnLoad();
    } else if (isLoadingApplicantData && isExistingApplicant === false) {
      setApplicantInfo();
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
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
  const token = context.req.headers.cookie;

  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/pds`, {
      withCredentials: true,
      headers: { Cookie: `${token}` },
    });

    return {
      props: {
        vppId: data.vppId,
        pdsDetails: data.pdsDetails,
        externalApplicantId: data.externalApplicantId,
      },
    };
  } catch (error) {
    console.log('PDS Form Page ERROR', error);
    return { props: { vppId: context.query.vpp_id } };
  }
};
