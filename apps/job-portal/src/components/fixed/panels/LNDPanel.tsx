import { usePdsStore } from 'apps/job-portal/src/store/pds.store';
import { useTabStore } from '../../../store/tab.store';
import { Page } from '../../modular/pages/Page';
import { HeadContainer } from '../head/Head';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { LearningNDevt } from './learning-and-devt/LND';
import { useContext } from 'react';
import { SolidNextButton } from '../navigation/button/SolidNextButton';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';
import { PageContentContext } from '../page/PageContent';

export default function LNDPanel(): JSX.Element {
  // set tab state from misc context
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const learningDevelopment = usePdsStore((state) => state.learningDevelopment);

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  return (
    <>
      <HeadContainer title="PDS - Learning & Dev't" />
      <Page title="Learning & Development" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full justify-between ">
              <SolidPrevButton onClick={handlePrevTab} type="button" />
              <SolidNextButton onClick={handleNextTab} type="button" />
            </div>
          )}
          <LearningNDevt />
        </>
        {isMobile && learningDevelopment.length > 6 && (
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
