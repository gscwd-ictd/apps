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
import { PermanentAddressAlert } from './PermanentAddressAlert';

export const PermanentAddressBI = (): JSX.Element => {
  const permaHouseNoRef = useRef<any>(null); // permanent address house no ref
  const permaStreetRef = useRef<any>(null); // permanent address street ref
  const permaSubdRef = useRef<any>(null); // permanent subd ref
  const permaBrgyRef = useRef<any>(null); // permanent brgy code ref
  const permaCityRef = useRef<any>(null); // permanent city code ref
  const permaProvRef = useRef<any>(null); // permanent province code ref
  const permaZipCodeRef = useRef<any>(null); // permanent zip code ref

  // set permanent address object, checkbox address, employee object state from pds context
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const checkboxAddress = usePdsStore((state) => state.checkboxAddress);
  const permanentAddress = usePdsStore((state) => state.permanentAddress);
  const residentialAddress = usePdsStore((state) => state.residentialAddress);
  const permanentAddressOnEdit = usePdsStore(
    (state) => state.permanentAddressOnEdit
  );
  const checkboxAddressInitialState = usePdsStore(
    (state) => state.checkboxAddressInitialState
  );
  const setCheckboxAddress = usePdsStore((state) => state.setCheckboxAddress);
  const setPermanentAddress = usePdsStore((state) => state.setPermanentAddress);
  const [resetFields, setResetFields] = useState<boolean>(false);

  // set address error from error context
  const { permaAddrError, setPermaAddrError, permaAddrRef, shake, setShake } =
    useContext(ErrorContext);

  const onProvinceChange = (e: any) => {
    setPermanentAddress({ ...permanentAddress, province: e.target.value });
  };

  useEffect(() => {
    if (isEmpty(permanentAddress.city))
      // setPermanentAddress({ ...permanentAddress, city: '', cityCode: '', barangay: '', brgyCode: '' });
      setResetFields(true);
  }, [permanentAddress.province]);

  // listens to checkbox if ticked or not
  const checkboxSameAddrListener = (e: any) => {
    if (e.target.checked === true) {
      setCheckboxAddress(true);
    } else if (e.target.checked === false) {
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

  const setInitialValues = () => {
    if (checkboxAddressInitialState === true) {
      setCheckboxAddress(checkboxAddressInitialState);
      setPermanentAddress({
        ...residentialAddress,
        houseNumber: initialPdsState.residentialAddress.houseNumber,
        street: initialPdsState.residentialAddress.street,
        subdivision: initialPdsState.residentialAddress.subdivision,
        province: initialPdsState.residentialAddress.province,
        city: initialPdsState.residentialAddress.city,
        barangay: initialPdsState.residentialAddress.barangay,
      });
    } else if (checkboxAddressInitialState === false) {
      setCheckboxAddress(checkboxAddressInitialState);
      setPermanentAddress({
        ...permanentAddress,
        houseNumber: initialPdsState.permanentAddress.houseNumber,
        street: initialPdsState.permanentAddress.street,
        subdivision: initialPdsState.permanentAddress.subdivision,
        province: initialPdsState.permanentAddress.province,
        city: initialPdsState.permanentAddress.city,
        barangay: initialPdsState.permanentAddress.barangay,
      });
    }
  };

  const setFields = () => {
    setPermanentAddress({ ...permanentAddress, city: '', barangay: '' });
  };

  // copies the value of all residential address fields to permanent address fields real time
  useEffect(() => {
    checkboxAddress
      ? setPermanentAddress({
          ...permanentAddress,
          houseNumber: residentialAddress.houseNumber,
          street: residentialAddress.street,
          subdivision: residentialAddress.subdivision,
          province: residentialAddress.province,
          city: residentialAddress.city,
          barangay: residentialAddress.barangay,
          zipCode: residentialAddress.zipCode,
        })
      : null;
  }, [residentialAddress, checkboxAddress]);

  // assigns the employee id on page load
  useEffect(() => {
    setPermanentAddress({
      ...permanentAddress,
      employeeId: employee.employmentDetails.userId,
    });
  }, []);

  useEffect(() => {
    if (resetFields) {
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
      !isEmpty(permanentAddress.province) &&
      !isEmpty(permanentAddress.city) &&
      !isEmpty(permanentAddress.barangay) &&
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
    permanentAddress.province,
    permanentAddress.city,
    permanentAddress.barangay,
    permanentAddress.zipCode,
  ]);

  return (
    <>
      <Card
        title="Permanent Address"
        subtitle="Write the address where you are permanently residing. Write N/A if not applicable"
        remarks={
          <div className="flex flex-col gap-6">
            <div className="flex justify-end w-full">
              <PermanentAddressAlert setInitialValues={setInitialValues} />
            </div>
            <Checkbox
              id="checkboxSameAddr"
              checked={checkboxAddress}
              label="Same as Residential Address"
              className={
                hasPds && !permanentAddressOnEdit
                  ? 'cursor-not-allowed italic'
                  : 'hover:text-indigo-800 italic'
              }
              onChange={checkboxSameAddrListener}
              disabled={
                hasPds && permanentAddressOnEdit
                  ? false
                  : hasPds && !permanentAddressOnEdit
                  ? true
                  : !hasPds && false
              }
            />
          </div>
        }
      >
        <>
          {permaAddrError ? (
            <div
              className={`rounded-sm bg-red-500 ${shake && 'animate'}`}
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
                muted={
                  checkboxAddress ||
                  (hasPds && permanentAddressOnEdit
                    ? false
                    : hasPds && !permanentAddressOnEdit
                    ? true
                    : !hasPds && false)
                }
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
                muted={
                  checkboxAddress ||
                  (hasPds && permanentAddressOnEdit
                    ? false
                    : hasPds && !permanentAddressOnEdit
                    ? true
                    : !hasPds && false)
                }
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
                muted={
                  checkboxAddress ||
                  (hasPds && permanentAddressOnEdit
                    ? false
                    : hasPds && !permanentAddressOnEdit
                    ? true
                    : !hasPds && false)
                }
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
                onChange={onProvinceChange}
                codeVariable={permanentAddress}
                value={permanentAddress.province}
                innerRef={permaProvRef}
                muted={
                  checkboxAddress ||
                  (hasPds && permanentAddressOnEdit
                    ? false
                    : hasPds && !permanentAddressOnEdit
                    ? true
                    : !hasPds && false)
                }
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
                innerRef={permaCityRef}
                muted={
                  checkboxAddress ||
                  (hasPds && permanentAddressOnEdit
                    ? false
                    : hasPds && !permanentAddressOnEdit
                    ? true
                    : !hasPds && false)
                }
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
                innerRef={permaBrgyRef}
                muted={
                  checkboxAddress ||
                  (hasPds && permanentAddressOnEdit
                    ? false
                    : hasPds && !permanentAddressOnEdit
                    ? true
                    : !hasPds && false)
                }
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
              muted={
                checkboxAddress ||
                (hasPds && permanentAddressOnEdit
                  ? false
                  : hasPds && !permanentAddressOnEdit
                  ? true
                  : !hasPds && false)
              }
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
