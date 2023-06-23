/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useContext, useEffect, useRef, useState } from 'react';
import { FloatingLabelTextField } from '../../../modular/inputs/FloatingLabelTextField';
import { Card } from '../../../modular/cards/Card';
import { Checkbox } from '../../../modular/inputs/Checkbox';
import { ErrorContext } from '../../../../context/ErrorContext';
import { isEmpty } from 'lodash';
import { SelectProvince } from '../../select/SelectProvince';
import { SelectCity } from '../../select/SelectCity';
import { SelectBrgy } from '../../select/SelectBrgy';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';

export const PermanentAddressBI = (): JSX.Element => {
  const permaHouseNoRef = useRef<any>(null); // permanent address house no ref
  const permaStreetRef = useRef<any>(null); // permanent address street ref
  const permaSubdRef = useRef<any>(null); // permanent subd ref
  const permaBrgyCodeRef = useRef<any>(null); // permanent brgy code ref
  const permaCityCodeRef = useRef<any>(null); // permanent city code ref
  const permaProvCodeRef = useRef<any>(null); // permanent province code ref
  const permaZipCodeRef = useRef<any>(null); // permanent zip code ref
  // set permanent address object, checkbox address, employee object state from pds context
  const residentialAddress = usePdsStore((state) => state.residentialAddress);
  const permanentAddress = usePdsStore((state) => state.permanentAddress);
  const checkboxAddress = usePdsStore((state) => state.checkboxAddress);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const setPermanentAddress = usePdsStore((state) => state.setPermanentAddress);
  const setCheckboxAddress = usePdsStore((state) => state.setCheckboxAddress);
  const [resetFields, setResetFields] = useState<boolean>(false);

  // set address error from error context
  const { permaAddrError, setPermaAddrError, permaAddrRef, shake, setShake } =
    useContext(ErrorContext);

  const onProvinceChange = (e: any) => {
    setPermanentAddress({ ...permanentAddress, province: e.target.value });
  };

  useEffect(() => {
    setResetFields(true);
  }, [permanentAddress.province]);

  // listens to checkbox if ticked or not
  const checkboxSameAddrListener = (e: any) => {
    if (e.target.checked === true) {
      setCheckboxAddress(true);
    } else if (!e.target.checked) {
      setCheckboxAddress(false);
      setPermanentAddress({
        ...permanentAddress,
        houseNumber: (permaHouseNoRef.current.value = ''),
        street: (permaStreetRef.current.value = ''),
        subdivision: (permaSubdRef.current.value = ''),
        provCode: '',
        province: '',
        cityCode: '',
        city: '',
        brgyCode: '',
        barangay: '',
        zipCode: (permaZipCodeRef.current.value = ''),
      });
    }
  };

  const setFields = async () => {
    setPermanentAddress({
      ...permanentAddress,
      city: '',
      cityCode: '',
      barangay: '',
      brgyCode: '',
    });
    // permaCityCodeRef.current.value = ''
    // permaBrgyCodeRef.current.value = ''
  };

  // copies the value of all residential address fields to permanent address fields real time
  useEffect(() => {
    checkboxAddress
      ? setPermanentAddress({
          ...permanentAddress,
          houseNumber: (permaHouseNoRef.current.value =
            residentialAddress.houseNumber),
          street: (permaStreetRef.current.value = residentialAddress.street),
          subdivision: (permaSubdRef.current.value =
            residentialAddress.subdivision),
          provCode: (permaProvCodeRef.current.value =
            residentialAddress.provCode),
          province: residentialAddress.province,
          cityCode: (permaCityCodeRef.current.value =
            residentialAddress.cityCode),
          city: residentialAddress.city,
          brgyCode: (permaBrgyCodeRef.current.value =
            residentialAddress.brgyCode),
          barangay: residentialAddress.barangay,
          zipCode: (permaZipCodeRef.current.value = residentialAddress.zipCode),
        })
      : null;
  }, [residentialAddress, checkboxAddress]);

  useEffect(() => {
    if (resetFields && checkboxAddress === false) {
      const something = async () => {
        await setFields();
      };
      something();
    }
    setResetFields(false);
  }, [resetFields]);

  // set the error to false if all of the following is not empty
  useEffect(() => {
    if (
      permaAddrError === true &&
      !isEmpty(permanentAddress.street) &&
      !isEmpty(permanentAddress.subdivision) &&
      !isEmpty(permanentAddress.houseNumber) &&
      !isEmpty(permanentAddress.provCode) &&
      !isEmpty(permanentAddress.cityCode) &&
      !isEmpty(permanentAddress.brgyCode) &&
      !isEmpty(permanentAddress.zipCode) &&
      permanentAddress.zipCode.length === 4
    ) {
      setPermaAddrError(false);
    }
  }, [
    permaAddrError,
    permanentAddress.street,
    permanentAddress.houseNumber,
    permanentAddress.subdivision,
    permanentAddress.provCode,
    permanentAddress.cityCode,
    permanentAddress.brgyCode,
    permanentAddress.zipCode,
  ]);

  return (
    <>
      <Card
        title="Permanent Address"
        subtitle="Write the address where you are permanently residing."
        remarks={
          <>
            <Checkbox
              id="checkboxSameAddr"
              checked={checkboxAddress}
              label="Same as Residential Address"
              className="hover:text-indigo-800"
              onChange={(e) => checkboxSameAddrListener(e)}
            />
          </>
        }
      >
        <>
          {permaAddrError ? (
            <div
              className={`rounded-lg bg-red-500 ${shake && 'animate'}`}
              tabIndex={1}
              ref={permaAddrRef}
              onAnimationEnd={() => setShake(false)}
              // onAnimationEnd={() => setPermaAddrError(!permaAddrError)}
            >
              <p className="w-full px-10 not-italic text-center text-white uppercase ">
                Incomplete Address
              </p>
            </div>
          ) : (
            <></>
          )}
          <div className="gap-4 mt-7 sm:block md:block lg:flex lg:grid-cols-3">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelTextField
                id="permahouseno"
                name="permahouseno"
                innerRef={permaHouseNoRef}
                isRequired
                value={permanentAddress.houseNumber}
                placeholder="House or Block or Lot No."
                type="text"
                muted={checkboxAddress}
                onChange={(e) =>
                  setPermanentAddress({
                    ...permanentAddress,
                    houseNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelTextField
                id="permastreet"
                innerRef={permaStreetRef}
                name="permastreet"
                isRequired
                value={permanentAddress.street}
                placeholder="Street"
                type="text"
                muted={checkboxAddress}
                onChange={(e) =>
                  setPermanentAddress({
                    ...permanentAddress,
                    street: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelTextField
                id="permasubd"
                innerRef={permaSubdRef}
                isRequired
                name="permasubd"
                value={permanentAddress.subdivision}
                placeholder="Subdivision or Village"
                type="text"
                muted={checkboxAddress}
                onChange={(e) =>
                  setPermanentAddress({
                    ...permanentAddress,
                    subdivision: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="gap-4 sm:block md:block lg:flex lg:grid-cols-3">
            <div className="w-full col-span-1 mb-7">
              <SelectProvince
                id="permaProvCode"
                isRequired
                onChange={(e) => onProvinceChange(e)}
                codeVariable={permanentAddress}
                value={permanentAddress.province}
                innerRef={permaProvCodeRef}
                muted={checkboxAddress}
                dispatchCodeVariable={setPermanentAddress}
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <SelectCity
                id="permaCityCode"
                isRequired
                onChange={(e) =>
                  setPermanentAddress({
                    ...permanentAddress,
                    city: e.target.value,
                  })
                }
                value={permanentAddress.city}
                codeVariable={permanentAddress}
                innerRef={permaCityCodeRef}
                muted={checkboxAddress}
                dispatchCodeVariable={setPermanentAddress}
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <SelectBrgy
                id="permaBrgyCode"
                isRequired
                value={permanentAddress.barangay}
                onChange={(e) =>
                  setPermanentAddress({
                    ...permanentAddress,
                    barangay: e.target.value,
                  })
                }
                codeVariable={permanentAddress}
                innerRef={permaBrgyCodeRef}
                muted={checkboxAddress}
                dispatchCodeVariable={setPermanentAddress}
              />
            </div>
          </div>

          <div className="gap-4 xs:block sm:grid sm:grid-cols-3">
            <FloatingLabelTextField
              id="permazipcode"
              name="permazipcode"
              innerRef={permaZipCodeRef}
              isRequired
              minLength={4}
              maxLength={4}
              placeholder="ZIP Code"
              muted={checkboxAddress}
              value={permanentAddress.zipCode}
              type="text"
              onChange={(e) =>
                setPermanentAddress({
                  ...permanentAddress,
                  zipCode: e.target.value.replace(/\D/, ''),
                })
              }
              className="sm:col-span-3 md:col-span-3 lg:col-span-1"
            />
          </div>
        </>
      </Card>
    </>
  );
};
