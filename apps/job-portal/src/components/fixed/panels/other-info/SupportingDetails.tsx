/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable react/no-unescaped-entities */
import { SupportingDetailsForm } from 'apps/job-portal/utils/types/data/supporting-info.type';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useApplicantStore } from '../../../../store/applicant.store';
import { usePdsStore } from '../../../../store/pds.store';
import { Card } from '../../../modular/cards/Card';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { RadioButtonRF } from '../../../modular/radio/RadioButtonRF';
import RadioGroup from '../../../modular/radio/RadioGroup';

export const SupportingDetails = (): JSX.Element => {
  // invoke objects from pds context
  const officeRelation = usePdsStore((state) => state.officeRelation);
  const guiltyCharged = usePdsStore((state) => state.guiltyCharged);
  const convicted = usePdsStore((state) => state.convicted);
  const separatedService = usePdsStore((state) => state.separatedService);
  const candidateResigned = usePdsStore((state) => state.candidateResigned);
  const immigrant = usePdsStore((state) => state.immigrant);
  const indigenousPwdSoloParent = usePdsStore((state) => state.indigenousPwdSoloParent);
  const setOfficeRelation = usePdsStore((state) => state.setOfficeRelation);
  const setGuiltyCharged = usePdsStore((state) => state.setGuiltyCharged);
  const setConvicted = usePdsStore((state) => state.setConvicted);
  const setSeparatedService = usePdsStore((state) => state.setSeparatedService);
  const setCandidateResigned = usePdsStore((state) => state.setCandidateResigned);
  const setImmigrant = usePdsStore((state) => state.setImmigrant);
  const setIndigenousPwdSoloParent = usePdsStore((state) => state.setIndigenousPwdSoloParent);
  const {
    register,
    clearErrors,
    setValue,
    formState: { errors },
  } = useFormContext<SupportingDetailsForm>();

  // office relation (Third Degree) handler
  const offRelThirdHandler = (e: any) => {
    if (parseInt(e.target.value) === 1) setOfficeRelation({ ...officeRelation, withinThirdDegree: true });
    else if (parseInt(e.target.value) === 0) setOfficeRelation({ ...officeRelation, withinThirdDegree: false });
  };

  // office relation (Fourth Degree) Handler
  const offRelFourthHandler = (e: any) => {
    if (parseInt(e.target.value) === 1) setOfficeRelation({ ...officeRelation, withinFourthDegree: true });
    else if (parseInt(e.target.value) === 0) setOfficeRelation({ ...officeRelation, withinFourthDegree: false });
  };

  // is guilty handler
  const isGuiltyHandler = (e: any) => {
    if (parseInt(e.target.value) === 1) setGuiltyCharged({ ...guiltyCharged, isGuilty: true });
    else if (parseInt(e.target.value) === 0) setGuiltyCharged({ ...guiltyCharged, isGuilty: false });
  };

  // is charged handler
  const isChargedHandler = (e: any) => {
    if (parseInt(e.target.value) === 1) setGuiltyCharged({ ...guiltyCharged, isCharged: true });
    else if (parseInt(e.target.value) === 0) setGuiltyCharged({ ...guiltyCharged, isCharged: false });
  };

  // is convicted handler
  const isConvictedHandler = (e: any) => {
    if (parseInt(e.target.value) === 1) setConvicted({ ...convicted, isConvicted: true });
    else if (parseInt(e.target.value) === 0) setConvicted({ ...convicted, isConvicted: false });
  };

  // is separated handler
  const isSeparatedHandler = (e: any) => {
    if (parseInt(e.target.value) === 1) setSeparatedService({ ...separatedService, isSeparated: true });
    else if (parseInt(e.target.value) === 0) setSeparatedService({ ...separatedService, isSeparated: false });
  };

  // is candidate handler
  const isCandidateHandler = (e: any) => {
    if (parseInt(e.target.value) === 1) setCandidateResigned({ ...candidateResigned, isCandidate: true });
    else if (parseInt(e.target.value) === 0) setCandidateResigned({ ...candidateResigned, isCandidate: false });
  };

  // is resigned handler
  const isResignedHandler = (e: any) => {
    if (parseInt(e.target.value) === 1) setCandidateResigned({ ...candidateResigned, isResigned: true });
    else if (parseInt(e.target.value) === 0) setCandidateResigned({ ...candidateResigned, isResigned: false });
  };

  // is immigrant handler
  const isImmigrantHandler = (e: any) => {
    if (parseInt(e.target.value) === 1) setImmigrant({ ...immigrant, isImmigrant: true });
    else if (parseInt(e.target.value) === 0) setImmigrant({ ...immigrant, isImmigrant: false });
  };

  // is indigenous handler
  const isIndigenousHandler = (e: any) => {
    if (parseInt(e.target.value) === 1)
      setIndigenousPwdSoloParent({
        ...indigenousPwdSoloParent,
        isIndigenousMember: true,
      });
    else if (parseInt(e.target.value) === 0)
      setIndigenousPwdSoloParent({
        ...indigenousPwdSoloParent,
        isIndigenousMember: false,
      });
  };

  // is pwd handler
  const isPWDHandler = (e: any) => {
    if (parseInt(e.target.value) === 1) setIndigenousPwdSoloParent({ ...indigenousPwdSoloParent, isPwd: true });
    else if (parseInt(e.target.value) === 0) setIndigenousPwdSoloParent({ ...indigenousPwdSoloParent, isPwd: false });
  };

  // is solo parent handler
  const isSoloParentHandler = (e: any) => {
    if (parseInt(e.target.value) === 1)
      setIndigenousPwdSoloParent({
        ...indigenousPwdSoloParent,
        isSoloParent: true,
      });
    else if (parseInt(e.target.value) === 0)
      setIndigenousPwdSoloParent({
        ...indigenousPwdSoloParent,
        isSoloParent: false,
      });
  };

  // reset details value to empty string when radio button is false
  useEffect(() => {
    if (
      officeRelation.withinThirdDegree.toString() === 'false' &&
      officeRelation.withinFourthDegree.toString() === 'false'
    ) {
      setValue('offRelDetails', '');
      setOfficeRelation({ ...officeRelation, details: '' });
      clearErrors('offRelDetails');
    }
  }, [officeRelation.withinThirdDegree, officeRelation.withinFourthDegree]);

  // reset details value to empty string when radio button is false
  useEffect(() => {
    if (guiltyCharged.isGuilty.toString() === 'false') {
      setValue('guiltyDetails', '');
      setGuiltyCharged({ ...guiltyCharged, guiltyDetails: '' });
      clearErrors('guiltyDetails');
    }
  }, [guiltyCharged.isGuilty]);

  // reset details value to empty string when radio button is false
  useEffect(() => {
    if (guiltyCharged.isCharged.toString() === 'false') {
      setGuiltyCharged({
        ...guiltyCharged,
        chargedDateFiled: '',
        chargedCaseStatus: '',
      });
      setValue('chargedDateFiled', '');
      setValue('chargedCaseStatus', '');
      clearErrors('chargedCaseStatus');
      clearErrors('chargedDateFiled');
    }
  }, [guiltyCharged.isCharged]);

  // reset details value to empty string when radio button is false
  useEffect(() => {
    if (convicted.isConvicted.toString() === 'false') {
      setConvicted({ ...convicted, details: '' });

      setValue('convictedDetails', '');
      clearErrors('convictedDetails');
    }
  }, [convicted.isConvicted]);

  // reset details value to empty string when radio button is false
  useEffect(() => {
    if (separatedService.isSeparated.toString() === 'false') {
      setSeparatedService({ ...separatedService, details: '' });
      setValue('separatedDetails', '');
      clearErrors('separatedDetails');
    }
  }, [separatedService.isSeparated]);

  // reset details value to empty string when radio button is false
  useEffect(() => {
    if (candidateResigned.isCandidate.toString() === 'false') {
      setCandidateResigned({ ...candidateResigned, candidateDetails: '' });
      setValue('candidateDetails', '');
      clearErrors('candidateDetails');
    }
  }, [candidateResigned.isCandidate]);

  //Reset details value to empty string when radio button is false
  useEffect(() => {
    if (candidateResigned.isResigned.toString() === 'false') {
      setCandidateResigned({ ...candidateResigned, resignedDetails: '' });
      setValue('resignedDetails', '');
      clearErrors('resignedDetails');
    }
  }, [candidateResigned.isResigned]);

  // reset details value to empty string when radio button is false
  useEffect(() => {
    if (immigrant.isImmigrant.toString() === 'false') {
      setImmigrant({ ...immigrant, details: '' });
      setValue('immigrantDetails', '');
      clearErrors('immigrantDetails');
    }
  }, [immigrant.isImmigrant]);

  // reset details value to empty string when radio button is false
  useEffect(() => {
    if (indigenousPwdSoloParent.isIndigenousMember.toString() === 'false') {
      setIndigenousPwdSoloParent({
        ...indigenousPwdSoloParent,
        indigenousMemberDetails: '',
      });
      setValue('indigenousMemberDetails', '');
      clearErrors('indigenousMemberDetails');
    }
  }, [indigenousPwdSoloParent.isIndigenousMember]);

  // reset details value to empty string when radio button is false
  useEffect(() => {
    if (indigenousPwdSoloParent.isPwd.toString() === 'false') {
      setIndigenousPwdSoloParent({
        ...indigenousPwdSoloParent,
        pwdIdNumber: '',
      });
      setValue('pwdIdNumber', '');
      clearErrors('pwdIdNumber');
    }
  }, [indigenousPwdSoloParent.isPwd]);

  // reset details value to empty string when radio button is false
  useEffect(() => {
    if (indigenousPwdSoloParent.isSoloParent.toString() === 'false') {
      setIndigenousPwdSoloParent({
        ...indigenousPwdSoloParent,
        soloParentIdNumber: '',
      });
      setValue('soloParentIdNumber', '');
      clearErrors('soloParentIdNumber');
    }
  }, [indigenousPwdSoloParent.isSoloParent]);

  return (
    <>
      <Card title="" subtitle="">
        <>
          <div>
            <div className="pb-4">
              Are you related by consanguinity or affinity to the appointing or recommending authority, or to the chief
              of bureau or office or to the person who has immediate supervision over you in the Office, Bureau or
              Department where you will be apppointed,
            </div>
            <div> a. Within the third degree? </div>

            <RadioGroup groupName="offRelThird" className="w-32 border-0" isFlex={true} onChange={offRelThirdHandler}>
              <>
                <RadioButtonRF
                  id={'relthirdtrue'}
                  label={'Yes'}
                  controller={{ ...register('offRelThird', { value: 1 }) }}
                  value={1}
                  checked={officeRelation.withinThirdDegree.toString() === 'true' ? true : false}
                />
                <RadioButtonRF
                  id={'relthirdfalse'}
                  label={'No'}
                  controller={{ ...register('offRelThird', { value: 0 }) }}
                  value={0}
                  checked={officeRelation.withinThirdDegree.toString() === 'false' ? true : false}
                />
              </>
            </RadioGroup>
          </div>

          <div>
            <div>b. Within the fourth degree (for Local Government Unit - Career Employees)?</div>

            <RadioGroup groupName="offRelFourth" className="w-32" isFlex={true} onChange={offRelFourthHandler}>
              <>
                <RadioButtonRF
                  id={'relfourthtrue'}
                  label={'Yes'}
                  controller={{ ...register('offRelFourth', { value: 1 }) }}
                  value={1}
                  checked={officeRelation.withinFourthDegree.toString() === 'true' ? true : false}
                />
                <RadioButtonRF
                  id={'relfourthfalse'}
                  label={'No'}
                  controller={{ ...register('offRelFourth', { value: 0 }) }}
                  value={0}
                  checked={officeRelation.withinFourthDegree.toString() === 'false' ? true : false}
                />
              </>
            </RadioGroup>

            <div className="my-2 ">
              <FloatingLabelInputRF
                roundedSize="md"
                id="officereldetails"
                placeholder="Provide details"
                type="text"
                controller={{
                  ...register('offRelDetails', {
                    value: officeRelation.details,
                    onChange: (e) =>
                      setOfficeRelation({
                        ...officeRelation,
                        details: e.target.value,
                      }),
                  }),
                }}
                hidden={
                  officeRelation.withinThirdDegree.toString() === 'true' ||
                  officeRelation.withinFourthDegree.toString() === 'true'
                    ? false
                    : officeRelation.withinFourthDegree.toString() === 'false' &&
                      officeRelation.withinThirdDegree.toString() === 'false'
                    ? true
                    : false
                }
                isError={errors.offRelDetails ? true : false}
                errorMessage={errors.offRelDetails?.message}
              />
            </div>
          </div>
        </>
      </Card>

      <Card title="" subtitle="">
        <>
          <div className="pb-4">
            <div>a. Have you ever been found guilty of any administrative offense?</div>
            <RadioGroup groupName="guilty" className="w-32" isFlex onChange={isGuiltyHandler}>
              <>
                <RadioButtonRF
                  id={'guiltytrue'}
                  label={'Yes'}
                  controller={{ ...register('isGuilty', { value: 1 }) }}
                  value={1}
                  checked={guiltyCharged.isGuilty.toString() === 'true' ? true : false}
                />
                <RadioButtonRF
                  id={'guiltyfalse'}
                  label={'No'}
                  controller={{ ...register('isGuilty', { value: 0 }) }}
                  value={0}
                  checked={guiltyCharged.isGuilty.toString() === 'false' ? true : false}
                />
              </>
            </RadioGroup>

            <div className="my-2">
              <FloatingLabelInputRF
                roundedSize="md"
                id="guiltydetails"
                placeholder="Provide details"
                type="text"
                controller={{
                  ...register('guiltyDetails', {
                    value: guiltyCharged.guiltyDetails,
                    onChange: (e) =>
                      setGuiltyCharged({
                        ...guiltyCharged,
                        guiltyDetails: e.target.value,
                      }),
                  }),
                }}
                hidden={
                  guiltyCharged.isGuilty.toString() === 'true'
                    ? false
                    : guiltyCharged.isGuilty.toString() === 'false'
                    ? true
                    : false
                }
                isError={errors.guiltyDetails ? true : false}
                errorMessage={errors.guiltyDetails?.message}
              />
            </div>
          </div>

          <div className="pt-5">
            <div>b. Have you been criminally charged before any court?</div>

            <RadioGroup groupName="charged" className="w-32" isFlex={true} onChange={isChargedHandler}>
              <>
                <RadioButtonRF
                  id={'chargedtrue'}
                  label={'Yes'}
                  controller={{ ...register('isCharged', { value: 1 }) }}
                  value={1}
                  checked={guiltyCharged.isCharged.toString() === 'true' ? true : false}
                />
                <RadioButtonRF
                  id={'chargedfalse'}
                  label={'No'}
                  controller={{ ...register('isCharged', { value: 0 }) }}
                  value={0}
                  checked={guiltyCharged.isCharged.toString() === 'false' ? true : false}
                />
              </>
            </RadioGroup>

            <div>
              <FloatingLabelInputRF
                id="chargeddatedetails"
                roundedSize="md"
                placeholder="Provide the date(s) in MM/DD/YYYY format, separate with comma if multiple"
                controller={{
                  ...register('chargedDateFiled', {
                    value: guiltyCharged.chargedDateFiled,
                    onChange: (e) =>
                      setGuiltyCharged({
                        ...guiltyCharged,
                        chargedDateFiled: e.target.value,
                      }),
                  }),
                }}
                hidden={guiltyCharged.isCharged.toString() === 'true' ? false : true}
                isError={errors.chargedDateFiled ? true : false}
                errorMessage={errors.chargedDateFiled?.message}
              />
            </div>

            <div>
              <FloatingLabelInputRF
                id="chargedcasestatusdetails"
                roundedSize="md"
                placeholder="Status of Case"
                className="mt-5"
                controller={{
                  ...register('chargedCaseStatus', {
                    value: guiltyCharged.chargedCaseStatus,
                    onChange: (e) =>
                      setGuiltyCharged({
                        ...guiltyCharged,
                        chargedCaseStatus: e.target.value,
                      }),
                  }),
                }}
                hidden={guiltyCharged.isCharged.toString() === 'true' ? false : true}
                isError={errors.chargedCaseStatus ? true : false}
                errorMessage={errors.chargedCaseStatus?.message}
              />
            </div>
          </div>
        </>
      </Card>

      <Card title="" subtitle="">
        <>
          <div className="pb-4">
            Have you ever been convicted of any crime or violation of any law, decree, ordinance or regulation by any
            court or tribunal?
          </div>
          <RadioGroup groupName="convicted" className="w-32" isFlex onChange={isConvictedHandler}>
            <>
              <RadioButtonRF
                id={'convtrue'}
                label={'Yes'}
                controller={{ ...register('isConvicted', { value: 1 }) }}
                value={1}
                checked={convicted.isConvicted.toString() === 'true' ? true : false}
              />
              <RadioButtonRF
                id={'convfalse'}
                label={'No'}
                controller={{ ...register('isConvicted', { value: 0 }) }}
                value={0}
                checked={convicted.isConvicted.toString() === 'false' ? true : false}
              />
            </>
          </RadioGroup>

          <div>
            <FloatingLabelInputRF
              id="convdetails"
              roundedSize="md"
              className="my-2"
              placeholder="Provide details"
              controller={{
                ...register('convictedDetails', {
                  value: convicted.details,
                  onChange: (e) => setConvicted({ ...convicted, details: e.target.value }),
                }),
              }}
              hidden={convicted.isConvicted.toString() === 'true' ? false : true}
              isError={errors.convictedDetails ? true : false}
              errorMessage={errors.convictedDetails?.message}
            />
          </div>
        </>
      </Card>
      <Card title="" subtitle="">
        <>
          <div className="pb-4">
            Have you ever been separated from the service in any of the following modes: resignation, retirement,
            dropped from the rolls, dismissal, termination, end of term, finished contract or phased out (abolition) in
            the public or private sector?{' '}
          </div>

          <RadioGroup groupName="sepServ" className="w-32" isFlex onChange={isSeparatedHandler}>
            <>
              <RadioButtonRF
                id={'sepservtrue'}
                label={'Yes'}
                controller={{ ...register('isSeparated', { value: 1 }) }}
                value={1}
                checked={separatedService.isSeparated.toString() === 'true' ? true : false}
              />
              <RadioButtonRF
                id={'sepservfalse'}
                label={'No'}
                controller={{ ...register('isSeparated', { value: 0 }) }}
                value={0}
                checked={separatedService.isSeparated.toString() === 'false' ? true : false}
              />
            </>
          </RadioGroup>

          <div>
            <FloatingLabelInputRF
              id="sepservdetails"
              roundedSize="md"
              className="my-2"
              placeholder="Provide details"
              controller={{
                ...register('separatedDetails', {
                  value: separatedService.details,
                  onChange: (e) =>
                    setSeparatedService({
                      ...separatedService,
                      details: e.target.value,
                    }),
                }),
              }}
              hidden={separatedService.isSeparated.toString() === 'true' ? false : true}
              isError={errors.separatedDetails ? true : false}
              errorMessage={errors.separatedDetails?.message}
            />
          </div>
        </>
      </Card>

      <Card title="" subtitle="">
        <>
          <div>
            <div>
              a. Have you ever been a candidate in a national or local election held within the last year (except
              Barangay election)?
            </div>
            <RadioGroup groupName="candidate" className="w-32" isFlex onChange={isCandidateHandler}>
              <>
                <RadioButtonRF
                  id={'candtrue'}
                  label={'Yes'}
                  controller={{ ...register('isCandidate', { value: 1 }) }}
                  value={1}
                  checked={candidateResigned.isCandidate.toString() === 'true' ? true : false}
                />
                <RadioButtonRF
                  id={'candfalse'}
                  label={'No'}
                  controller={{ ...register('isCandidate', { value: 0 }) }}
                  value={0}
                  checked={candidateResigned.isCandidate.toString() === 'false' ? true : false}
                />
              </>
            </RadioGroup>

            <div>
              <FloatingLabelInputRF
                id="canddetails"
                roundedSize="md"
                className="my-2"
                placeholder="Provide details"
                controller={{
                  ...register('candidateDetails', {
                    value: candidateResigned.candidateDetails,
                    onChange: (e) =>
                      setCandidateResigned({
                        ...candidateResigned,
                        candidateDetails: e.target.value,
                      }),
                  }),
                }}
                hidden={candidateResigned.isCandidate.toString() === 'true' ? false : true}
                isError={errors.candidateDetails ? true : false}
                errorMessage={errors.candidateDetails?.message}
              />
            </div>
          </div>

          <div className="pt-5">
            <div>
              b. Have you resigned from the government service during the three (3)-month period before the last
              election to promote/actively campaign for a national or local candidate?
            </div>
            <RadioGroup groupName="resGovtServ" className="w-32" isFlex onChange={isResignedHandler}>
              <>
                <RadioButtonRF
                  id={'restrue'}
                  label={'Yes'}
                  controller={{ ...register('isResigned', { value: 1 }) }}
                  value={1}
                  checked={candidateResigned.isResigned.toString() === 'true' ? true : false}
                />
                <RadioButtonRF
                  id={'resfalse'}
                  label={'No'}
                  controller={{ ...register('isResigned', { value: 0 }) }}
                  value={0}
                  checked={candidateResigned.isResigned.toString() === 'false' ? true : false}
                />
              </>
            </RadioGroup>

            <div>
              <FloatingLabelInputRF
                id="resdetails"
                roundedSize="md"
                className="my-2"
                placeholder="Provide details"
                controller={{
                  ...register('resignedDetails', {
                    value: candidateResigned.resignedDetails,
                    onChange: (e) =>
                      setCandidateResigned({
                        ...candidateResigned,
                        resignedDetails: e.target.value,
                      }),
                  }),
                }}
                hidden={candidateResigned.isResigned.toString() === 'true' ? false : true}
                isError={errors.resignedDetails ? true : false}
                errorMessage={errors.resignedDetails?.message}
              />
            </div>
          </div>
        </>
      </Card>

      <Card title="" subtitle="">
        <>
          <div className="pb-4">
            Have you acquired the status of an immigrant or permanent resident of another country?
          </div>
          <RadioGroup groupName="immigrant" className="w-32" isFlex onChange={isImmigrantHandler}>
            <>
              <RadioButtonRF
                id={'immigranttrue'}
                label={'Yes'}
                controller={{ ...register('isImmigrant', { value: 1 }) }}
                value={1}
                checked={immigrant.isImmigrant.toString() === 'true' ? true : false}
              />
              <RadioButtonRF
                id={'immigrantfalse'}
                label={'No'}
                controller={{ ...register('isImmigrant', { value: 0 }) }}
                value={0}
                checked={immigrant.isImmigrant.toString() === 'false' ? true : false}
              />
            </>
          </RadioGroup>

          <div>
            <FloatingLabelInputRF
              id="immigrantdetails"
              roundedSize="md"
              placeholder="Provide details"
              className="my-2"
              controller={{
                ...register('immigrantDetails', {
                  value: immigrant.details,
                  onChange: (e) => setImmigrant({ ...immigrant, details: e.target.value }),
                }),
              }}
              hidden={immigrant.isImmigrant.toString() === 'true' ? false : true}
              isError={errors.immigrantDetails ? true : false}
              errorMessage={errors.immigrantDetails?.message}
            />
          </div>
        </>
      </Card>
      <Card title="" subtitle="">
        <>
          <div>
            <h4>
              Pursuant to: (a) Indigenous People&apos;s Act (RA 8371); (b) Magna Carta for Disabled Persons (RA 7277),
              as amended; and (c) Expanded Solo Parents Welfare Act (RA 11861), please answer the following items:
            </h4>
            <h4>a. Are you a member of any indigenous group?</h4>
            <RadioGroup groupName="indigenous" className="w-32" isFlex onChange={isIndigenousHandler}>
              <>
                <RadioButtonRF
                  id={'indigenoustrue'}
                  label={'Yes'}
                  controller={{
                    ...register('isIndigenousMember', { value: 1 }),
                  }}
                  value={1}
                  checked={indigenousPwdSoloParent.isIndigenousMember.toString() === 'true' ? true : false}
                />
                <RadioButtonRF
                  id={'indigenousfalse'}
                  label={'No'}
                  controller={{
                    ...register('isIndigenousMember', { value: 0 }),
                  }}
                  value={0}
                  checked={indigenousPwdSoloParent.isIndigenousMember.toString() === 'false' ? true : false}
                />
              </>
            </RadioGroup>

            <div>
              <FloatingLabelInputRF
                id="indigenousmemberdetails"
                roundedSize="md"
                className="my-2"
                placeholder="Provide details"
                controller={{
                  ...register('indigenousMemberDetails', {
                    value: indigenousPwdSoloParent.indigenousMemberDetails,
                    onChange: (e) =>
                      setIndigenousPwdSoloParent({
                        ...indigenousPwdSoloParent,
                        indigenousMemberDetails: e.target.value,
                      }),
                  }),
                }}
                hidden={indigenousPwdSoloParent.isIndigenousMember.toString() === 'true' ? false : true}
                isError={errors.indigenousMemberDetails ? true : false}
                errorMessage={errors.indigenousMemberDetails?.message}
              />
            </div>
          </div>

          <div className="pt-5">
            <h4>b. Are you a person with disability?</h4>
            <RadioGroup groupName="pwd" className="w-32" isFlex onChange={isPWDHandler}>
              <>
                <RadioButtonRF
                  id={'pwdtrue'}
                  label={'Yes'}
                  controller={{ ...register('isPwd', { value: 1 }) }}
                  value={1}
                  checked={indigenousPwdSoloParent.isPwd.toString() === 'true' ? true : false}
                />
                <RadioButtonRF
                  id={'pwdfalse'}
                  label={'No'}
                  controller={{ ...register('isPwd', { value: 0 }) }}
                  value={0}
                  checked={indigenousPwdSoloParent.isPwd.toString() === 'false' ? true : false}
                />
              </>
            </RadioGroup>

            <div>
              <FloatingLabelInputRF
                id="pwddetails"
                roundedSize="md"
                className="my-2"
                placeholder="Specify ID No"
                controller={{
                  ...register('pwdIdNumber', {
                    value: indigenousPwdSoloParent.pwdIdNumber,
                    onChange: (e) =>
                      setIndigenousPwdSoloParent({
                        ...indigenousPwdSoloParent,
                        pwdIdNumber: e.target.value,
                      }),
                  }),
                }}
                hidden={indigenousPwdSoloParent.isPwd.toString() === 'true' ? false : true}
                isError={errors.pwdIdNumber ? true : false}
                errorMessage={errors.pwdIdNumber?.message}
              />
            </div>
          </div>

          <div className="pt-5">
            <h4>c. Are you a solo parent?</h4>
            <RadioGroup groupName="soloparent" className="w-32" isFlex onChange={isSoloParentHandler}>
              <>
                <RadioButtonRF
                  id={'soloparenttrue'}
                  label={'Yes'}
                  controller={{ ...register('isSoloParent', { value: 1 }) }}
                  value={1}
                  checked={indigenousPwdSoloParent.isSoloParent.toString() === 'true' ? true : false}
                />
                <RadioButtonRF
                  id={'soloparentfalse'}
                  label={'No'}
                  controller={{ ...register('isSoloParent', { value: 0 }) }}
                  value={0}
                  checked={indigenousPwdSoloParent.isSoloParent.toString() === 'false' ? true : false}
                />
              </>
            </RadioGroup>

            <div>
              <FloatingLabelInputRF
                id="soloparentdetails"
                roundedSize="md"
                className="my-2"
                placeholder="Specify ID No"
                controller={{
                  ...register('soloParentIdNumber', {
                    value: indigenousPwdSoloParent.soloParentIdNumber,
                    onChange: (e) =>
                      setIndigenousPwdSoloParent({
                        ...indigenousPwdSoloParent,
                        soloParentIdNumber: e.target.value,
                      }),
                  }),
                }}
                hidden={indigenousPwdSoloParent.isSoloParent.toString() === 'true' ? false : true}
                isError={errors.soloParentIdNumber ? true : false}
                errorMessage={errors.soloParentIdNumber?.message}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
