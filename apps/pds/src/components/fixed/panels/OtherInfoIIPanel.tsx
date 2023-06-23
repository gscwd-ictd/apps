/* eslint-disable @nx/enforce-module-boundaries */
import { Page } from '../../modular/pages/Page';
import { SupportingDetails } from './other-info/SupportingDetails';
import { OIGovtID } from './other-info/GovernmentIssuedId';
import { OIReferences } from './other-info/References';
import { useContext, useEffect } from 'react';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RefErrorContext } from '../../../context/RefErrorContext';
import { PrevButton } from '../navigation/button/PrevButton';
import { NextButton } from '../navigation/button/NextButton';
import schema from '../../../schema/OtherInfoII';
import { usePdsStore } from '../../../store/pds.store';
import { useTabStore } from '../../../store/tab.store';
import { HeadContainer } from '../head/Head';
import { TabActions } from '../../../../utils/helpers/enums/toast.enum';
import { Toast } from '../toast/Toast';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';

export default function OtherInfoIIPanel(): JSX.Element {
  // call references array from pds context
  const selectedTab = useTabStore((state) => state.selectedTab);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const references = usePdsStore((state) => state.references);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const referencesOnEdit = usePdsStore((state) => state.referencesOnEdit);
  const governmentIssuedIdOnEdit = usePdsStore(
    (state) => state.governmentIssuedIdOnEdit
  );
  const supportingInfoOnEdit = usePdsStore(
    (state) => state.supportingInfoOnEdit
  );
  const { notify } = useContext(NotificationContext);
  // call ref error from ref error context
  const { setRefError, refRef, shake, refError, setShake } =
    useContext(RefErrorContext);

  // assign use form function to a 'method' constant, yup resolver scema, mode is on change
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    // defaultValues: { offRelThird: -1, offRelFourth: -2 },
    // SupportingDetailsForm & Reference & GovtIssuedIdForm
  });

  // on submit listener
  const onSubmit: SubmitHandler<any> = () => {
    // --
    if (references.length === 3) {
      setRefError(false);
    } else if (references.length < 3) {
      setShake(true);
      setRefError(true);
    }

    // --
    if (hasPds) {
      if (
        references.length === 3 &&
        !referencesOnEdit &&
        !governmentIssuedIdOnEdit &&
        !supportingInfoOnEdit
      ) {
        handleNextTab(selectedTab);
      } else if (
        !referencesOnEdit ||
        !governmentIssuedIdOnEdit ||
        !supportingInfoOnEdit
      ) {
        addNotification(TabActions.NEXT);
      }
    } else if (!hasPds) {
      if (
        references.length === 3 &&
        !referencesOnEdit &&
        !governmentIssuedIdOnEdit &&
        !supportingInfoOnEdit
      ) {
        handleNextTab(selectedTab);
      } else if (
        !referencesOnEdit ||
        !governmentIssuedIdOnEdit ||
        !supportingInfoOnEdit
      ) {
        addNotification(TabActions.NEXT);
      }
    }
  };

  const onPrev = () => {
    if (
      hasPds &&
      !referencesOnEdit &&
      !governmentIssuedIdOnEdit &&
      !supportingInfoOnEdit
    )
      handlePrevTab(selectedTab);
    else if (
      hasPds &&
      (referencesOnEdit || governmentIssuedIdOnEdit || supportingInfoOnEdit)
    )
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

  useEffect(() => {
    if (shake && refError) refRef.current.focus();
  }, [shake, refError]);

  return (
    <>
      <HeadContainer title="PDS - Supporting Information" />
      <Page title="Other Information II" subtitle="">
        <>
          <FormProvider {...methods} key="otherInfoII">
            <form onSubmit={methods.handleSubmit(onSubmit)} id="otherInfoII">
              <SupportingDetails />
              <OIReferences />
              <OIGovtID />
            </form>
          </FormProvider>
        </>
      </Page>
      <PrevButton action={onPrev} type="button" />
      {hasPds ? (
        <>
          <NextButton action={onSubmit} type="button" />
        </>
      ) : (
        <NextButton formId="otherInfoII" />
      )}
    </>
  );
}
