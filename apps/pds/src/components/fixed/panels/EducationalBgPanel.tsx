/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Page } from '../../modular/pages/Page';
import { Elementary } from './education/Elementary';
import { Secondary } from './education/Secondary';
import { College } from './education/College';
import { Vocational } from './education/Vocational';
import { Graduate } from './education/Graduate';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PrevButton } from '../navigation/button/PrevButton';
import { NextButton } from '../navigation/button/NextButton';
import schema from '../../../schema/EducationInfo';
import { useTabStore } from '../../../store/tab.store';
import { HeadContainer } from '../head/Head';
import { Toast } from '../toast/Toast';
import { useContext } from 'react';
import { TabActions } from '../../../../utils/helpers/enums/toast.enum';
import { trimmer } from '../../../../utils/functions/trimmer';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';
import { useEmployeeStore } from 'apps/pds/src/store/employee.store';
import { usePdsStore } from 'apps/pds/src/store/pds.store';

// yup validation schema

export const EducationalBgPanel = (): JSX.Element => {
  // set tab state from tab store
  const selectedTab = useTabStore((state) => state.selectedTab);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const elementaryOnEdit = usePdsStore((state) => state.elementaryOnEdit);
  const secondaryOnEdit = usePdsStore((state) => state.secondaryOnEdit);
  const vocationalOnEdit = usePdsStore((state) => state.vocationalOnEdit);
  const collegeOnEdit = usePdsStore((state) => state.collegeOnEdit);
  const graduateOnEdit = usePdsStore((state) => state.graduateOnEdit);
  const elementary = usePdsStore((state) => state.elementary);
  const secondary = usePdsStore((state) => state.secondary);
  const setSecondary = usePdsStore((state) => state.setSecondary);
  const setElementary = usePdsStore((state) => state.setElementary);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const { notify } = useContext(NotificationContext);

  // assigns the use form to 'methods', yup resolver to yup schema, and mode is onchange
  const methods = useForm({ resolver: yupResolver(schema), mode: 'onChange' });

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

  // fire when next button is clicked
  const onSubmit: SubmitHandler<any> = () => {
    setElementary({
      ...elementary,
      schoolName: trimmer(elementary.schoolName!),
      degree: trimmer(elementary.degree!),
      awards: trimmer(elementary.awards!),
    });

    setSecondary({
      ...secondary,
      schoolName: trimmer(secondary.schoolName!),
      degree: trimmer(secondary.degree!),
      awards: trimmer(secondary.awards!),
    });

    if (
      (hasPds &&
        !elementaryOnEdit &&
        !secondaryOnEdit &&
        !vocationalOnEdit &&
        !collegeOnEdit &&
        !graduateOnEdit) ||
      !hasPds
    )
      handleNextTab(selectedTab);
    else if (
      hasPds &&
      (elementaryOnEdit ||
        secondaryOnEdit ||
        vocationalOnEdit ||
        collegeOnEdit ||
        graduateOnEdit)
    )
      addNotification(TabActions.NEXT);
  };

  // prev button
  const onPrev = () => {
    if (
      (hasPds &&
        !elementaryOnEdit &&
        !secondaryOnEdit &&
        !vocationalOnEdit &&
        !collegeOnEdit &&
        !graduateOnEdit) ||
      !hasPds
    )
      handlePrevTab(selectedTab);
    else if (
      hasPds &&
      (elementaryOnEdit ||
        secondaryOnEdit ||
        vocationalOnEdit ||
        collegeOnEdit ||
        graduateOnEdit)
    )
      addNotification(TabActions.PREVIOUS);
  };

  return (
    <>
      <HeadContainer title="PDS - Educational Background" />
      <Page title="Educational Background" subtitle="">
        <>
          <FormProvider {...methods} key="educationInfo">
            <form onSubmit={methods.handleSubmit(onSubmit)} id="educationInfo">
              <Elementary />
              <Secondary />
              <Vocational />
              <College />
              <Graduate />
            </form>
          </FormProvider>
        </>
      </Page>
      <PrevButton action={onPrev} type="button" />
      <NextButton formId="educationInfo" />
    </>
  );
};
