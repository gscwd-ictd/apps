import Head from 'next/head';
import { useTabStore } from '../../../store/tab.store';
import { Page } from '../../modular/pages/Page';
import { HeadContainer } from '../head/Head';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { VolWorkExp } from './voluntary-experience/VolWorkExp';
import { useContext } from 'react';
import { PageContentContext } from '@gscwd-apps/oneui';
import { usePdsStore } from 'apps/job-portal/src/store/pds.store';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';
import { SolidNextButton } from '../navigation/button/SolidNextButton';

export default function VolWorkPanel(): JSX.Element {
  // set tab state from tab store

  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const voluntaryWork = usePdsStore((state) => state.voluntaryWork);

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  return (
    <>
      <HeadContainer title="PDS - Voluntary Work" />

      <Page title="Voluntary Work Experience" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full justify-between ">
              <SolidPrevButton onClick={handlePrevTab} type="button" />
              <SolidNextButton onClick={handleNextTab} type="button" />
            </div>
          )}
          <VolWorkExp />
        </>
      </Page>
      {isMobile && voluntaryWork.length > 6 && (
        <div className="flex w-full justify-between pt-4">
          <SolidPrevButton onClick={handlePrevTab} type="button" />
          <SolidNextButton onClick={handleNextTab} type="button" />
        </div>
      )}

      {!isMobile && (
        <>
          <PrevButton action={handlePrevTab} type="button" />
          <NextButton action={handleNextTab} type="button" />
        </>
      )}
    </>
  );
}
