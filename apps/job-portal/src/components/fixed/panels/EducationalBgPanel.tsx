import { Page } from '../../modular/pages/Page';
import { Elementary } from './education/Elementary';
import { Secondary } from './education/Secondary';
import { College } from './education/College';
import { Vocational } from './education/Vocational';
import { Graduate } from './education/Graduate';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PrevButton } from '../navigation/button/PrevButton';
import { NextButton } from '../navigation/button/NextButton';
import schema from '../../../schema/EducationInfo';
import { useTabStore } from '../../../store/tab.store';
import { HeadContainer } from '../head/Head';
import { useContext } from 'react';
import { PageContentContext } from '@gscwd-apps/oneui';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';
import { SolidNextButton } from '../navigation/button/SolidNextButton';

// yup validation schema

export const EducationalBgPanel = (): JSX.Element => {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);

  // assigns the use form to 'methods', yup resolver to yup schema, and mode is onchange
  const methods = useForm({ resolver: yupResolver(schema), mode: 'onChange' });

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  // fire when next button is clicked
  const onSubmit: SubmitHandler<any> = () => {
    handleNextTab();
  };

  return (
    <>
      <HeadContainer title="PDS - Educational Background" />
      <Page title="Educational Background" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full justify-between ">
              <SolidPrevButton onClick={() => handlePrevTab()} type="button" />
              <SolidNextButton formId="educationInfo" />
            </div>
          )}
          <FormProvider {...methods} key="educationInfo">
            <form onSubmit={methods.handleSubmit(onSubmit)} id="educationInfo">
              <Elementary />
              <Secondary />
              <Vocational />
              <College />
              <Graduate />
            </form>
          </FormProvider>
          {isMobile && (
            <div className="flex w-full justify-between pt-4">
              <SolidPrevButton onClick={() => handlePrevTab()} />
              <SolidNextButton formId="educationInfo" />
            </div>
          )}
        </>
      </Page>
      {!isMobile && (
        <>
          <PrevButton action={() => handlePrevTab()} type="button" />
          <NextButton formId="educationInfo" />
        </>
      )}
    </>
  );
};
