/* eslint-disable @nx/enforce-module-boundaries */
import dayjs from 'dayjs';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { EmployeeWithDetails } from '../../../../../libs/utils/src/lib/types/employee.type';
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

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(duration);

type LeaveLedgerTableProps = {
  employeeData: EmployeeWithDetails;
};

export const LeaveLedgerTable: FunctionComponent<LeaveLedgerTableProps> = ({
  employeeData,
}) => {
  const {
    getLeaveLedger,
    getLeaveLedgerFail,
    getLeaveLedgerSuccess,
    leaveLedger,
  } = useLeaveLedgerStore((state) => ({
    leaveLedger: state.leaveLedger,
    getLeaveLedger: state.getLeaveLedger,
    getLeaveLedgerSuccess: state.getLeaveLedgerSuccess,
    getLeaveLedgerFail: state.getLeaveLedgerFail,
  }));

  const [forcedLeaveBalance, setForcedLeaveBalance] = useState<number>(0);
  const [vacationLeaveBalance, setVacationLeaveBalance] = useState<number>(0);
  const [sickLeaveBalance, setSickLeaveBalance] = useState<number>(0);
  const [specialLeaveBenefitsBalance, setSpecialLeaveBenefitsBalance] =
    useState<number>(0);

  const {
    data: swrLeaveLedger,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(
    `leave/ledger/${employeeData.userId}/${employeeData.companyId}`,
    fetcherEMS,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // get the latest balance by last index value
  const getLatestBalance = (leaveLedger: Array<LeaveLedgerEntry>) => {
    const lastIndexValue = leaveLedger[leaveLedger.length - 1];
    setForcedLeaveBalance(lastIndexValue.forcedLeaveBalance);
    setVacationLeaveBalance(lastIndexValue.vacationLeaveBalance);
    setSickLeaveBalance(lastIndexValue.sickLeaveBalance);
    setSpecialLeaveBenefitsBalance(lastIndexValue.specialLeaveBenefitBalance);
  };

  // month day and year
  const formatDateInWords = (date: string) => {
    return dayjs(date).format('MMMM DD, YYYY');
  };

  // time only with AM or PM
  const formatTime = (date: string | null) => {
    if (date === null || isEmpty(date)) return '';
    else return dayjs('01-01-0000' + ' ' + date).format('hh:mm A');
  };

  // value color
  const valueColorizer = (value: number, actionType: ActionType) => {
    if (parseFloat(value.toString()) === 0) return null;
    else if (actionType === ActionType.CREDIT && value != 0)
      return <span className="text-green-600">{value}</span>;
    else if (actionType === ActionType.DEBIT && value != 0)
      return <span className="text-red-600">{value}</span>;
  };

  // if a result is returned
  useEffect(() => {
    // success
    if (!isEmpty(swrLeaveLedger)) {
      getLeaveLedgerSuccess(swrLeaveLedger.data);
      getLatestBalance(swrLeaveLedger.data);
    }

    // error
    if (!isEmpty(swrError)) getLeaveLedgerFail(swrError.message);
  }, [swrLeaveLedger, swrError]);

  if (swrIsLoading)
    return (
      <>
        <LoadingSpinner size="lg" />
      </>
    );

  return (
    <>
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
            title="Special Leave Benefits"
            titleClassName="text-gray-100"
            valueClassName="text-white"
            bgColor="bg-cyan-600 "
            isLoading={swrIsLoading}
            value={specialLeaveBenefitsBalance ?? 0}
          />
        </div>
      </div>

      <div className="flex w-full overflow-auto border rounded-lg shadow">
        <table className="w-full table-auto bg-slate-50 ">
          <thead className="border-0">
            <tr className="text-xs border-b divide-x">
              <th className="px-5 py-2 w-[12rem] font-semibold text-center text-gray-900 uppercase">
                Period
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                Particulars
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                Forced Leave
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                FL Balance
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                Vacation Leave
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                VL Balance
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                Sick Leave
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                SL Balance
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                Special Leave Benefit
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase">
                SLB Balance
              </th>
              <th className="px-5 py-2 font-semibold text-center text-gray-900 uppercase w-[12rem]">
                Leave Dates
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-center ">
            {!isEmpty(leaveLedger) ? (
              leaveLedger.map((entry, index) => {
                return (
                  <Fragment key={index}>
                    <tr className="divide-x divide-y">
                      {/* {JSON.stringify(index)} ==={' '}
                      {JSON.stringify(leaveLedger.length - 1)} */}
                      <td className="items-center p-2 break-words border-b text-start">
                        {dayjs(entry.period).format('MM/DD/YYYY')}
                      </td>
                      <td className="items-center p-2 break-words text-start">
                        {entry.particulars}
                      </td>
                      <td className="items-center p-2 break-words text-start">
                        {!isEmpty(entry.forcedLeave)
                          ? valueColorizer(entry.forcedLeave, entry.actionType)
                          : null}
                      </td>
                      <td className="items-center p-2 break-words text-start">
                        {entry.forcedLeaveBalance ?? '0.000'}
                      </td>
                      <td className="items-center p-2 break-words text-start">
                        {!isEmpty(entry.vacationLeave)
                          ? valueColorizer(
                              entry.vacationLeave,
                              entry.actionType
                            )
                          : null}
                      </td>
                      <td className="items-center p-2 break-words text-start">
                        {entry.vacationLeaveBalance ?? '0.000'}
                      </td>
                      <td className="items-center p-2 break-words text-start">
                        {!isEmpty(entry.sickLeave)
                          ? valueColorizer(entry.sickLeave, entry.actionType)
                          : null}
                      </td>
                      <td className="items-center p-2 break-words text-start">
                        {entry.sickLeaveBalance ?? '0.000'}
                      </td>
                      <td className="items-center p-2 break-words text-start">
                        {!isEmpty(entry.specialLeaveBenefit)
                          ? valueColorizer(
                              entry.specialLeaveBenefit,
                              entry.actionType
                            )
                          : null}
                      </td>
                      <td className="items-center p-2 break-words text-start">
                        {entry.specialLeaveBenefitBalance ?? '0.000'}
                      </td>
                      <td className="items-center p-2 break-words text-start">
                        {entry.leaveDates ?? null}
                      </td>
                    </tr>
                  </Fragment>
                );
              })
            ) : (
              <>
                <tr className="text-sm border-b divide-x divide-y">
                  {/* <td colSpan={8}>NO DATA FOUND</td> */}
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    CREDIT | Beginning Balance - 2023
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">5.000</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    5.000
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">12.500</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    12.500
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">17.500</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    17.500
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    0.000
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                </tr>
                <tr className="text-sm tracking-tight border-b divide-x divide-y">
                  {/* <td colSpan={8}>NO DATA FOUND</td> */}
                  <td className="items-center p-2 break-words text-start">
                    01/03/2023
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    CREDIT | Earned Leave - JANUARY 2023
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">1.250</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    6.250
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">1.250</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    13.750
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-green-600">1.250</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    18.750
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    0.000
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    01/03/2023
                  </td>
                </tr>
                <tr className="text-sm divide-x divide-y">
                  {/* <td colSpan={8}>NO DATA FOUND</td> */}
                  <td className="items-center p-2 break-words text-start">
                    01/04/2023
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    DEBIT | Tardiness - 01-04-2023=45
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    6.250
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    <span className="text-red-600">-0.094</span>
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    13.656
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    18.750
                  </td>
                  <td className="items-center p-2 break-words text-start"></td>
                  <td className="items-center p-2 break-words text-start">
                    0.000
                  </td>
                  <td className="items-center p-2 break-words text-start">
                    01/03/2023
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
