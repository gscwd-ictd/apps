import { Page } from '../../modular/pages/Page';
import { SupportingDetails } from './other-info/SupportingDetails';
import { OIGovtID } from './other-info/GovtIssuedIds';
import { OIReferences } from './other-info/References';
import { useContext, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RefErrorContext } from '../../../context/RefErrorContext';
import { PrevButton } from '../navigation/button/PrevButton';
import { NextButton } from '../navigation/button/NextButton';
import schema from '../../../schema/OtherInfoII';
import { usePdsStore } from '../../../store/pds.store';
import { useTabStore } from '../../../store/tab.store';
import { HeadContainer } from '../head/Head';
import { PageContentContext } from '@gscwd-apps/oneui';
import { SolidNextButton } from '../navigation/button/SolidNextButton';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';

export default function OtherInfoIIPanel(): JSX.Element {
  // call references array from pds context

  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const references = usePdsStore((state) => state.references);

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  // call ref error from ref error context
  const { setRefError, refRef, shake, refError, setShake } = useContext(RefErrorContext);

  // assign use form function to a 'method' constant, yup resolver scema, mode is on change
  const methods = useForm({ resolver: yupResolver(schema), mode: 'onChange' });

  // on submit listener
  const onSubmit = () => {
    if (references.length === 3) {
      setRefError(false);
      handleNextTab();
    } else if (references.length < 3) {
      setShake(true);
      setRefError(true);
    }
  };

  useEffect(() => {
    if (shake && refError) refRef.current.focus();
  }, [shake, refError]);

  return (
    <>
      <HeadContainer title="PDS - Supporting Information" />
      <Page title="Other Information II" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full justify-between ">
              <SolidPrevButton onClick={handlePrevTab} type="button" />
              <SolidNextButton formId="otherInfoII" />
            </div>
          )}
          <FormProvider {...methods} key="otherInfoII">
            <form onSubmit={methods.handleSubmit(onSubmit)} id="otherInfoII">
              <SupportingDetails />
              <OIReferences />
              <OIGovtID />
            </form>
          </FormProvider>
        </>
        {isMobile && (
          <div className="flex w-full justify-between pt-4">
            <SolidPrevButton onClick={handlePrevTab} type="button" />
            <SolidNextButton formId="otherInfoII" />
          </div>
        )}
      </Page>

      {!isMobile && (
        <>
          <PrevButton action={handlePrevTab} type="button" />
          <NextButton formId="otherInfoII" />
        </>
      )}
    </>
  );
}
