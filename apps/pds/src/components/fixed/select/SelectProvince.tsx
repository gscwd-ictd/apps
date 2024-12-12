import { isEmpty } from 'lodash';
import React, { MutableRefObject, useEffect, useState } from 'react';
import useSWR from 'swr';
import { Address } from '../../../types/data/address.type';
import fetcher from '../../modular/fetcher/Fetcher';
import LoadingIndicator from '../loader/LoadingIndicator';

type Province = {
  province_code: string;
  province_name: string;
  psgc_code: string;
  region_code: string;
};

type MyVariant = 'default' | 'primary' | 'secondary' | 'warning' | 'danger' | 'light' | 'simple';

interface MySelectProvinceProps
  extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  id: string;

  codeVariable: Address;
  className?: string;
  controller?: any;
  dispatchCodeVariable: any;
  isError?: boolean;
  innerRef?: MutableRefObject<any>;
  variant?: MyVariant;
  muted?: boolean;
  isRequired?: boolean;
}

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

export const SelectProvince: React.FC<MySelectProvinceProps> = ({
  id,
  codeVariable,
  dispatchCodeVariable,
  innerRef,
  variant = 'light',
  className,
  controller,
  muted = false,
  isRequired = false,
  ...props
}): JSX.Element => {
  // initialize fetcher using useSWR
  const { data, error } = useSWR(process.env.NEXT_PUBLIC_PROVINCES, fetcher, {});
  const [provinces, setProvinces] = useState<Array<Province>>([]);

  /**
   *  if residential or permanent address province code is not null
   *  and province code is equal to currently mapped province code
   *  set the province name to currently mapped province name
   */
  useEffect(() => {
    if (!isEmpty(data)) {
      // sort provinces by name
      const sortedProvinces = data.sort((firstItem: Province, secondItem: Province) =>
        firstItem.province_name > secondItem.province_name
          ? 1
          : secondItem.province_name > firstItem.province_name
          ? -1
          : 0
      );
      setProvinces(sortedProvinces);
    }
  }, [data]);

  //
  useEffect(() => {
    if (!isEmpty(provinces)) {
      provinces.map((province: Province) => {
        if (codeVariable.province === province.province_name) {
          dispatchCodeVariable({ ...codeVariable, provCode: province.province_code });
        }
      });
    }
  }, [provinces, codeVariable.province]);

  /**
   * while province code is being changed
   * and if province code and city code is not empty
   * set city code to empty string
   */

  // useEffect(() => {
  //   if (!isEmpty(codeVariable.city) && !isEmpty(codeVariable.cityCode)) {
  //     dispatchCodeVariable({ ...codeVariable, barangay: '', brgyCode: '' });
  //   }
  // }, [codeVariable.provCode]);

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
            {provinces.map((province: Province, provinceIdx: number) => (
              <option key={provinceIdx} value={province.province_name}>
                {province.province_name}
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
              <span className="text-gray-600">Province</span>
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
