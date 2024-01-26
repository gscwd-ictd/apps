/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';

import useSWR from 'swr';
// import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import { isEmpty } from 'lodash';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import { LoadingSpinner } from '@gscwd-apps/oneui';

import { LeaveLedgerEntry } from 'libs/utils/src/lib/types/leave-ledger-entry.type';

import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import { useLeaveLedgerPageStore } from 'apps/portal/src/store/leave-ledger-page.store';
import { CardMiniStats } from '../cards/CardMiniStats';
import { ActionType } from 'libs/utils/src/lib/enums/leave-ledger.type';
import { EmployeeWithDetails } from 'libs/utils/src/lib/types/employee.type';
import RemarksAndLeaveDatesModal from '../leaves/RemarksAndLeaveDatesModal';
import { EmployeeDetails } from 'apps/portal/src/types/employee.type';

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

type LeaveLedgerTableProps = {
  employeeData: EmployeeDetails;
};

type RemarksAndLeaveDates = {
  leaveDates: Array<string>;
  remarks: string;
};

export const LeaveLedgerTable: FunctionComponent<LeaveLedgerTableProps> = ({ employeeData }) => {
  const { getLeaveLedgerFail, getLeaveLedgerSuccess, leaveLedger } = useLeaveLedgerPageStore((state) => ({
    leaveLedger: state.leaveLedger,
    getLeaveLedgerSuccess: state.getLeaveLedgerSuccess,
    getLeaveLedgerFail: state.getLeaveLedgerFail,
  }));

  // forced leave balance
  const [forcedLeaveBalance, setForcedLeaveBalance] = useState<number>(0);

  // vacation leave balance
  const [vacationLeaveBalance, setVacationLeaveBalance] = useState<number>(0);

  // sick leave balance
  const [sickLeaveBalance, setSickLeaveBalance] = useState<number>(0);

  // special privilege leave balance
  const [specialPrivilegeLeaveBalance, setSpecialPrivilegeLeaveBalance] = useState<number>(0);

  // remarks and leave dates
  const [remarksAndLeaveDates, setRemarksAndLeaveDates] = useState<RemarksAndLeaveDates>({
    leaveDates: [],
    remarks: '',
  });

  // leave dates and remarks modal
  const [modalRemarksIsOpen, setModalRemarksIsOpen] = useState<boolean>(false);

  // zustand store initialization
  const { PostLeaveAdjustment, errorEntry, errorLedger } = useLeaveLedgerPageStore((state) => ({
    PostLeaveAdjustment: state.postLeaveAdjustment,
    errorEntry: state.error.errorEntry,
    errorLedger: state.error.errorLedger,
  }));

  const leaveLedgerUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave/ledger/${employeeData.user._id}/${employeeData.employmentDetails.companyId}`;

  const {
    data: swrLeaveLedger,
    isLoading: swrIsLoading,
    error: swrError,
    mutate: mutateLeaveLedger,
  } = useSWR(
    employeeData.user._id && employeeData.employmentDetails.companyId ? leaveLedgerUrl : null,
    fetchWithToken,
    {
      shouldRetryOnError: true,
      revalidateOnFocus: false,
    }
  );

  // open modal action
  const openModalAction = (leaveDates: Array<string>, remarks: string) => {
    setRemarksAndLeaveDates({ leaveDates, remarks });
    setModalRemarksIsOpen(true);
  };

  // close modal action
  const closeModalAction = () => {
    setRemarksAndLeaveDates({ leaveDates: [], remarks: '' });
    setModalRemarksIsOpen(false);
  };

  // get the latest balance by last index value
  const getLatestBalance = (leaveLedger: Array<LeaveLedgerEntry>) => {
    const lastIndexValue = leaveLedger[leaveLedger.length - 1];
    setForcedLeaveBalance(lastIndexValue.forcedLeaveBalance);
    setVacationLeaveBalance(lastIndexValue.vacationLeaveBalance ?? 0);
    setSickLeaveBalance(lastIndexValue.sickLeaveBalance ?? 0);
    setSpecialPrivilegeLeaveBalance(lastIndexValue.specialPrivilegeLeaveBalance ?? 0);
  };

  // value color
  const valueColorizer = (value: number, actionType: ActionType) => {
    if (parseFloat(value.toString()) === 0) return null;
    else if (actionType === ActionType.CREDIT && value != 0) return <span className="text-green-600">{value}</span>;
    else if (actionType === ActionType.DEBIT && value != 0) return <span className="text-red-600">{value}</span>;
  };

  // if a result is returned
  useEffect(() => {
    // success
    if (!isEmpty(swrLeaveLedger)) {
      // check if leave ledger is empty
      if (!isEmpty(swrLeaveLedger)) {
        // mutate leave dates from string to array of string
        const tempLeaveLedger = swrLeaveLedger.map((leaveLedger) => {
          const newLeaveDates = !isEmpty(leaveLedger.leaveDates) ? leaveLedger.leaveDates.toString().split(', ') : null;
          leaveLedger.leaveDates = newLeaveDates;
          return leaveLedger;
        });

        getLeaveLedgerSuccess(tempLeaveLedger);
        getLatestBalance(tempLeaveLedger);
      }
    }

    // error
    if (!isEmpty(swrError)) getLeaveLedgerFail(swrError.message);
  }, [swrLeaveLedger, swrError]);

  // Reset responses from all modal actions
  useEffect(() => {
    if (!isEmpty(PostLeaveAdjustment)) {
      mutateLeaveLedger();
    }
  }, [PostLeaveAdjustment]);

  if (swrIsLoading)
    return (
      <>
        <LoadingSpinner size="lg" />
      </>
    );

  return (
    <>
      <RemarksAndLeaveDatesModal
        modalState={modalRemarksIsOpen}
        setModalState={setModalRemarksIsOpen}
        closeModalAction={closeModalAction}
        rowData={remarksAndLeaveDates}
      />

      {/* Leave Ledger Table */}

      <div className="w-full grid-cols-4 gap-5 pb-5 sm:flex sm:flex-col lg:flex lg:flex-row">
        <div className="h-[6rem] w-full">
          <CardMiniStats
            className="p-2 border rounded-md shadow hover:cursor-pointer"
            icon={<i className="text-4xl text-white bx bxs-hand-right"></i>}
            title="Forced Leave"
            titleClassName="text-gray-100"
            valueClassName="text-white"
            bgColor="bg-red-500"
            isLoading={swrIsLoading}
            value={forcedLeaveBalance ?? 0}
          />
        </div>

        <div className="h-[6rem] w-full">
          <CardMiniStats
            className="p-2 border rounded-md shadow hover:cursor-pointer"
            icon={<i className="text-4xl text-white bx bx-run"></i>}
            title="Vacation Leave"
            titleClassName="text-gray-100"
            valueClassName="text-white"
            bgColor="bg-green-600 "
            isLoading={swrIsLoading}
            value={vacationLeaveBalance ?? 0}
          />
        </div>

        <div className="h-[6rem] w-full">
          <CardMiniStats
            className="p-2 border rounded-md shadow hover:cursor-pointer"
            icon={<i className="text-4xl text-white bx bxs-band-aid "></i>}
            title="Sick Leave"
            titleClassName="text-gray-100"
            valueClassName="text-white"
            bgColor="bg-orange-400 "
            isLoading={swrIsLoading}
            value={sickLeaveBalance ?? 0}
          />
        </div>

        <div className="h-[6rem] w-full">
          <CardMiniStats
            className="p-2 border rounded-md shadow hover:cursor-pointer"
            icon={<i className="text-4xl text-white bx bxs-offer"></i>}
            title="Special Privilege Leave"
            titleClassName="text-gray-100"
            valueClassName="text-white"
            bgColor="bg-cyan-600 "
            isLoading={swrIsLoading}
            value={specialPrivilegeLeaveBalance ?? 0}
          />
        </div>
      </div>

      <div className="w-full overflow-auto  max-h-[28rem]">
        <table className="w-full border table-fixed bg-slate-50">
          <thead className="sticky top-0 bg-slate-50">
            <tr className="text-xs divide-x divide-y border-y">
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">Period</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase break-words">Particulars</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">FL</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">FL Bal.</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">VL</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">VL Bal.</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">SL</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">SL Bal.</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">SLB</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">SLB Bal.</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">SPL</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">SPL Bal.</th>
              <th className="px-2 py-2 font-semibold text-center text-gray-900 uppercase">View More</th>
            </tr>
          </thead>
          <tbody className="text-sm max-h-[28rem]">
            {!isEmpty(leaveLedger) ? (
              leaveLedger.map((entry, index) => {
                return (
                  <tr className="divide-x divide-y" key={index}>
                    <td className="items-center p-2 break-words border-b text-start">
                      {dayjs(entry.period).format('MM/DD/YYYY')}
                    </td>
                    <td className="items-center p-2 break-words text-start">{entry.particulars}</td>
                    <td className="items-center p-2 break-words text-start">
                      {!isEmpty(entry.forcedLeave) ? valueColorizer(entry.forcedLeave, entry.actionType) : null}
                    </td>
                    <td className="items-center p-2 break-words text-start">{entry.forcedLeaveBalance ?? '0.000'}</td>
                    <td className="items-center p-2 break-words text-start">
                      {!isEmpty(entry.vacationLeave) ? valueColorizer(entry.vacationLeave, entry.actionType) : null}
                    </td>
                    <td className="items-center p-2 break-words text-start">{entry.vacationLeaveBalance ?? '0.000'}</td>
                    <td className="items-center p-2 break-words text-start">
                      {!isEmpty(entry.sickLeave) ? valueColorizer(entry.sickLeave, entry.actionType) : null}
                    </td>
                    <td className="items-center p-2 break-words text-start">{entry.sickLeaveBalance ?? '0.000'}</td>
                    <td className="items-center p-2 break-words text-start">
                      {!isEmpty(entry.specialLeaveBenefit)
                        ? valueColorizer(entry.specialLeaveBenefit, entry.actionType)
                        : null}
                    </td>
                    <td className="items-center p-2 break-words text-start">
                      {entry.specialLeaveBenefitBalance ?? '0.000'}
                    </td>
                    <td className="items-center p-2 break-words text-start">
                      {!isEmpty(entry.specialPrivilegeLeave)
                        ? valueColorizer(entry.specialPrivilegeLeave, entry.actionType)
                        : null}
                    </td>
                    <td className="items-center p-2 break-words text-start">
                      {entry.specialPrivilegeLeaveBalance ?? '0.000'}
                    </td>
                    <td className="items-center p-2 break-words text-start">
                      <div className="flex justify-center">
                        <i
                          className="text-2xl text-blue-500 bx bx-show"
                          role="button"
                          onClick={() => {
                            openModalAction(entry.leaveDates, entry.remarks);
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
    </>
  );
};
