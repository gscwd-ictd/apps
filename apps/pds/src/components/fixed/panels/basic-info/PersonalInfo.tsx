import { ChangeEvent, useEffect, useState } from 'react';
import { Card } from '../../../modular/cards/Card';
import RadioGroup from '../../../modular/radio/RadioGroup';
import LoadingIndicator from '../../loader/LoadingIndicator';
import useSWR from 'swr';
import { FloatingLabelInputRF } from '../../../modular/inputs/FloatingLabelInputRF';
import { useFormContext } from 'react-hook-form';
import { RadioButtonRF } from '../../../modular/radio/RadioButtonRF';
import { SelectCountry } from '../../select/SelectCountry';
import { SelectListRFFL } from '../../../modular/select/SelectListRFFL';
import { isEmpty } from 'lodash';
import { PersonalInfo } from '../../../../types/data/basic-info.type';
import { useEmployeeStore } from '../../../../store/employee.store';
import { usePdsStore } from '../../../../store/pds.store';
import {
  gender,
  civilStatus,
  bloodType,
  citizenshipType,
} from '../../../../../utils/constants/constants';
import { PersonalInfoAlert } from './PersonalInfoAlert';
import fetcher from '../../../modular/fetcher/Fetcher';

export const PersonalInfoBI = (): JSX.Element => {
  const countriesUrl = process.env.NEXT_PUBLIC_COUNTRIES; // assign the public countries url
  const { data } = useSWR(`${countriesUrl}`, fetcher); // call the data constant from countries API
  const personalInfo = usePdsStore((state) => state.personalInfo);
  const personalInfoOnEdit = usePdsStore((state) => state.personalInfoOnEdit);
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const [countryList, setCountryList] = useState<Array<any>>([]); // set country list
  const setPersonalInfo = usePdsStore((state) => state.setPersonalInfo);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);

  // intialize react hook forms
  const {
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<PersonalInfo>();

  // on change function for citizenship
  const onChangeCitizenship = (e: ChangeEvent<HTMLSelectElement>) => {
    // if citizenship is set to Filipino, it sets the following...
    if (e.currentTarget.value === 'Filipino') {
      // set personalInfo field 'country' to 'Philippines and citizenship type to empty string
      setPersonalInfo({
        ...personalInfo,
        country: 'Philippines',
        citizenship: e.currentTarget.value,
        citizenshipType: '',
      });
      setValue('country', 'Philippines');
      setValue('citizenshipType', '');
      clearErrors('country');
    }
    // if citizenship is set to Dual Citizenship
    else if (e.currentTarget.value === 'Dual Citizenship') {
      // set personalInfo field 'country' to empty
      setPersonalInfo({
        ...personalInfo,
        country: '',
        citizenship: e.currentTarget.value,
        citizenshipType: '',
      });
      setValue('country', '');
      setValue('citizenshipType', '');
    }
  };

  // on change function for citizenship type
  const onChangeCitizenshipType = (e: ChangeEvent<HTMLSelectElement>) => {
    setPersonalInfo({ ...personalInfo, citizenshipType: e.target.value });
    setValue('citizenshipType', e.target.value);
    clearErrors('citizenshipType');
  };

  // on change function for country
  const onChangeCountry = (e: ChangeEvent<HTMLSelectElement>) => {
    setPersonalInfo({ ...personalInfo, country: e.target.value });
    clearErrors('country');
  };

  const setInitialValues = () => {
    clearErrors();
    setPersonalInfo(initialPdsState.personalInfo);
    setValue('lastName', initialPdsState.personalInfo.lastName);
    setValue('firstName', initialPdsState.personalInfo.firstName);
    setValue('middleName', initialPdsState.personalInfo.middleName);
    setValue('nameExtension', initialPdsState.personalInfo.nameExtension);
    setValue('birthDate', initialPdsState.personalInfo.birthDate);
    setValue('sex', initialPdsState.personalInfo.sex);
    setValue('birthPlace', initialPdsState.personalInfo.birthPlace);
    setValue('civilStatus', initialPdsState.personalInfo.civilStatus);
    setValue('height', initialPdsState.personalInfo.height);
    setValue('weight', initialPdsState.personalInfo.weight);
    setValue('bloodType', initialPdsState.personalInfo.bloodType);
    setValue('citizenship', initialPdsState.personalInfo.citizenship);
    setValue('citizenshipType', initialPdsState.personalInfo.citizenshipType);
    setValue('country', initialPdsState.personalInfo.country);
    setValue('telephoneNumber', initialPdsState.personalInfo.telephoneNumber);
    setValue('mobileNumber', initialPdsState.personalInfo.mobileNumber);
    setValue('email', initialPdsState.personalInfo.email);
  };

  // set countrylist when data is changed
  useEffect(() => data && setCountryList(data), [data]);

  return (
    <>
      <Card
        title={'Personal Information'}
        subtitle={
          'This contains your personal information. Write N/A if not applicable'
        }
      >
        <>
          <div className="flex justify-end w-full pb-10 -mt-16">
            <PersonalInfoAlert setInitialValues={setInitialValues} />
          </div>

          <div className="gap-4 xs:block mt-7 sm:block md:block lg:flex lg:grid-cols-2 ">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="lastName"
                placeholder="Surname"
                type="text"
                isRequired
                controller={{
                  ...register('lastName', {
                    value: personalInfo.lastName.trim(),
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        lastName: e.target.value,
                      }),
                  }),
                }}
                muted={hasPds ? true : false}
                // muted={true}
                isError={errors.lastName ? true : false}
                errorMessage={errors.lastName?.message}
              />
            </div>

            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="firstName"
                isRequired
                placeholder="First Name"
                type="text"
                controller={{
                  ...register('firstName', {
                    value: personalInfo.firstName.trim(),
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        firstName: e.target.value,
                      }),
                  }),
                }}
                muted={hasPds ? true : false}
                // muted={true}
                isError={errors.firstName ? true : false}
                errorMessage={errors.firstName?.message}
              />
            </div>
          </div>

          <div className="gap-4 xs:block lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="middleName"
                placeholder="Middle Name"
                isRequired
                type="text"
                controller={{
                  ...register('middleName', {
                    value: isEmpty(personalInfo.middleName)
                      ? 'N/A'
                      : personalInfo.middleName.trim(),
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        middleName: e.target.value,
                      }),
                  }),
                }}
                // muted={hasPds ? true : false}
                muted={
                  hasPds && personalInfoOnEdit
                    ? false
                    : hasPds && !personalInfoOnEdit
                    ? true
                    : !hasPds && false
                }
                // muted={true}
                isError={errors.middleName ? true : false}
                errorMessage={errors.middleName?.message}
              />
            </div>

            {/* <div className="border border-black max-h-min min-h">HELLO</div> */}

            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="nameExtension"
                placeholder="Name Extension (Jr.,Sr.)"
                isRequired
                type="text"
                controller={{
                  ...register('nameExtension', {
                    value: isEmpty(personalInfo.nameExtension)
                      ? 'N/A'
                      : personalInfo.nameExtension.trim(),
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        nameExtension: e.target.value,
                      }),
                  }),
                }}
                // muted={hasPds ? true : false}
                muted={
                  hasPds && personalInfoOnEdit
                    ? false
                    : hasPds && !personalInfoOnEdit
                    ? true
                    : !hasPds && false
                }
                isError={errors.nameExtension ? true : false}
                errorMessage={errors.nameExtension?.message}
              />
            </div>
          </div>

          <div className="gap-4 xs:block lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="birthDate"
                className="hover:peer-placeholder-shown:cursor-pointer"
                placeholder="Date of Birth (MM/DD/YYYY)"
                isRequired
                defaultValue={
                  personalInfo.birthDate ? personalInfo.birthDate : ''
                }
                type="date"
                controller={{
                  ...register('birthDate', {
                    value: personalInfo.birthDate,
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        birthDate: e.target.value,
                      }),
                  }),
                }}
                // muted={hasPds ? true : false}
                muted={
                  hasPds && personalInfoOnEdit
                    ? false
                    : hasPds && !personalInfoOnEdit
                    ? true
                    : !hasPds && false
                }
                isError={errors.birthDate ? true : false}
                errorMessage={errors.birthDate?.message}
              />
            </div>

            <div className="w-full col-span-1 mb-7">
              <SelectListRFFL
                id="sex"
                selectList={gender}
                variant="light"
                defaultOption="Sex"
                defaultValue={personalInfo.sex ? personalInfo.sex : ''}
                isRequired
                controller={{
                  ...register('sex', {
                    value: personalInfo.sex,
                    onChange: (e) =>
                      setPersonalInfo({ ...personalInfo, sex: e.target.value }),
                  }),
                }}
                isError={errors.sex ? true : false}
                errorMessage={errors.sex?.message}
                // muted={hasPds ? true : false}
                muted={
                  hasPds && personalInfoOnEdit
                    ? false
                    : hasPds && !personalInfoOnEdit
                    ? true
                    : !hasPds && false
                }
              />
            </div>
          </div>

          <div className="grid mb-7">
            <FloatingLabelInputRF
              id="birthPlace"
              isRequired
              placeholder="Place of Birth"
              type="text"
              defaultValue={
                personalInfo.birthPlace ? personalInfo.birthPlace : ''
              }
              controller={{
                ...register('birthPlace', {
                  value: personalInfo.birthPlace.trim(),
                  onChange: (e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      birthPlace: e.target.value,
                    }),
                }),
              }}
              muted={
                hasPds && personalInfoOnEdit
                  ? false
                  : hasPds && !personalInfoOnEdit
                  ? true
                  : !hasPds && false
              }
              isError={errors.birthPlace ? true : false}
              errorMessage={errors.birthPlace?.message}
            />
          </div>

          <div className="gap-4 xs:block lg:flex lg:grid-cols-4">
            <div className="w-full col-span-1 mb-7">
              <SelectListRFFL
                id="civilStatus"
                isRequired
                selectList={civilStatus}
                variant="light"
                defaultOption="Civil Status"
                defaultValue={
                  personalInfo.civilStatus ? personalInfo.civilStatus : ''
                }
                controller={{
                  ...register('civilStatus', {
                    value: personalInfo.civilStatus,
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        civilStatus: e.target.value,
                      }),
                  }),
                }}
                isError={errors.civilStatus ? true : false}
                errorMessage={errors.civilStatus?.message}
                muted={hasPds ? true : false}
              />
            </div>

            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="height"
                isRequired
                placeholder="Height in meters (m)"
                defaultValue={
                  personalInfo.height ? personalInfo.height : undefined
                }
                type="number"
                step={0.01}
                muted={
                  hasPds && personalInfoOnEdit
                    ? false
                    : hasPds && !personalInfoOnEdit
                    ? true
                    : !hasPds && false
                }
                onWheel={(e) => e.currentTarget.blur()}
                controller={{
                  ...register('height', {
                    value: personalInfo.height,
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        height: parseFloat(e.target.value),
                      }),
                  }),
                }}
                isError={errors.height ? true : false}
                errorMessage={errors.height?.message}
              />
            </div>

            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="weight"
                isRequired
                placeholder="Weight in kilograms (kg)"
                step={0.01}
                defaultValue={
                  personalInfo.weight ? personalInfo.weight : undefined
                }
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                controller={{
                  ...register('weight', {
                    value: personalInfo.weight,
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        weight: parseFloat(e.target.value),
                      }),
                  }),
                }}
                isError={errors.weight ? true : false}
                muted={
                  hasPds && personalInfoOnEdit
                    ? false
                    : hasPds && !personalInfoOnEdit
                    ? true
                    : !hasPds && false
                }
                errorMessage={errors.weight?.message}
              />
            </div>

            <div className="w-full col-span-1 mb-7">
              <SelectListRFFL
                id="bloodType"
                isRequired
                defaultValue={
                  personalInfo.bloodType ? personalInfo.bloodType : ''
                }
                selectList={bloodType}
                variant="light"
                defaultOption="Blood Type"
                muted={hasPds ? true : false}
                controller={{
                  ...register('bloodType', {
                    value: personalInfo.bloodType,
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        bloodType: e.target.value,
                      }),
                  }),
                }}
                isError={errors.bloodType ? true : false}
                errorMessage={errors.bloodType?.message}
              />
            </div>
          </div>

          <div className="xs:gap-8 xs:grid sm:grid sm:gap-8 md:grid md:gap-4 lg:grid xl:flex xl:grid-cols-2">
            <div className="w-full">
              <RadioGroup
                groupName="citizenship"
                isError={errors.citizenship ? true : false}
                focusOutline={true}
                muted={hasPds ? true : false}
                className="relative border py-[0.62rem] md:mt-2"
              >
                <>
                  <div className="grid-cols-2 xs:grid sm:grid md:grid lg:grid xl:grid">
                    <RadioButtonRF
                      id="filipino"
                      name="citizenship"
                      label="Filipino"
                      muted={
                        hasPds && personalInfo.citizenship === 'Filipino'
                          ? false
                          : !hasPds
                          ? false
                          : true
                      }
                      checked={
                        personalInfo.citizenship === 'Filipino' ? true : false
                      }
                      value="Filipino"
                      controller={{
                        ...register('citizenship', {
                          value: personalInfo.citizenship,
                          onChange: (e) => onChangeCitizenship(e),
                        }),
                      }}
                    />
                    <RadioButtonRF
                      id="dual-citizenship"
                      name="citizenship"
                      label="Dual Citizenship"
                      muted={
                        hasPds &&
                        personalInfo.citizenship === 'Dual Citizenship'
                          ? false
                          : !hasPds
                          ? false
                          : true
                      }
                      checked={
                        personalInfo.citizenship === 'Dual Citizenship'
                          ? true
                          : false
                      }
                      value="Dual Citizenship"
                      controller={{
                        ...register('citizenship', {
                          value: personalInfo.citizenship,
                          onChange: (e) => onChangeCitizenship(e),
                        }),
                      }}
                    />
                  </div>
                  <label
                    htmlFor="citizenship"
                    className="peer-focus:font-sm peer-focus:-pt-1 absolute -top-6 left-0 mx-4  mt-4 h-fit 
          cursor-text bg-white text-xs font-normal text-gray-400 transition-all peer-placeholder-shown:-inset-y-[0.85rem] peer-placeholder-shown:left-0  peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-600 peer-focus:bg-white peer-focus:text-xs peer-focus:text-gray-400"
                  >
                    <div className="flex px-1">
                      {' '}
                      <span className="text-gray-600">Citizenship</span>
                      <span className="text-red-700">*</span>
                    </div>
                  </label>
                </>
              </RadioGroup>
              {errors.citizenship && (
                <span className="mt-1 text-xs text-red-600 ">
                  {errors.citizenship.message}
                </span>
              )}
            </div>

            <div className="w-full col-span-1 sm:mt-2 sm:mb-7 sm:grid md:mt-2 md:mb-7 md:grid lg:col-span-1 lg:mt-2 lg:mb-7">
              {personalInfo.citizenship === 'Dual Citizenship' ? (
                <>
                  <SelectListRFFL
                    id="citizenshipType"
                    isRequired
                    selectList={citizenshipType}
                    variant="light"
                    defaultOption="Citizenship Type"
                    defaultValue={
                      personalInfo.citizenshipType
                        ? personalInfo.citizenshipType
                        : ''
                    }
                    controller={{
                      ...register('citizenshipType', {
                        value: personalInfo.citizenshipType,
                        onChange: (e) => onChangeCitizenshipType(e),
                      }),
                    }}
                    isError={errors.citizenshipType ? true : false}
                    muted={hasPds ? true : false}
                    errorMessage={errors.citizenshipType?.message}
                  />
                </>
              ) : (
                <div className="justify-left flex cursor-default select-none rounded-xl border px-5 py-[1rem] text-gray-600  focus-within:border focus-within:border-indigo-600">
                  <span className="peer">No dual citizenship.</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full col-span-1 mb-7">
            {!data ? (
              <>
                <span className="flex justify-center py-2">
                  <LoadingIndicator />
                </span>
              </>
            ) : (
              <>
                <SelectCountry
                  id="country"
                  isRequired
                  // defaultValue={personalInfo.country ? personalInfo.country : ''}
                  value={personalInfo.country ? personalInfo.country : ''}
                  variant="primary"
                  selectList={countryList}
                  muted={
                    hasPds
                      ? true
                      : watch('citizenship') === 'Filipino'
                      ? true
                      : false
                  }
                  controller={{
                    ...register('country', {
                      value: personalInfo.country,
                      onChange: (e) => onChangeCountry(e),
                    }),
                  }}
                  isError={errors.country ? true : false}
                />
                {errors.country && (
                  <span className="text-xs text-red-600 ">
                    {errors.country.message}
                  </span>
                )}
              </>
            )}
          </div>

          <div className="gap-4 xs:block lg:flex lg:grid-cols-3">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="telNo"
                placeholder="Telephone Number"
                defaultValue={
                  personalInfo.telephoneNumber
                    ? personalInfo.telephoneNumber
                    : ''
                }
                type="text"
                isRequired
                // maxLength={10}
                controller={{
                  ...register('telephoneNumber', {
                    value: personalInfo.telephoneNumber.trim(),
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        telephoneNumber: e.target.value,
                      }),
                  }),
                }}
                isError={errors.telephoneNumber ? true : false}
                errorMessage={errors.telephoneNumber?.message}
                muted={
                  hasPds && personalInfoOnEdit
                    ? false
                    : hasPds && !personalInfoOnEdit
                    ? true
                    : !hasPds && false
                }
              />
            </div>

            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="mobileNo"
                isRequired
                maxLength={11}
                defaultValue={
                  personalInfo.mobileNumber ? personalInfo.mobileNumber : ''
                }
                placeholder="Mobile Number"
                type="text"
                controller={{
                  ...register('mobileNumber', {
                    value: personalInfo.mobileNumber.trim(),
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        mobileNumber: e.target.value,
                      }),
                  }),
                }}
                isError={errors.mobileNumber ? true : false}
                errorMessage={errors.mobileNumber?.message}
                muted={
                  hasPds && personalInfoOnEdit
                    ? false
                    : hasPds && !personalInfoOnEdit
                    ? true
                    : !hasPds && false
                }
              />
            </div>

            <div className="w-full col-span-1 mb-7">
              <FloatingLabelInputRF
                id="emailaddress"
                isRequired
                placeholder="Email Address"
                type="email"
                controller={{
                  ...register('email', {
                    value: personalInfo.email ? personalInfo.email.trim() : '',
                    onChange: (e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        email: e.target.value,
                      }),
                  }),
                }}
                isError={errors.email ? true : false}
                muted={true}
                errorMessage={errors.email?.message}
              />
            </div>
          </div>
        </>
      </Card>
    </>
  );
};
