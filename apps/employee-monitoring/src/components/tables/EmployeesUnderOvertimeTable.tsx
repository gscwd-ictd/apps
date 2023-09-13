/* eslint-disable @nx/enforce-module-boundaries */

import { FunctionComponent, useEffect, useState } from 'react';
import { EmployeeOvertimeDetails } from '../../../../../libs/utils/src/lib/types/employee.type';
import { isEmpty } from 'lodash';
import Image from 'next/image';

import OvertimeAccomplishmentModal from '../modal/monitoring/overtime/OvertimeAccomplishmentModal';

type EmployeesUnderOvertimeTableProps = {
  overtimeId: string;
  employees: Array<EmployeeOvertimeDetails>;
};

type EmployeeRowDetails = {
  overtimeId: string;
  employee: EmployeeOvertimeDetails;
};

export const EmployeesUnderOvertimeTable: FunctionComponent<EmployeesUnderOvertimeTableProps> = ({
  overtimeId,
  employees,
}) => {
  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<EmployeeRowDetails>({} as EmployeeRowDetails);

  // Open modal action
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewActionModal = (overtimeId: string, employee: EmployeeOvertimeDetails) => {
    setViewModalIsOpen(true);
    setCurrentRowData({ overtimeId, employee });
  };
  const closeViewActionModal = () => setViewModalIsOpen(false);

  useEffect(() => {
    console.log(currentRowData);
  }, [currentRowData]);

  return (
    <>
      <div className="w-full overflow-auto">
        <table className="w-full border table-fixed bg-slate-50">
          <thead className="sticky top-0 bg-slate-50">
            <tr className="text-xs divide-x divide-y border-y">
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase"></th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase break-words">Name</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">Schedule Base</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">Assignment</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase"></th>
            </tr>
          </thead>
          <tbody className="text-sm max-h-[28rem]">
            {!isEmpty(employees) ? (
              employees.map((employee, index) => {
                return (
                  <tr className="divide-x divide-y" key={index}>
                    <td className="items-center p-2 break-words border-b text-center">
                      {employee.avatarUrl ? (
                        <Image
                          src={employee.avatarUrl}
                          width={80}
                          height={80}
                          alt={`Picture of employee ${employee.fullName}`}
                          className="m-auto w-[4rem] h-[4rem] rounded-full"
                        />
                      ) : (
                        <i className="text-gray-700 text-8xl bx bxs-user"></i>
                      )}
                    </td>

                    <td className="items-center p-2 break-words text-center">{employee.fullName}</td>

                    <td className="items-center p-2 break-words text-center">{employee.scheduleBase}</td>

                    <td className="items-center p-2 break-words text-center">{employee.assignment}</td>

                    <td className="items-center p-2 break-words text-center">
                      <div className="flex justify-center">
                        <i
                          className="text-2xl text-blue-500 bx bx-show"
                          role="button"
                          onClick={() => {
                            openViewActionModal(overtimeId, employee);
                          }}
                        ></i>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <>
                <tr className="text-sm border-b divide-x divide-y">
                  <td colSpan={14} className="w-full">
                    <div className="flex justify-center w-full justify-items-center">NO DATA FOUND</div>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      <OvertimeAccomplishmentModal
        modalState={viewModalIsOpen}
        setModalState={setViewModalIsOpen}
        closeModalAction={closeViewActionModal}
        rowData={currentRowData}
      />
    </>
  );
};
