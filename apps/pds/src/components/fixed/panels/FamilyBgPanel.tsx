/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import React, { useContext, useEffect } from 'react';
import { Page } from '../../modular/pages/Page';
import { NextButton } from '../navigation/button/NextButton';
import { PrevButton } from '../navigation/button/PrevButton';
import { ChildrenInfo } from './family/Children';
import { FatherInfo } from './family/Father';
import { MotherInfo } from './family/Mother';
import { SpouseInfo } from './family/Spouse';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from '../../../schema/FamilyInfo';
import { useTabStore } from '../../../store/tab.store';
import { usePdsStore } from '../../../store/pds.store';
import { useEmployeeStore } from '../../../store/employee.store';
import { HeadContainer } from '../head/Head';
import { Toast } from '../toast/Toast';
import { TabActions } from '../../../../utils/helpers/enums/toast.enum';
import { trimmer } from '../../../../utils/functions/trimmer';
import { isEmpty } from 'lodash';
import { NotificationContext } from 'apps/pds/src/context/NotificationContext';

export default function FamilyBgPanel(): JSX.Element {
  // set parents object state, employee object, and pds object from the pds store
  const { parents, setParents } = usePdsStore((state) => ({
    parents: state.parents,
    setParents: state.setParents,
  }));
  const employee = useEmployeeStore((state) => state.employeeDetails);
  // set tab state from tab store
  const spouse = usePdsStore((state) => state.spouse);
  const selectedTab = useTabStore((state) => state.selectedTab);
  const spouseOnEdit = usePdsStore((state) => state.spouseOnEdit);
  const motherOnEdit = usePdsStore((state) => state.motherOnEdit);
  const fatherOnEdit = usePdsStore((state) => state.fatherOnEdit);
  const childrenOnEdit = usePdsStore((state) => state.childrenOnEdit);
  const setSpouse = usePdsStore((state) => state.setSpouse);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const handlePrevTab = useTabStore((state) => state.handlePrevTab);
  const { notify } = useContext(NotificationContext);
  const hasPds = useEmployeeStore((state) => state.hasPds);

  // assign the useform hook to 'methods', set the resolver to yup resolver schema
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

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
  };

  // when submit is fired
  const onSubmit = () => {
    // trim spouse
    setSpouse({
      ...spouse,
      lastName: trimmer(spouse.lastName),
      firstName: trimmer(spouse.firstName),
      middleName: trimmer(spouse.middleName),
      nameExtension: spouse.nameExtension
        ? trimmer(spouse.nameExtension)
        : undefined,
      employer: trimmer(spouse.employer),
      businessAddress: trimmer(spouse.businessAddress),
      telephoneNumber: trimmer(spouse.telephoneNumber),
      occupation: trimmer(spouse.occupation),
    });

    // trim father's or mother's info
    setParents({
      ...parents,
      fatherLastName: trimmer(parents.fatherLastName),
      fatherFirstName: trimmer(parents.fatherFirstName),
      fatherMiddleName: trimmer(parents.fatherMiddleName),
      fatherNameExtension: !isEmpty(parents.fatherNameExtension)
        ? trimmer(parents.fatherNameExtension)
        : 'N/A',
      motherLastName: trimmer(parents.motherLastName),
      motherFirstName: trimmer(parents.motherFirstName),
      // motherMaidenName: trimmer(parents.motherMaidenName!),
      motherMiddleName: trimmer(parents.motherMiddleName),
    });

    if (!spouseOnEdit && !fatherOnEdit && !motherOnEdit && !childrenOnEdit)
      handleNextTab(selectedTab);
    else if (spouseOnEdit || fatherOnEdit || motherOnEdit || childrenOnEdit) {
      addNotification(TabActions.PREVIOUS);
    }
  };

  // prev button
  const onPrev = () => {
    if (
      hasPds &&
      !spouseOnEdit &&
      !fatherOnEdit &&
      !motherOnEdit &&
      !childrenOnEdit
    )
      handlePrevTab(selectedTab);
    else if (
      hasPds &&
      (spouseOnEdit || fatherOnEdit || motherOnEdit || childrenOnEdit)
    )
      addNotification(TabActions.PREVIOUS);
    else if (!hasPds) handlePrevTab(selectedTab);
  };

  // assigns the employee id on page load
  useEffect(
    () =>
      setParents({ ...parents, employeeId: employee.employmentDetails.userId }),
    []
  );

  return (
    <>
      <HeadContainer title="PDS - Family Information" />
      <Page title="Family Information" subtitle="">
        <>
          <FormProvider {...methods} key="familyInfo">
            <form onSubmit={methods.handleSubmit(onSubmit)} id="familyInfo">
              <SpouseInfo />
              <FatherInfo />
              <MotherInfo />
              <ChildrenInfo />
            </form>
          </FormProvider>
        </>
      </Page>
      <PrevButton action={onPrev} type="button" />
      <NextButton formId="familyInfo" />
    </>
  );
}
