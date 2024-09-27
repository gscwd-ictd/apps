import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { usePdsStore } from '../../../store/pds.store';
import { useTabStore } from '../../../store/tab.store';
import { Card } from '../../modular/cards/Card';
import { Page } from '../../modular/pages/Page';
import LoadingIndicator from '../loader/LoadingIndicator';
import { PrevButton } from '../navigation/button/PrevButton';
import { postData, putData } from '../../../../utils/hoc/axios';
import { pdsToSubmit } from '../../../../utils/helpers/pds.helper';
import { HeadContainer } from '../head/Head';
import { useApplicantStore } from '../../../store/applicant.store';
import { HiExclamationCircle } from 'react-icons/hi';
import axios from 'axios';
import { usePublicationStore } from '../../../store/publication.store';
import { PdsAlertSubmitConfirmation } from '../pds/PdsAlertSubmitConfirmation';
import { PdsAlertSubmitSuccess } from '../pds/PdsAlertSubmitSuccess';
import {
  AssignChildrenForUpdating,
  AssignEducationForUpdating,
  AssignEligibilitiesForUpdating,
  AssignLearningDevelopmentsForUpdating,
  AssignOrganizationsForUpdating,
  AssignRecognitionsForUpdating,
  AssignReferencesForUpdating,
  AssignSkillsForUpdating,
  AssignVoluntaryWorksForUpdating,
  AssignWorkExperiencesForUpdating,
} from '../../../../utils/functions/functions';
import { isEmpty } from 'lodash';
import { usePageStore } from '../../../store/page.store';
import { PdsAlertSubmitFailed } from '../pds/PdsAlertSubmitFailed';
import { Alert, Button, PageContentContext } from '@gscwd-apps/oneui';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';

