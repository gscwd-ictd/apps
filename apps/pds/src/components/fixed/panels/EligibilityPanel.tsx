import { NotificationContext } from 'context/NotificationContext';
import { useContext } from 'react';
import { useEmployeeStore } from 'store/employee.store';
import { usePdsStore } from 'store/pds.store';
import { TabActions } from '../../../../utils/helpers/enums/toast.enum';
import { useTabStore } from '../../../store/tab.store';
import { Page } from '../../modular/pages/Page';
import { HeadContainer } from '../head/Head';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { Toast } from '../toast/Toast';
import { CSEligibility } from './eligibility/CSEligibility';

export default function EligibilityPanel(): JSX.Element {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const eligibilityOnEdit = usePdsStore((state) => state.eligibilityOnEdit);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const { notify } = useContext(NotificationContext);

  // fire when next button is clicked
  const onSubmit = () => {
    if (hasPds && !eligibilityOnEdit) handleNextTab(selectedTab);
    else if (hasPds && eligibilityOnEdit) addNotification(TabActions.NEXT);
    else if (!hasPds) handleNextTab(selectedTab);
  };

  // prev button
  const onPrev = () => {
    if (hasPds && !eligibilityOnEdit) handlePrevTab(selectedTab);
    else if (hasPds && eligibilityOnEdit) addNotification(TabActions.PREVIOUS);
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
      <HeadContainer title="PDS - Eligibility" />
      <Page
        title="Eligibility"
        subtitle=""
        children={
          <>
            <CSEligibility />
          </>
        }
      />

      <PrevButton action={onPrev} type="button" />

      <NextButton action={onSubmit} type="button" />
    </>
  );
}