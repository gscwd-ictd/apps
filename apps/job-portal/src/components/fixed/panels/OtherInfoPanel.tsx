import { useTabStore } from '../../../store/tab.store';
import { Page } from '../../modular/pages/Page';
import { HeadContainer } from '../head/Head';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { OIOrgs } from './other-info/Organizations';
import { OIRecogs } from './other-info/Recogs';
import { OISkills } from './other-info/Skills';

export default function OtherInfoPanel(): JSX.Element {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);

  return (
    <>
      <HeadContainer title="PDS - Other Information" />
      <Page title="Other Information I" subtitle="">
        <>
          <OISkills />
          <OIRecogs />
          <OIOrgs />
        </>
      </Page>
      <PrevButton action={() => handlePrevTab()} type="button" />
      <NextButton action={() => handleNextTab()} type="button" />
    </>
  );
}
