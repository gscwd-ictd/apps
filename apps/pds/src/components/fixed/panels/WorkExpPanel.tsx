/* eslint-disable @nrwl/nx/enforce-module-boundaries */
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
import { WorkExp } from './work-experience/WorkExperience';

export default function WorkExpPanel(): JSX.Element {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const workExperienceOnEdit = usePdsStore(
    (state) => state.workExperienceOnEdit
  );
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const { notify } = useContext(NotificationContext);

  // fire when next button is clicked
  const onSubmit = () => {
    if (hasPds && !workExperienceOnEdit) handleNextTab(selectedTab);
    else if (hasPds && workExperienceOnEdit) addNotification(TabActions.NEXT);
    else if (!hasPds) handleNextTab(selectedTab);
  };

  // prev button
  const onPrev = () => {
    if (hasPds && !workExperienceOnEdit) handlePrevTab(selectedTab);
    else if (hasPds && workExperienceOnEdit)
      addNotification(TabActions.PREVIOUS);
    else if (!hasPds) handlePrevTab(selectedTab);
  };

  const addNotification = (action: TabActions) => {
    const notification = notify.custom(
      <Toast
        variant="error"
        dismissAction={() => notify.dismiss(notification.id)}
      >
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
      <HeadContainer title="PDS - Work Experience" />
      <Page title="Work Experience" subtitle="">
        <>
          <WorkExp />
        </>
      </Page>
      <PrevButton action={onPrev} type="button" />

      <NextButton action={onSubmit} type="button" />
    </>
  );
}
