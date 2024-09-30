import { useContext } from 'react';
import { useTabStore } from '../../../store/tab.store';
import { Page } from '../../modular/pages/Page';
import { HeadContainer } from '../head/Head';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { WorkExp } from './work-experience/WorkExperience';
import { PageContentContext } from '@gscwd-apps/oneui';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';
import { SolidNextButton } from '../navigation/button/SolidNextButton';
import { usePdsStore } from 'apps/job-portal/src/store/pds.store';

export default function WorkExpPanel(): JSX.Element {
  // set tab state from tab store
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const workExperience = usePdsStore((state) => state.workExperience);

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  return (
    <>
      <HeadContainer title="PDS - Work Experience" />
      <Page title="Work Experience" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full justify-between ">
              <SolidPrevButton onClick={handlePrevTab} type="button" />
              <SolidNextButton onClick={handleNextTab} type="button" />
            </div>
          )}
          <WorkExp />
          {isMobile && workExperience.length > 6 && (
            <div className="flex w-full justify-between pt-4">
              <SolidPrevButton onClick={handlePrevTab} type="button" />
              <SolidNextButton onClick={handleNextTab} type="button" />
            </div>
          )}
        </>
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
