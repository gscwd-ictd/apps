import { isEmpty } from 'lodash';
import { MutableRefObject, useEffect, useState } from 'react';
import useSWR from 'swr';
import { Address } from '../../../types/data/address.type';
import fetcher from '../../modular/fetcher/Fetcher';
import LoadingIndicator from '../loader/LoadingIndicator';

type Brgy = {
  brgy_code: string;
  brgy_name: string;
  city_code: string;
  province_code: string;
  region_code: string;
};

type MyVariant = 'default' | 'primary' | 'secondary' | 'warning' | 'danger' | 'light' | 'simple';

const background = {
  default: '',
  primary: 'bg-white',
  secondary: 'bg-green-50',
  warning: 'bg-orange-50',
  danger: 'bg-rose-50',
  light: 'bg-white',
  simple: 'bg-gray-50',
};

const border = {
  default: 'rounded-xl border border-gray-200',
  primary: 'rounded-xl border border-gray-200',
  secondary: 'rounded-xl border border-emerald-700',
  warning: 'rounded-xl border border-orange-600',
  danger: 'rounded-xl border border-rose-600',
  light: 'rounded-xl border border-gray-200',
  simple: 'rounded-xl border border-gray-100 ',
};

const focus = {
  default: 'focus:ring focus:border-gray-500 focus:ring-gray-100',
  primary: 'focus:ring focus:border-gray-700 focus:ring-indigo-100',
  secondary: 'focus:ring focus:border-emerald-600 focus:ring-green-100',
  warning: 'focus:ring focus:border-orange-500 focus:ring-orange-100',
  danger: 'focus:ring focus:border focus:border-rose-600 focus:ring-rose-100',
  light: 'focus:border-indigo-700 focus:ring-1 focus:ring-indigo-100',
  simple: 'focus:border-indigo-700 focus:ring-1 focus:ring-indigo-100',
};

const focusWithin = {
  default: 'focus-within:ring-1 focus-within:border focus-within:border-gray-500 focus-within:ring-gray-100',
  primary: 'focus-within:ring-1  focus-within:border focus-within:border-indigo-700 focus-within:ring-indigo-100',
  secondary: 'focus-within:ring-1 focus-within:border focus-within:border-emerald-600 focus-within:ring-green-100',
  warning: 'focus-within:ring-1 focus-within:border focus-within:border-orange-500 focus-within:ring-orange-100',
  danger: 'focus-within:ring-1 focus-within:border focus-within:border-rose-600 focus-within:ring-rose-100',
  light: 'focus-within:ring-0 focus-within:border focus-within:border-indigo-500 focus-within:ring-indigo-100',
  simple: 'focus-within:ring-0',
};

interface MySelectBrgyProps
  extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  id: string;
  codeVariable: Address;
  dispatchCodeVariable: any;
  isError?: boolean;
  rfRegister?: any;
  className?: string;
  muted?: boolean;
  innerRef?: MutableRefObject<any>;
  variant?: MyVariant;
  isRequired?: boolean;
}

export const SelectBrgy: React.FC<MySelectBrgyProps> = ({
  id,
  name,
  codeVariable,
  dispatchCodeVariable,
  innerRef,
  variant = 'light',
  className,
  muted = false,
  isRequired = false,
  ...props
}) => {
  //initialize fetcher using useSWR
  const { data, error } = useSWR(process.env.NEXT_PUBLIC_BARANGAYS, fetcher, {});
  const [brgys, setBrgys] = useState<Array<Brgy>>([]);

  /**
   *  if residential or permanent address barangay code is not null
   *  and barangay code is equal to currently mapped barangay code
   *  set the barangay name to currently mapped barangay name
   */
  useEffect(() => {
    // sort barangay by name
    if (!isEmpty(data)) {
      const filteredBrgys = data.filter((brgy: Brgy) => brgy.city_code === codeVariable.cityCode);

      const sortedBrgys = filteredBrgys.sort((firstItem: Brgy, secondItem: Brgy) =>
        firstItem.brgy_name > secondItem.brgy_name ? 1 : secondItem.brgy_name > firstItem.brgy_name ? -1 : 0
      );

      setBrgys(sortedBrgys);
    }
  }, [data, codeVariable.cityCode]);

  useEffect(() => {
    if (!isEmpty(brgys)) {
      brgys.map((brgy: Brgy) => {
        if (codeVariable.barangay === brgy.brgy_name) {
          dispatchCodeVariable({ ...codeVariable, brgyCode: brgy.brgy_code });
        }
      });
    }
  }, [brgys, codeVariable.barangay]);

  if (error) return <>An Error has occurred...</>;
  if (!data)
    return (
      <>
        <LoadingIndicator />
      </>
    );

  return (
    <>
      <div
        className={`${className} ${muted ? `cursor-not-allowed focus-within:ring-0` : ``}

        ${props.hidden ? 'hidden' : ''} transition-all`}
      >
        <div className="relative">
          <select
            id={id}
            ref={innerRef}
            {...props}
            disabled={muted}
            className={`w-full ${
              muted ? 'cursor-not-allowed' : 'cursor-pointer'
            } cursor-pointer py-[1.1rem] pl-[1.12rem] pr-4 font-normal text-gray-600
          ${border[variant]} ${background[variant]} ${focus[variant]} ${focusWithin[variant]}
          `}
          >
            <option value="">Select...</option>
            {brgys.map((brgy: Brgy, brgyIdx: number) => (
              <option key={brgyIdx} value={brgy.brgy_name}>
                {brgy.brgy_name}
              </option>
            ))}
          </select>
          <label
            htmlFor={id}
            className={`peer-focus:font-sm peer-focus:-pt-1 absolute -top-6 left-0 mx-4  mt-4 h-fit
          cursor-text text-xs font-normal text-gray-400 transition-all peer-placeholder-shown:-inset-y-[0.85rem] peer-placeholder-shown:left-0 peer-placeholder-shown:text-base  ${
            muted ? 'peer-placeholder-shown:text-gray-400' : 'peer-placeholder-shown:text-gray-600'
          }  bg-white peer-focus:bg-white peer-focus:text-xs peer-focus:text-gray-400`}
          >
            <div className="flex px-1">
              <span className="text-gray-600">Barangay</span>
              {isRequired ? (
                <>
                  <span className="text-red-700">*</span>
                </>
              ) : (
                ''
              )}
            </div>
          </label>
        </div>
      </div>
    </>
  );
};
