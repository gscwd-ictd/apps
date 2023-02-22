import { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Page } from '../../modular/pages/Page';
import { AddressBI } from './basic-info/Address';
import { GovernmentIDsBI, PersonalInfoBI } from './basic-info/_index';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from '../../../schema/BasicInfo';
import { ErrorState } from '../../../context/types/state';
import { NextButton } from '../navigation/button/NextButton';
import { isEmpty } from 'lodash';
import { ErrorContext } from '../../../context/ErrorContext';
import { useTabStore } from '../../../store/tab.store';
import { usePdsStore } from '../../../store/pds.store';
import { HeadContainer } from '../head/Head';
import { Toast } from '../toast/Toast';
import { useEffect } from 'react';
import { trimmer } from '../../../../utils/functions/trimmer';
import { NotificationContext } from '../../../context/NotificationContext';

export const BasicInfoPanel = (): JSX.Element => {
  const personalInfo = usePdsStore((state) => state.personalInfo);
  const selectedTab = useTabStore((state) => state.selectedTab);
  const permanentAddress = usePdsStore((state) => state.permanentAddress);
  const personalInfoOnEdit = usePdsStore((state) => state.personalInfoOnEdit);
  const residentialAddress = usePdsStore((state) => state.residentialAddress); // residential and permanent address object from pds store
  const governmentIssuedIds = usePdsStore((state) => state.governmentIssuedIds);
  const permanentAddressOnEdit = usePdsStore((state) => state.permanentAddressOnEdit);
  const residentialAddressOnEdit = usePdsStore((state) => state.residentialAddressOnEdit);
  const governmentIssuedIdsOnEdit = usePdsStore((state) => state.governmentIssuedIdsOnEdit);
  const handleNextTab = useTabStore((state) => state.handleNextTab);
  const setPersonalInfo = usePdsStore((state) => state.setPersonalInfo);
  const setPermanentAddress = usePdsStore((state) => state.setPermanentAddress);
  const setResidentialAddress = usePdsStore((state) => state.setResidentialAddress);
  const setGovernmentIssuedIds = usePdsStore((state) => state.setGovernmentIssuedIds);
  const { setResAddrError, setPermaAddrError, permaAddrRef, permaAddrError, resAddrError, resAddrRef, shake, setShake } =
    useContext<ErrorState>(ErrorContext); // set address error and reference from error context
  const { notify } = useContext(NotificationContext);

  // assign the useform hook to 'methods', set the resolver to yup resolver schema, mode is set to onchange
  const methods = useForm({ resolver: yupResolver(schema), mode: 'onChange' });

  const addNotification = () => {
    const notification = notify.custom(
      <Toast variant="error" dismissAction={() => notify.dismiss(notification.id)}>
        Cannot proceed to the next tab. Either undo or update your changes to proceed.
      </Toast>
    );
  };

  // assigned to next button which also functions as a submit button somehow
  const onSubmit = () => {
    // personal info trimmer
    setPersonalInfo({
      ...personalInfo,
      lastName: trimmer(personalInfo.lastName),
      firstName: trimmer(personalInfo.firstName),
      middleName: trimmer(personalInfo.middleName),
      nameExtension: trimmer(personalInfo.nameExtension),
      birthPlace: trimmer(personalInfo.birthPlace),
    });

    // government issued ids info trimmer
    setGovernmentIssuedIds({
      ...governmentIssuedIds,
      gsisNumber: trimmer(governmentIssuedIds.gsisNumber),
      sssNumber: trimmer(governmentIssuedIds.sssNumber),
      pagibigNumber: trimmer(governmentIssuedIds.pagibigNumber),
      tinNumber: trimmer(governmentIssuedIds.tinNumber),
      philhealthNumber: trimmer(governmentIssuedIds.philhealthNumber),
      agencyNumber: trimmer(governmentIssuedIds.agencyNumber),
    });

    // residential address info trimmer
    setResidentialAddress({
      ...residentialAddress,
      houseNumber: trimmer(residentialAddress.houseNumber),
      street: trimmer(residentialAddress.street),
      subdivision: trimmer(residentialAddress.subdivision),
    });

    // permanent address info trimmer
    setPermanentAddress({
      ...permanentAddress,
      houseNumber: trimmer(permanentAddress.houseNumber),
      street: trimmer(permanentAddress.street),
      subdivision: trimmer(permanentAddress.subdivision),
    });

    if (!personalInfoOnEdit && !governmentIssuedIdsOnEdit && !residentialAddressOnEdit && !permanentAddressOnEdit) {
      /**
       *  if any of the listed residential address fields are empty
       *  it sets the error to true
       *  and sets the focus on the div where the error was set to true
       *
       */
      if (
        isEmpty(residentialAddress.houseNumber) ||
        isEmpty(residentialAddress.street) ||
        isEmpty(residentialAddress.subdivision) ||
        isEmpty(residentialAddress.province) ||
        isEmpty(residentialAddress.city) ||
        isEmpty(residentialAddress.barangay) ||
        isEmpty(residentialAddress.zipCode)
      ) {
        setResAddrError(true);
        setShake(true);
        // resAddrRef.current.focus();
      }

      /**
       *  if any of the listed permanent address fields are empty
       *  it sets the error to true
       *  and sets the focus on the div where the error was set to true
       *
       */
      if (
        isEmpty(permanentAddress.houseNumber) ||
        isEmpty(permanentAddress.street) ||
        isEmpty(permanentAddress.subdivision) ||
        isEmpty(permanentAddress.province) ||
        isEmpty(permanentAddress.city) ||
        isEmpty(permanentAddress.barangay) ||
        isEmpty(permanentAddress.zipCode)
      ) {
        setPermaAddrError(true);
        setShake(true);
        // permaAddrRef.current.focus();
      }
      /**
       *  when pressed, if both the residential address and permanent address fields are not empty
       *  and all the required inputs are valid
       *  it allows the next tab to be navigated
       */
      if (
        !isEmpty(residentialAddress.houseNumber) &&
        !isEmpty(residentialAddress.street) &&
        !isEmpty(residentialAddress.subdivision) &&
        !isEmpty(residentialAddress.province) &&
        !isEmpty(residentialAddress.city) &&
        !isEmpty(residentialAddress.barangay) &&
        !isEmpty(residentialAddress.zipCode) &&
        !isEmpty(permanentAddress.houseNumber) &&
        !isEmpty(permanentAddress.street) &&
        !isEmpty(permanentAddress.subdivision) &&
        !isEmpty(permanentAddress.province) &&
        !isEmpty(permanentAddress.city) &&
        !isEmpty(permanentAddress.barangay) &&
        !isEmpty(permanentAddress.zipCode)
      ) {
        // invokes the handle next tab function
        // and passes the value of selected tab as a prop to the function
        handleNextTab(selectedTab);
        // localStorage.setItem('')
      }
    } else if (personalInfoOnEdit || governmentIssuedIdsOnEdit || residentialAddressOnEdit || permanentAddressOnEdit) {
      // setAlertInfoIsOpen(true);
      addNotification();
    }
  };

  // invokes focus for residential address error
  useEffect(() => {
    if (resAddrError && shake) resAddrRef.current.focus();
  }, [shake, resAddrError]);

  // invokes focus for permanent address error
  useEffect(() => {
    if (permaAddrError && shake) permaAddrRef.current.focus();
  }, [shake, permaAddrError]);

  return (
    <>
      <HeadContainer title="PDS - Basic Information" />

      {/* Basic Info Page */}
      <Page title="Basic Information" subtitle="">
        <>
          <FormProvider {...methods} key="basicInfo">
            <form onSubmit={methods.handleSubmit(onSubmit)} id="basicInfo">
              <PersonalInfoBI />
              <GovernmentIDsBI />
              <AddressBI />
            </form>
          </FormProvider>
        </>
      </Page>
      {/* NEXT BUTTON */}

      <NextButton formId="basicInfo" />
    </>
  );
};
