import { PDSState } from '../../src/store/pds.store';

export const pdsToSubmit = (pds: PDSState) => {
  return (({
    checkboxAddress,
    checkboxAddressInitialState,
    initialPdsState,
    setInitialPdsState,
    setCheckboxAddressInitialState,
    setCheckboxAddress,
    setPersonalInfo,
    setGovernmentIssuedIds,
    setPermanentAddress,
    setResidentialAddress,
    setSpouse,
    setParents,
    setChildren,
    setElementary,
    setSecondary,
    setVocational,
    setCollege,
    setGraduate,
    setEligibility,
    setWorkExperience,
    setVoluntaryWork,
    setLearningDevelopment,
    setSkills,
    setRecognitions,
    setOrganizations,
    setOfficeRelation,
    setGuiltyCharged,
    setConvicted,
    setSeparatedService,
    setCandidateResigned,
    setImmigrant,
    setIndigenousPwdSoloParent,
    setReferences,
    setGovernmentIssuedId,
    ...rest
  }) => rest)(pds);
};

export const getPds = (pds: PDSState) => {
  return (({
    setPersonalInfo,
    setGovernmentIssuedIds,
    setPermanentAddress,
    setResidentialAddress,
    setSpouse,
    setParents,
    setChildren,
    setElementary,
    setSecondary,
    setVocational,
    setCollege,
    setGraduate,
    setEligibility,
    setWorkExperience,
    setVoluntaryWork,
    setLearningDevelopment,
    setSkills,
    setRecognitions,
    setOrganizations,
    setOfficeRelation,
    setGuiltyCharged,
    setConvicted,
    setSeparatedService,
    setCandidateResigned,
    setImmigrant,
    setIndigenousPwdSoloParent,
    setReferences,
    setGovernmentIssuedId,
    ...rest
  }) => rest)(pds);
};