export default function SubmitPanel(): JSX.Element {
  const page = usePageStore((state) => state.page);
  const isExistingApplicant = useApplicantStore((state) => state.isExistingApplicant);
  const pds = pdsToSubmit(usePdsStore((state) => state));
  const publication = usePublicationStore((state) => state.publication);
  const router = useRouter(); // initialize router
  const [isError, setIsError] = useState<boolean>(false);
  const [isConfirmationPressed, setIsConfirmationPressed] = useState<boolean>(false);
  const [alertConfirmation, setAlertConfirmation] = useState<boolean>(false);
  const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
  const [alertFailed, setAlertFailed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // set loading state
  const [isDisabled, setIsDisabled] = useState<boolean>(false); // submit button state
  const applicant = useApplicantStore((state) => state.applicant);
  const deletedChildren = usePdsStore((state) => state.deletedChildren);
  const deletedVocationals = usePdsStore((state) => state.deletedVocationals);
  const deletedColleges = usePdsStore((state) => state.deletedColleges);
  const deletedGraduates = usePdsStore((state) => state.deletedGraduates);
  const deletedEligibilities = usePdsStore((state) => state.deletedEligibilities);
  const deletedWorkExperiences = usePdsStore((state) => state.deletedWorkExperiences);
  const deletedVolWorks = usePdsStore((state) => state.deletedVolWorks);
  const deletedLearningDevelopments = usePdsStore((state) => state.deletedLearningDevelopments);
  const deletedSkills = usePdsStore((state) => state.deletedSkills);
  const deletedOrganizations = usePdsStore((state) => state.deletedOrganizations);
  const deletedRecognitions = usePdsStore((state) => state.deletedRecognitions);
  const deletedReferences = usePdsStore((state) => state.deletedReferences);
  const setSelectedTab = useTabStore((state) => state.setSelectedTab);

  const handlePrevTab = useTabStore((state) => state.handlePrevTab);

  const personalInfo = {
    firstName: pds.personalInfo.firstName,
    middleName: pds.personalInfo.middleName,
    lastName: pds.personalInfo.lastName,
    nameExtension: pds.personalInfo.nameExtension,
    email: pds.personalInfo.email,
  };

  // fetch the updated and deleted arrays
  const fetchUpdatedArrays = () => {
    const children = AssignChildrenForUpdating(pds.children, deletedChildren);
    const vocational = AssignEducationForUpdating(pds.vocational, deletedVocationals);
    const college = AssignEducationForUpdating(pds.college, deletedColleges);
    const graduate = AssignEducationForUpdating(pds.graduate, deletedGraduates);
    const eligibility = AssignEligibilitiesForUpdating(pds.eligibility, deletedEligibilities);
    const workExperience = AssignWorkExperiencesForUpdating(pds.workExperience, deletedWorkExperiences);
    const voluntaryWork = AssignVoluntaryWorksForUpdating(pds.voluntaryWork, deletedVolWorks);
    const learningDevelopment = AssignLearningDevelopmentsForUpdating(
      pds.learningDevelopment,
      deletedLearningDevelopments
    );
    const skill = AssignSkillsForUpdating(pds.skills, deletedSkills);
    const organization = AssignOrganizationsForUpdating(pds.organizations, deletedOrganizations);
    const recognition = AssignRecognitionsForUpdating(pds.recognitions, deletedRecognitions);
    const reference = AssignReferencesForUpdating(pds.references, deletedReferences);
    return {
      children,
      vocational,
      college,
      graduate,
      eligibility,
      workExperience,
      voluntaryWork,
      learningDevelopment,
      skill,
      organization,
      recognition,
      reference,
    };
  };

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  // fire submit
  const handleSubmit = async () => {
    // set disabled button to true
    setIsDisabled(true);

    // set loading to true upon click
    setIsLoading(true);

    // set timeout callback function and sets the loading to false after the timeout

    const applicantData = await postApplicantData();

    setIsConfirmationPressed(true);

    return { error: applicantData.error, result: applicantData.result };
  };

  const alertConfirmationAction = async () => {
    const submitResponse = await handleSubmit();

    if (submitResponse.error === true) {
      setIsError(true);
      setIsLoading(false);
    } else if (submitResponse.error === false) {
      setIsError(false);
      setIsLoading(false);
    }
  };

  // post data
  const postApplicantData = async () => {
    if (isExistingApplicant === false) {
      // post route for not existing applicants
      // const { data, status } = await axios.post(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/new/${publication.vppId}`, {
      //   personalInfo,
      //   pds,
      // })

      // post pds route
      const { error, result } = await postData(
        `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/new/${publication.vppId}`,
        {
          personalInfo,
          pds,
        }
      );

      return { error, result };
    } else if (isExistingApplicant === true) {
      const updatePds = {
        personalInfo: pds.personalInfo,
        governmentIssuedIds: pds.governmentIssuedIds,
        residentialAddress: pds.residentialAddress,
        permanentAddress: pds.permanentAddress,
        spouse: pds.spouse,
        parents: pds.parents,
        children: fetchUpdatedArrays().children,
        elementary: pds.elementary,
        secondary: pds.secondary,
        vocational: fetchUpdatedArrays().vocational,
        college: fetchUpdatedArrays().college,
        graduate: fetchUpdatedArrays().graduate,
        eligibility: fetchUpdatedArrays().eligibility,
        workExperience: fetchUpdatedArrays().workExperience,
        voluntaryWork: fetchUpdatedArrays().voluntaryWork,
        learningDevelopment: fetchUpdatedArrays().learningDevelopment,
        skills: fetchUpdatedArrays().skill,
        recognitions: fetchUpdatedArrays().recognition,
        organizations: fetchUpdatedArrays().organization,
        officeRelation: pds.officeRelation,
        guiltyCharged: pds.guiltyCharged,
        convicted: pds.convicted,
        separatedService: pds.separatedService,
        candidateResigned: pds.candidateResigned,
        immigrant: pds.immigrant,
        indigenousPwdSoloParent: pds.indigenousPwdSoloParent,
        references: fetchUpdatedArrays().reference,
        governmentIssuedId: pds.governmentIssuedId,
      };

      // udpate pds route
      const { error, result } = await putData(
        `${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/pds/${applicant.applicantId}`,
        updatePds
      );

      return { error, result };
    }
  };

  // success action
  const alertSuccessAction = async () => {
    if (isExistingApplicant === false) {
      await axios.post(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/auth/logout`, {}, { withCredentials: true });

      await postData(`${process.env.NEXT_PUBLIC_HRIS_DOMAIN}/external-applicants/${publication.vppId}`, {
        email: pds.personalInfo.email,
      });

      router.push(`${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${publication.vppId}/email?sent=true`);
      setSelectedTab(1);
    } else if (isExistingApplicant === true) {
      router.push(`${process.env.NEXT_PUBLIC_JOB_PORTAL}/application/${publication.vppId}/checklist`);
      setSelectedTab(1);
    }

    setAlertSuccess(false);
  };

  const alertFailedAction = () => {
    // setAlertConfirmation(false);
    setAlertFailed(false);
  };

  useEffect(() => {
    setIsDisabled(false);
    if (isError === true && isConfirmationPressed) {
      setAlertConfirmation(false);
      setTimeout(() => {
        setAlertFailed(true);
      }, 300);
    } else if (isError === false && isConfirmationPressed) {
      setAlertConfirmation(false);
      setTimeout(() => {
        setAlertSuccess(true);
      }, 300);
    }
    setIsDisabled(false);
    setIsError(false);
    setIsConfirmationPressed(false);
  }, [isError, isConfirmationPressed]);

  return (
    <>
      <HeadContainer title="PDS - Submit Personal Data Sheet" />

      {/**Alert Confirmation */}
      <Alert open={alertConfirmation} setOpen={setAlertConfirmation}>
        <Alert.Description>
          <PdsAlertSubmitConfirmation />
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <Button
              onClick={() => setAlertConfirmation(false)}
              variant="default"
              className="min-w-[5rem]"
              disabled={isDisabled ? true : false}
            >
              No
            </Button>

            <Button onClick={alertConfirmationAction} className="min-w-[5rem]" disabled={isDisabled ? true : false}>
              {isLoading ? <div className="text-white">Submitting</div> : 'Yes'}
            </Button>
          </div>
        </Alert.Footer>
      </Alert>

      {/**Alert Success */}
      <Alert open={alertSuccess} setOpen={setAlertSuccess}>
        <Alert.Description>
          <PdsAlertSubmitSuccess text={isExistingApplicant ? 'updated' : 'submitted'} />
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <div className="max-w-auto min-w-[5rem]">
              <Button onClick={alertSuccessAction} disabled={isDisabled ? true : false}>
                <div className="text-white">Go back to Checklist</div>
              </Button>
            </div>
          </div>
        </Alert.Footer>
      </Alert>

      {/**Alert Failed */}
      <Alert open={alertFailed} setOpen={setAlertFailed}>
        <Alert.Description>
          <PdsAlertSubmitFailed />
        </Alert.Description>
        <Alert.Footer alignEnd>
          <div className="flex gap-2">
            <div className="max-w-auto min-w-[5rem]">
              <Button onClick={alertFailedAction} disabled={isDisabled ? true : false}>
                <div className="text-white">Close</div>
              </Button>
            </div>
          </div>
        </Alert.Footer>
      </Alert>

      {/* Submit Page */}
      <Page title="" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full justify-between px-[5%]">
              <SolidPrevButton onClick={handlePrevTab} type="button" />
            </div>
          )}
          <Card title="" subtitle="" className="lg:mx-[18%] sm:mx-[5%]  px-[5%] ">
            <div className="flex h-fit gap-2">
              <div className="w-[15%]">
                <HiExclamationCircle color="orange" className="w-full h-full" />
              </div>
              <div className="flex w-[85%] flex-col justify-center">
                <div className="pt-3 text-2xl font-medium">Information</div>
                <p className="pb-2 font-light">
                  Any misrepresentation made in the Personal Data Sheet and the Work Experience Sheet shall cause the
                  filing of administrative or criminal case(s) against the person concerned.
                </p>
              </div>
            </div>
          </Card>
          {/* PDS Submit Button */}
          <div className="mx-[18%] my-10 flex flex-col">
            <button
              className={`${
                isLoading
                  ? `cursor-progress bg-indigo-400`
                  : `  bg-slate-700 transition-colors hover:bg-slate-400 hover:shadow-xl hover:shadow-indigo-200 focus:outline-none focus:ring focus:ring-indigo-300 active:bg-indigo-700`
              } w-full rounded-md border border-violet-200 px-5 py-4  text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105`}
              onClick={() => setAlertConfirmation(true)}
              disabled={isDisabled ? true : false}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium uppercase">
                  {isLoading
                    ? 'Processing'
                    : isExistingApplicant
                    ? 'Update Personal Data Sheet'
                    : !isExistingApplicant
                    ? 'Submit Personal Data Sheet'
                    : ''}
                </span>
                {isLoading && <LoadingIndicator size={5} />}
              </span>
            </button>
          </div>
        </>
      </Page>
      {/* PREV BUTTON */}
      {!isMobile && <PrevButton action={() => handlePrevTab()} type="button" />}
    </>
  );
}
