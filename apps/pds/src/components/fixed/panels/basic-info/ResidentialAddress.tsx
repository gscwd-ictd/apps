import { FloatingLabelTextField } from '../../../modular/inputs/FloatingLabelTextField';
import { Card } from '../../../modular/cards/Card';
import { useContext, useEffect, useRef, useState } from 'react';
import { SelectProvince } from '../../select/SelectProvince';
import { SelectCity } from '../../select/SelectCity';
import { SelectBrgy } from '../../select/SelectBrgy';
import { ErrorContext } from '../../../../context/ErrorContext';
import { isEmpty } from 'lodash';
import { usePdsStore } from '../../../../store/pds.store';
import { useEmployeeStore } from '../../../../store/employee.store';
import { ResidentialAddressAlert } from './ResidentialAddressAlert';

export const ResidentialAddressBI = (): JSX.Element => {
  const provRef = useRef<any>(null); // useRef for province code
  const cityRef = useRef<any>(null); // useRef for city code
  const brgyRef = useRef<any>(null); // useRef for brgy code

  // set residential address object, employee object state from pds context
  const residentialAddress = usePdsStore((state) => state.residentialAddress);
  const residentialAddressOnEdit = usePdsStore(
    (state) => state.residentialAddressOnEdit
  );
  const hasPds = useEmployeeStore((state) => state.hasPds);
  const initialPdsState = usePdsStore((state) => state.initialPdsState);
  const employee = useEmployeeStore((state) => state.employeeDetails);
  const { resAddrError, setResAddrError, resAddrRef, shake, setShake } =
    useContext(ErrorContext); // set address error from error context
  const setResidentialAddress = usePdsStore(
    (state) => state.setResidentialAddress
  );
  const [resetFields, setResetFields] = useState<boolean>(false);

  // on change province

  const onProvinceChange = (e: any) => {
    setResidentialAddress({ ...residentialAddress, province: e.target.value });
  };

  useEffect(() => {
    setResetFields(true);
  }, [residentialAddress.province]);

  // set initial values
  const setInitialValues = () => {
    setResidentialAddress({
      ...residentialAddress,
      houseNumber: initialPdsState.residentialAddress.houseNumber,
      street: initialPdsState.residentialAddress.street,
      subdivision: initialPdsState.residentialAddress.subdivision,
      province: initialPdsState.residentialAddress.province,
      city: initialPdsState.residentialAddress.city,
      barangay: initialPdsState.residentialAddress.barangay,
    });
  };

  const setFields = async () => {
    setResidentialAddress({
      ...residentialAddress,
      city: '',
      cityCode: '',
      barangay: '',
      brgyCode: '',
    });
  };

  // assign employee id on page load
  useEffect(
    () =>
      setResidentialAddress({
        ...residentialAddress,
        employeeId: employee.employmentDetails.userId,
      }),
    []
  );

  useEffect(() => {
    if (resetFields) {
      const something = async () => {
        await setFields();
      };
      something();
    }
    setResetFields(false);
  }, [resetFields]);

  /**
   *  if all listed residential address fields are not empty
   *  it sets the error state to false
   */

  useEffect(() => {
    if (
      resAddrError === true &&
      !isEmpty(residentialAddress.street) &&
      !isEmpty(residentialAddress.houseNumber) &&
      !isEmpty(residentialAddress.subdivision) &&
      !isEmpty(residentialAddress.province) &&
      !isEmpty(residentialAddress.city) &&
      !isEmpty(residentialAddress.barangay) &&
      !isEmpty(residentialAddress.zipCode) &&
      residentialAddress.zipCode.length === 4
    ) {
      setResAddrError(false);
    }
  }, [
    resAddrError,
    residentialAddress.street,
    residentialAddress.houseNumber,
    residentialAddress.subdivision,
    residentialAddress.province,
    residentialAddress.city,
    residentialAddress.barangay,
    residentialAddress.zipCode,
  ]);

  return (
    <>
      <Card
        title="Residential Address"
        subtitle="Write the address where you are currently residing. Write N/A if not applicable"
      >
        <>
          {resAddrError ? (
            <div
              className={`rounded-sm bg-red-500 ${shake && 'animate'}`}
              onAnimationEnd={() => setShake(false)}
              tabIndex={1}
              ref={resAddrRef}
            >
              <p className="w-full px-10 not-italic text-center text-white uppercase ">
                Incomplete Address
              </p>
            </div>
          ) : (
            <></>
          )}
          <div className="flex justify-end w-full pb-10 -mt-16">
            <ResidentialAddressAlert setInitialValues={setInitialValues} />
          </div>

          <div className="gap-4 mt-7 sm:block md:block lg:flex lg:grid-cols-3">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelTextField
                id="resHouseNumber"
                name="resHouseNumber"
                placeholder="House or Block or Lot No."
                isRequired
                value={residentialAddress.houseNumber}
                type="text"
                muted={
                  hasPds && residentialAddressOnEdit
                    ? false
                    : hasPds && !residentialAddressOnEdit
                    ? true
                    : !hasPds && false
                }
                onChange={(e) =>
                  setResidentialAddress({
                    ...residentialAddress,
                    houseNumber: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelTextField
                id="resstreet"
                name="resstreet"
                placeholder="Street"
                isRequired
                type="text"
                muted={
                  hasPds && residentialAddressOnEdit
                    ? false
                    : hasPds && !residentialAddressOnEdit
                    ? true
                    : !hasPds && false
                }
                value={residentialAddress.street}
                onChange={(e) =>
                  setResidentialAddress({
                    ...residentialAddress,
                    street: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelTextField
                id="ressubd"
                name="ressubd"
                isRequired
                placeholder="Subdivision or Village"
                value={residentialAddress.subdivision}
                muted={
                  hasPds && residentialAddressOnEdit
                    ? false
                    : hasPds && !residentialAddressOnEdit
                    ? true
                    : !hasPds && false
                }
                type="text"
                onChange={(e) =>
                  setResidentialAddress({
                    ...residentialAddress,
                    subdivision: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="gap-4 sm:block lg:flex lg:grid-cols-2">
            <div className="w-full col-span-1 mb-7">
              <SelectProvince
                id="resProvCode"
                onChange={onProvinceChange}
                isRequired
                value={residentialAddress.province}
                innerRef={provRef}
                muted={
                  hasPds && residentialAddressOnEdit
                    ? false
                    : hasPds && !residentialAddressOnEdit
                    ? true
                    : !hasPds && false
                }
                codeVariable={residentialAddress}
                dispatchCodeVariable={setResidentialAddress}
              />
            </div>
            <div className="w-full col-span-1 mb-7">
              <SelectCity
                id="resCityCode"
                onChange={(e) =>
                  setResidentialAddress({
                    ...residentialAddress,
                    city: e.target.value,
                  })
                }
                innerRef={cityRef}
                isRequired
                muted={
                  hasPds && residentialAddressOnEdit
                    ? false
                    : hasPds && !residentialAddressOnEdit
                    ? true
                    : !hasPds && false
                }
                value={residentialAddress.city}
                codeVariable={residentialAddress}
                dispatchCodeVariable={setResidentialAddress}
              />
            </div>

            <div className="w-full col-span-1 mb-7">
              <SelectBrgy
                id="resBrgyCode"
                isRequired
                value={residentialAddress.barangay}
                innerRef={brgyRef}
                muted={
                  hasPds && residentialAddressOnEdit
                    ? false
                    : hasPds && !residentialAddressOnEdit
                    ? true
                    : !hasPds && false
                }
                onChange={(e) =>
                  setResidentialAddress({
                    ...residentialAddress,
                    barangay: e.target.value,
                  })
                }
                codeVariable={residentialAddress}
                dispatchCodeVariable={setResidentialAddress}
              />
            </div>
          </div>

          <div className="gap-4 xs:block sm:grid sm:grid-cols-3">
            <FloatingLabelTextField
              id="resZipCode"
              name="resZipCode"
              isRequired
              minLength={4}
              maxLength={4}
              muted={
                hasPds && residentialAddressOnEdit
                  ? false
                  : hasPds && !residentialAddressOnEdit
                  ? true
                  : !hasPds && false
              }
              placeholder="ZIP Code"
              type="text"
              value={residentialAddress.zipCode}
              onChange={(e) =>
                setResidentialAddress({
                  ...residentialAddress,
                  zipCode: e.target.value.replace(/\D/g, ''),
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
