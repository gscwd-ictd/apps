import { ReactNode } from 'react';

type TableProps = {
  tableHeader: ReactNode | ReactNode[];
  tableBody: ReactNode | ReactNode[];
  className?: string;
};

type TableBodyProps = {
  children: ReactNode | ReactNode[];
};

type TableHeaderProps = {
  header: string;
  className?: string;
  alignment?: string;
};

export const TableHeader = ({
  header = 'header',
  className = '',
  alignment,
}: TableHeaderProps): JSX.Element => {
  return (
    <>
      <th scope="col" className={`${className}`}>
        {header}
      </th>
    </>
  );
};

export const TableBody = ({ children }: TableBodyProps): JSX.Element => {
  return <>{children}</>;
};

export const Table = ({
  tableBody = 'BODY',
  tableHeader = 'HEADER',
  className,
}: TableProps): JSX.Element => {
  return (
    <div className="p-2">
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className={`${className} w-full  `}>
                {/**divide-y divide-white */}
                <thead className="bg-transparent ">
                  <tr className="flex justify-between border-b">
                    {tableHeader}
                  </tr>
                </thead>
                <tbody>{tableBody}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
