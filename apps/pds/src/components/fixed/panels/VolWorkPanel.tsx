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
import { VolWorkExp } from './voluntary-experience/VolWorkExp';
import { PageContentContext } from '@gscwd-apps/oneui';
import { SolidPrevButton } from '../navigation/button/SolidPrevButton';
import { SolidNextButton } from '../navigation/button/SolidNextButton';

export default function VolWorkPanel(): JSX.Element {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const voluntaryWorkOnEdit = usePdsStore((state) => state.voluntaryWorkOnEdit);
  const voluntaryWork = usePdsStore((state) => state.voluntaryWork);
  const { notify } = useContext(NotificationContext);

  // page context
  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  // fire when next button is clicked
  const onSubmit = () => {
    if (hasPds && !voluntaryWorkOnEdit) handleNextTab(selectedTab);
    else if (hasPds && voluntaryWorkOnEdit) addNotification(TabActions.NEXT);
    else if (!hasPds) handleNextTab(selectedTab);
  };

  // prev button
  const onPrev = () => {
    if (hasPds && !voluntaryWorkOnEdit) handlePrevTab(selectedTab);
    else if (hasPds && voluntaryWorkOnEdit) addNotification(TabActions.PREVIOUS);
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
      <HeadContainer title="PDS - Voluntary Work" />

      <Page title="Voluntary Work Experience" subtitle="">
        <>
          {isMobile && (
            <div className="flex w-full gap-1 justify-between pt-6">
              <SolidPrevButton onClick={onPrev} type="button" />
              <SolidNextButton onClick={onSubmit} type="button" />
            </div>
          )}
          <VolWorkExp />
        </>
      </Page>
      {!isMobile && (
        <>
          <PrevButton action={onPrev} type="button" />
          <NextButton action={onSubmit} type="button" />
        </>
      )}

      {isMobile && voluntaryWork.length > 3 && (
        <div className="flex w-full gap-1 justify-between pt-6">
          <SolidPrevButton onClick={onPrev} type="button" />
          <SolidNextButton onClick={onSubmit} type="button" />
        </div>
      )}
    </>
  );
}
