import { isEmpty } from 'lodash';
import React, { ReactNode } from 'react';

const size = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
};

type TableProps = {
  tableHeader: ReactNode | ReactNode[];
  tableBody: ReactNode;
  className?: string;
};

type TableHeaderProps = {
  label: string;
  headerWidth: string;
  className?: string;
  alignment?: 'left' | 'right' | 'center';
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

type TableDimensionProps = {
  label?: string | any;
  isText: boolean;
  tableDimension?: ReactNode | ReactNode[];
  className?: string;
  isPeriod?: boolean;
  periodLabel1?: any;
  periodLabel2?: any;
  showPeriodIfNull?: boolean;
  labelIfNull?: string;
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

type TableBodyProps = {
  children: ReactNode | ReactNode[];
  mapKey: any;
  className?: string;
};

export const TableHeader = ({
  label = 'TH Label',
  headerWidth = 'w-full',
  className = '',
  alignment = 'left',
  textSize = 'xs',
}: TableHeaderProps) => {
  return (
    <>
      <th
        scope="col"
        className={`${headerWidth} ${className} py-3 text-${alignment} select-none ${size[textSize]} font-semibold tracking-tighter text-gray-700`}
      >
        {label}
      </th>
    </>
  );
};

export const TableDimension = ({
  label = 'TD Label',
  isText = true,
  tableDimension = 'LOGO HERE',
  className = '',
  isPeriod = false,
  periodLabel1 = 'LABEL1',
  periodLabel2 = 'LABEL2',
  textSize = 'sm',
  showPeriodIfNull = true,
  labelIfNull = 'Present',
}: TableDimensionProps) => {
  return (
    <td className={`${className} py-2 text-gray-500 font-light`}>
      {isText === false ? (
        <>{tableDimension}</>
      ) : isText === true && isPeriod === false ? (
        <div
          className={`${size[textSize]} max-w-fit break-words text-gray-900 `}
        >
          {label}
        </div>
      ) : isPeriod === true && isText === true ? (
        <>
          <div
            className={`${size[textSize]} max-w-fit place-content-center break-words text-gray-900 `}
          >
            {periodLabel1}
            {showPeriodIfNull ? (
              periodLabel2 === null ? (
                <>
                  <div className="text-gray-400">to</div>
                  {labelIfNull}
                </>
              ) : (
                <>
                  <div className="text-gray-400">to</div>
                  {periodLabel2}
                </>
              )
            ) : (
              <>
                <div className="text-gray-400">to</div>
                {periodLabel2}
              </>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </td>
  );
};

export const TableBody = ({
  children = 'BODY HERE',
  className = '',
  mapKey,
}: TableBodyProps): JSX.Element => {
  return <>{children}</>;
};

export const Table = ({
  tableBody = 'BODY HERE',
  tableHeader = 'HEADER HERE',
  className = '',
}: TableProps): JSX.Element => {
  return (
    <div className="">
      <div className="flex flex-col">
        <div className=" overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-x-auto rounded-sm">
              <table className="min-w-full divide-y divide-slate-50 px-2 ">
                <thead className="bg-gray-200/70 ">
                  <tr className="h-[4rem]">{tableHeader}</tr>
                </thead>
                {tableBody}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
