import { useContext } from 'react';
import { useTabStore } from '../../../store/tab.store';
import { Page } from '../../modular/pages/Page';
import { HeadContainer } from '../head/Head';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { OIOrgs } from './other-info/Organizations';
import { OIRecogs } from './other-info/Recogs';
import { OISkills } from './other-info/Skills';
import { PageContentContext } from '@gscwd-apps/oneui';
import { SolidNextButton } from '../navigation/button/SolidNextButton';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';

export default function OtherInfoPanel(): JSX.Element {
  // set tab state from tab store

  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  return (
    <>
      <HeadContainer title="PDS - Other Information" />
      <Page title="Other Information I" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full justify-between ">
              <SolidPrevButton onClick={handlePrevTab} type="button" />
              <SolidNextButton onClick={handleNextTab} type="button" />
            </div>
          )}
          <OISkills />
          <OIRecogs />
          <OIOrgs />
        </>
        {isMobile && (
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
