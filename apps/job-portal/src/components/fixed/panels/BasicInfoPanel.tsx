import { useContext, useEffect } from 'react';
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
import { SolidNextButton } from '../navigation/button/SolidNextButton';
import { PageContentContext } from '../page/PageContent';

export const BasicInfoPanel = (): JSX.Element => {
  const selectedTab = useTabStore((state) => state.selectedTab);
  const handleNextTab = useTabStore((state) => state.handleNextTab);

  const {
    aside: { isMobile },
  } = useContext(PageContentContext);

  // residential and permanent address object from pds store
  const residentialAddress = usePdsStore((state) => state.residentialAddress);

  const permanentAddress = usePdsStore((state) => state.permanentAddress);
  // set address error and reference from error context
  const {
    resAddrError,
    permaAddrError,
    permaAddrRef,
    resAddrRef,
    shake,
    setShake,
    setResAddrError,
    setPermaAddrError,
  } = useContext<ErrorState>(ErrorContext);

  // assign the useform hook to 'methods', set the resolver to yup resolver schema, mode is set to onchange
  const methods = useForm({ resolver: yupResolver(schema), mode: 'onChange' });

  // assigned to next button which also functions as a submit button somehow
  const onSubmit = () => {
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
      isEmpty(residentialAddress.provCode) ||
      isEmpty(residentialAddress.cityCode) ||
      isEmpty(residentialAddress.brgyCode) ||
      isEmpty(residentialAddress.zipCode)
    ) {
      setResAddrError(true);
      setShake(true);
      // resAddrRef.current.focus()
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
      isEmpty(permanentAddress.provCode) ||
      isEmpty(permanentAddress.cityCode) ||
      isEmpty(permanentAddress.brgyCode) ||
      isEmpty(permanentAddress.zipCode)
    ) {
      setPermaAddrError(true);
      setShake(true);
      // permaAddrRef.current.focus()
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
      !isEmpty(residentialAddress.provCode) &&
      !isEmpty(residentialAddress.cityCode) &&
      !isEmpty(residentialAddress.brgyCode) &&
      !isEmpty(residentialAddress.zipCode) &&
      !isEmpty(permanentAddress.houseNumber) &&
      !isEmpty(permanentAddress.street) &&
      !isEmpty(permanentAddress.subdivision) &&
      !isEmpty(permanentAddress.provCode) &&
      !isEmpty(permanentAddress.cityCode) &&
      !isEmpty(permanentAddress.brgyCode) &&
      !isEmpty(permanentAddress.zipCode)
    ) {
      // invokes the handle next tab function
      // and passes the value of selected tab as a prop to the function
      handleNextTab();
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
          {isMobile && (
            <div className="flex w-full justify-end">
              <SolidNextButton formId="basicInfo" />
            </div>
          )}
          <FormProvider {...methods} key="basicInfo">
            <form onSubmit={methods.handleSubmit(onSubmit)} id="basicInfo">
              <PersonalInfoBI />
              <GovernmentIDsBI />
              <AddressBI />
            </form>
          </FormProvider>
        </>
        {isMobile && (
          <div className="flex w-full justify-end mt-4">
            <SolidNextButton formId="basicInfo" />
          </div>
        )}
      </Page>
      {/* NEXT BUTTON */}

      {!isMobile && <NextButton formId="basicInfo" />}
    </>
  );
};
