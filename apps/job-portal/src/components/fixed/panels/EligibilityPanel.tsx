import { useContext } from 'react';
import { useTabStore } from '../../../store/tab.store';
import { Page } from '../../modular/pages/Page';
import { HeadContainer } from '../head/Head';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { CSEligibility } from './eligibility/CSEligibility';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';
import { SolidNextButton } from '../navigation/button/SolidNextButton';
import { usePdsStore } from 'apps/job-portal/src/store/pds.store';
import { PageContentContext } from '../page/PageContent';

export default function EligibilityPanel(): JSX.Element {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);

  // eligibility
  const eligibility = usePdsStore((state) => state.eligibility);

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  return (
    <>
      <HeadContainer title="PDS - Eligibility" />

      <Page title="Eligibility" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full justify-between ">
              <SolidPrevButton onClick={handlePrevTab} type="button" />
              <SolidNextButton onClick={handleNextTab} type="button" />
            </div>
          )}
          <CSEligibility />
        </>
        {isMobile && eligibility.length > 6 && (
          <div className="flex w-full justify-between pt-4">
            <SolidPrevButton onClick={handlePrevTab} type="button" />
            <SolidNextButton onClick={handleNextTab} type="button" />
          </div>
        )}
      </Page>

      {!isMobile && (
        <>
          <PrevButton action={handlePrevTab} type="button" />
          <NextButton action={handleNextTab} type="button" />
        </>
      )}
    </>
  );
}
