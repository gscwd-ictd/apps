import { useTabStore } from '../../../store/tab.store';
import { Page } from '../../modular/pages/Page';
import { HeadContainer } from '../head/Head';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { CSEligibility } from './eligibility/CSEligibility';

export default function EligibilityPanel(): JSX.Element {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);

  return (
    <>
      <HeadContainer title="PDS - Eligibility" />
      <Page title="Eligibility" subtitle="">
        <>
          <CSEligibility />
        </>
      </Page>

      <PrevButton action={() => handlePrevTab()} type="button" />

      <NextButton action={() => handleNextTab()} type="button" />
    </>
  );
}
