/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { EmployeeOvertimeDetails, EmployeeWithDetails } from '../../../../../libs/utils/src/lib/types/employee.type';
import useSWR from 'swr';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import { LoadingSpinner } from '@gscwd-apps/oneui';
import { CardMiniStats } from '../cards/CardMiniStats';
import { useLeaveLedgerStore } from '../../store/leave-ledger.store';
import { ActionType } from '../../../../../libs/utils/src/lib/enums/leave-ledger.type';
import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';
import RemarksAndLeaveDatesModal from '../modal/employees/leave-ledger/RemarksAndLeaveDatesModal';
import OvertimeAccomplishmentModal from '../modal/monitoring/overtime/OvertimeAccomplishmentModal';

type EmployeesUnderOvertimeTableProps = {
  overtimeId: string;
  employees: Array<EmployeeOvertimeDetails>;
};

type EmployeeRowDetails = {
  overtimeId: string;
  employeeId: string;
};

export const EmployeesUnderOvertimeTable: FunctionComponent<EmployeesUnderOvertimeTableProps> = ({
  overtimeId,
  employees,
}) => {
  // const { getLeaveLedgerFail, getLeaveLedgerSuccess, leaveLedger } =
  //   useLeaveLedgerStore((state) => ({
  //     leaveLedger: state.leaveLedger,
  //     getLeaveLedgerSuccess: state.getLeaveLedgerSuccess,
  //     getLeaveLedgerFail: state.getLeaveLedgerFail,
  //   }));

  // // leave dates and remarks modal
  // const [modalRemarksIsOpen, setModalRemarksIsOpen] = useState<boolean>(false);

  // const {
  //   data: swrLeaveLedger,
  //   isLoading: swrIsLoading,
  //   error: swrError,
  // } = useSWR(
  //   `leave/ledger/${employeeData.userId}/${employeeData.companyId}`,
  //   fetcherEMS,
  //   {
  //     shouldRetryOnError: false,
  //     revalidateOnFocus: false,
  //   }
  // );

  // Current row data in the table that has been clicked
  const [currentRowData, setCurrentRowData] = useState<EmployeeRowDetails>({} as EmployeeRowDetails);

  // Open modal action
  const [viewModalIsOpen, setViewModalIsOpen] = useState<boolean>(false);
  const openViewActionModal = (overtimeId: string, employeeId: string) => {
    setViewModalIsOpen(true);
    setCurrentRowData({ overtimeId, employeeId });
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
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">Company ID</th>
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
                    <td className="items-center p-2 break-words border-b text-center">{employee.companyId}</td>

                    <td className="items-center p-2 break-words text-center">{employee.fullName}</td>

                    <td className="items-center p-2 break-words text-center">{employee.scheduleBase}</td>

                    <td className="items-center p-2 break-words text-center">{employee.assignment}</td>

                    <td className="items-center p-2 break-words text-center">
                      <div className="flex justify-center">
                        <i
                          className="text-2xl text-blue-500 bx bx-show"
                          role="button"
                          onClick={() => {
                            openViewActionModal(overtimeId, employee.employeeId);
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
