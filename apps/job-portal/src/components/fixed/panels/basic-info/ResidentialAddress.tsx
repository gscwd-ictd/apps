import { FloatingLabelTextField } from '../../../modular/inputs/FloatingLabelTextField';
import { Card } from '../../../modular/cards/Card';
import { useContext, useEffect, useRef, useState } from 'react';
import { SelectProvince } from '../../select/SelectProvince';
import { SelectCity } from '../../select/SelectCity';
import { SelectBrgy } from '../../select/SelectBrgy';
import { ErrorContext } from '../../../../context/ErrorContext';
import { isEmpty } from 'lodash';
import { usePdsStore } from '../../../../store/pds.store';

export const ResidentialAddressBI = (): JSX.Element => {
  const provCodeRef = useRef<any>(null); // useRef for province code
  const cityCodeRef = useRef<any>(null); // useRef for city code
  const brgyCodeRef = useRef<any>(null); // useRef for brgy code

  // set residential address object, employee object state from pds context
  const residentialAddress = usePdsStore((state) => state.residentialAddress);
  const setResidentialAddress = usePdsStore(
    (state) => state.setResidentialAddress
  );

  const { resAddrError, setResAddrError, resAddrRef, shake, setShake } =
    useContext(ErrorContext); // set address error from error context
  const [resetFields, setResetFields] = useState<boolean>(false);

  const onProvinceChange = (e: any) => {
    setResidentialAddress({ ...residentialAddress, province: e.target.value });
  };

  useEffect(() => {
    setResetFields(true);
  }, [residentialAddress.province]);

  const setFields = async () => {
    setResidentialAddress({
      ...residentialAddress,
      city: '',
      cityCode: '',
      barangay: '',
      brgyCode: '',
    });
  };

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
      !isEmpty(residentialAddress.provCode) &&
      !isEmpty(residentialAddress.cityCode) &&
      !isEmpty(residentialAddress.brgyCode) &&
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
    residentialAddress.provCode,
    residentialAddress.cityCode,
    residentialAddress.brgyCode,
    residentialAddress.zipCode,
  ]);

  return (
    <>
      <Card
        title="Residential Address"
        subtitle="Write the address where you are currently residing."
      >
        <>
          {resAddrError ? (
            <div
              className={`rounded-lg bg-red-500 ${shake && 'animate'}`}
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
          <div className="gap-4 mt-7 sm:block md:block lg:flex lg:grid-cols-3">
            <div className="w-full col-span-1 mb-7">
              <FloatingLabelTextField
                id="resHouseNumber"
                name="resHouseNumber"
                placeholder="House or Block or Lot No."
                isRequired
                value={residentialAddress.houseNumber}
                type="text"
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
                onChange={(e) => onProvinceChange(e)}
                isRequired
                value={residentialAddress.province}
                innerRef={provCodeRef}
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
                innerRef={cityCodeRef}
                isRequired
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
                innerRef={brgyCodeRef}
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
