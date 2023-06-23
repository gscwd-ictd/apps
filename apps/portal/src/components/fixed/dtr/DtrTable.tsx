/* eslint-disable @nx/enforce-module-boundaries */
import { Button, ListDef, Select } from '@gscwd-apps/oneui';
import { EmployeeDetails } from '../../../../src/types/employee.type';
import Link from 'next/link';
import { useDtrStore } from '../../../store/dtr.store';
import { UseLateChecker } from 'libs/utils/src/lib/functions/LateChecker';
import { UseUndertimeChecker } from 'libs/utils/src/lib/functions/UndertimeChecker';
import dayjs from 'dayjs';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';

type DtrtableProps = {
  employeeDetails: EmployeeDetails;
};

export const DtrTable = ({ employeeDetails }: DtrtableProps) => {
  const date = useDtrStore((state) => state.date);
  const employeeDtr = useDtrStore((state) => state.employeeDtr);
  const now = dayjs().toDate().toDateString();
  return (
    <>
      <div className="flex w-full rounded shadow">
        <table className="w-full border-0 border-separate bg-slate-50 border-spacing-0">
          <thead className="border-0">
            <tr>
              <th className="px-2 py-2 text-sm text-center border md:px-6 md:text-md">
                Date
              </th>
              <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md">
                Time In
              </th>
              <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md">
                Lunch Out
              </th>
              <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md">
                Lunch In
              </th>
              <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md">
                Time Out
              </th>
              <th className="px-2 py-2 text-sm text-center border md:px-5 md:text-md">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-center ">
            {employeeDtr.length > 0 ? (
              employeeDtr.map((logs, index) => {
                return (
                  <tr key={index}>
                    <td className="py-2 text-center border">{logs.day}</td>
                    <td
                      className={`border text-center py-2 ${
                        UseLateChecker(logs.dtr.timeIn, logs.schedule.timeIn) ==
                          true && logs.schedule.scheduleBase === 'Office'
                          ? 'text-red-500'
                          : ''
                      }`}
                    >
                      {logs.dtr.timeIn
                        ? UseTwelveHourFormat(logs.dtr.timeIn)
                        : ''}
                    </td>
                    <td className="py-2 text-center border">
                      {logs.dtr.lunchOut
                        ? UseTwelveHourFormat(logs.dtr.lunchOut)
                        : ''}
                    </td>
                    <td className="py-2 text-center border">
                      {logs.dtr.lunchIn
                        ? UseTwelveHourFormat(logs.dtr.lunchIn)
                        : ''}
                    </td>
                    <td
                      className={`border text-center py-2 ${
                        UseUndertimeChecker(
                          logs.dtr.timeOut,
                          logs.schedule.timeOut
                        ) == true && logs.schedule.scheduleBase === 'Office'
                          ? 'text-red-500'
                          : ''
                      }`}
                    >
                      {logs.dtr.timeOut
                        ? UseTwelveHourFormat(logs.dtr.timeOut)
                        : ''}
                    </td>
                    <td className="py-2 text-center border">
                      {logs.dtr.remarks}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-0">
                <td colSpan={6}>NO DATA FOUND</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end w-full pt-4">
        {/* <Link href={`/123/dtr/${date}`} target={'_blank'}>
          <Button variant={'primary'} size={'md'} loading={false}>
            View
          </Button>
        </Link> */}
      </div>
    </>
  );
};
