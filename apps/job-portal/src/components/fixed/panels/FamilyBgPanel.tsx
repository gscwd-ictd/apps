import Head from 'next/head';
import React, { useContext, useEffect } from 'react';
import { Page } from '../../modular/pages/Page';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { ChildrenInfo } from './family/Children';
import { FatherInfo } from './family/Father';
import { MotherInfo } from './family/Mother';
import { SpouseInfo } from './family/Spouse';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from '../../../schema/FamilyInfo';
import { useTabStore } from '../../../store/tab.store';
import { usePdsStore } from '../../../store/pds.store';
import { useEmployeeStore } from '../../../store/employee.store';
import { HeadContainer } from '../head/Head';
import { useApplicantStore } from '../../../store/applicant.store';
import { PageContentContext } from '@gscwd-apps/oneui';
import { SolidNextButton } from '../navigation/button/SolidNextButton';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';

export default function FamilyBgPanel(): JSX.Element {
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  // assign the useform hook to 'methods', set the resolver to yup resolver schema
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  // when submit is fired
  const onSubmit = () => handleNextTab();
  return (
    <>
      <HeadContainer title="PDS - Family Information" />
      <Page title="Family Information" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full justify-between">
              <SolidPrevButton onClick={() => handlePrevTab()} />
              <SolidNextButton formId="familyInfo" />
            </div>
          )}
          <FormProvider {...methods} key="familyInfo">
            <form onSubmit={methods.handleSubmit(onSubmit)} id="familyInfo">
              <SpouseInfo />
              <FatherInfo />
              <MotherInfo />
              <ChildrenInfo />
            </form>
          </FormProvider>
        </>
        {isMobile && (
          <div className="flex w-full justify-between pt-4">
            <SolidPrevButton onClick={() => handlePrevTab()} />
            <SolidNextButton formId="familyInfo" />
          </div>
        )}
      </Page>
      {!isMobile && (
        <>
          <PrevButton action={() => handlePrevTab()} type="button" />
          <NextButton formId="familyInfo" />
        </>
      )}
    </>
  );
}
