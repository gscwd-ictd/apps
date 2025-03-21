/* eslint-disable @nx/enforce-module-boundaries */
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';
import { useContext } from 'react';
import { TabActions } from '../../../../utils/helpers/enums/toast.enum';
import { useTabStore } from '../../../store/tab.store';
import { Page } from '../../modular/pages/Page';
import { HeadContainer } from '../head/Head';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { Toast } from '../toast/Toast';
import { OIOrgs } from './other-info/Organizations';
import { OIRecogs } from './other-info/Recogs';
import { OISkills } from './other-info/Skills';
import { PageContentContext } from '@gscwd-apps/oneui';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';
import { SolidNextButton } from '../navigation/button/SolidNextButton';

export default function OtherInfoPanel(): JSX.Element {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const skillsOnEdit = usePdsStore((state) => state.skillsOnEdit);
  const recognitionsOnEdit = usePdsStore((state) => state.recognitionsOnEdit);
  const organizationsOnEdit = usePdsStore((state) => state.organizationsOnEdit);

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  // notification context
  const { notify } = useContext(NotificationContext);

  // fire when next button is clicked
  const onSubmit = () => {
    if (hasPds && !skillsOnEdit && !recognitionsOnEdit && !organizationsOnEdit) handleNextTab(selectedTab);
    else if (hasPds && (skillsOnEdit || recognitionsOnEdit || organizationsOnEdit)) addNotification(TabActions.NEXT);
    else if (!hasPds) handleNextTab(selectedTab);
  };

  // prev button
  const onPrev = () => {
    if (hasPds && !skillsOnEdit && !recognitionsOnEdit && !organizationsOnEdit) handlePrevTab(selectedTab);
    else if (hasPds && (skillsOnEdit || recognitionsOnEdit || organizationsOnEdit))
      addNotification(TabActions.PREVIOUS);
    else if (!hasPds) handlePrevTab(selectedTab);
  };

  const addNotification = (action: TabActions) => {
    const notification = notify.custom(
      <Toast variant="error" dismissAction={() => notify.dismiss(notification.id)}>
        {action === TabActions.NEXT
          ? 'Cannot proceed to the next tab. Either undo or update your changes to proceed.'
          : action === TabActions.PREVIOUS
          ? 'Cannot go back to the previous tab. Either undo or update your changes to proceed.'
          : ''}
      </Toast>
    );
    //You cannot proceed to the next tab. Either undo or update your changes to proceed.
  };

  return (
    <>
      <HeadContainer title="PDS - Other Information" />
      <Page title="Other Information I" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full gap-1 justify-between pt-6">
              <SolidPrevButton onClick={onPrev} type="button" />
              <SolidNextButton onClick={onSubmit} type="button" />
            </div>
          )}
          <OISkills />
          <OIRecogs />
          <OIOrgs />
          {isMobile && (
            <div className="flex w-full gap-1 justify-between pt-6">
              <SolidPrevButton onClick={onPrev} type="button" />
              <SolidNextButton onClick={onSubmit} type="button" />
            </div>
          )}
        </>
      </Page>

      {!isMobile && (
        <>
          <PrevButton action={onPrev} type="button" />
          <NextButton action={onSubmit} type="button" />
        </>
      )}
    </>
  );
}
