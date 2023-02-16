import React from 'react'

const size = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
}

type TableProps = {
  tableHeader: React.ReactNode
  tableBody: React.ReactNode
  className?: string
}

type TableHeaderProps = {
  label: string
  headerWidth: string
  className?: string
  alignment?: 'left' | 'right' | 'center'
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

type TableDimensionProps = {
  label?: string | any
  isText: boolean
  tableDimension?: React.ReactChild | React.ReactChildren
  className?: string
  isPeriod?: boolean
  periodLabel1?: any
  periodLabel2?: any
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

type TableBodyProps = {
  children: React.ReactChild | React.ReactChildren
  mapKey: any
  className?: string
}

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
        className={`${headerWidth} ${className} py-3 text-${alignment} select-none ${size[textSize]} font-medium uppercase tracking-tighter text-gray-500`}
      >
        {label}
      </th>
    </>
  )
}

export const TableDimension = ({
  label = 'TD Label',
  isText = true,
  tableDimension = 'LOGO HERE',
  className = '',
  isPeriod = false,
  periodLabel1 = 'LABEL1',
  periodLabel2 = 'LABEL2',
  textSize = 'sm',
}: TableDimensionProps) => {
  return (
    <td className={`${className} py-4 text-gray-500  `}>
      {isText === false ? (
        <>{tableDimension}</>
      ) : isText === true && isPeriod === false ? (
        <div className={`${size[textSize]} max-w-fit break-words text-gray-900 `}>{label}</div>
      ) : isPeriod === true && isText === true ? (
        <>
          <div className={`${size[textSize]} max-w-fit place-content-center break-words text-gray-900 `}>
            {periodLabel1}
            {periodLabel2 !== '' || periodLabel2 !== null ? (
              <>
                <div className="text-gray-400">to</div>
                {periodLabel2 ? periodLabel2 : 'Present'}
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </td>
  )
}

export const TableBody = ({ children = 'BODY HERE', className = '', mapKey }: TableBodyProps): JSX.Element => {
  return <>{children}</>
}

export const Table = ({ tableBody = 'BODY HERE', tableHeader = 'HEADER HERE', className = '' }: TableProps): JSX.Element => {
  return (
    <div className="mt-5 ">
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="w-full divide-y divide-indigo-50 ">
                <thead className="bg-transparent">
                  <tr>{tableHeader}</tr>
                </thead>
                {tableBody}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
