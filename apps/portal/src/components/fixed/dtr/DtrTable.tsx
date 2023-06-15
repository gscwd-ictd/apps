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
  console.log(now);
  return (
    <>
      <div className="w-full flex rounded shadow">
        <table className="w-full bg-slate-50 border-spacing-0 border-0 border-separate">
          <thead className="border-0">
            <tr>
              <th className="border text-center py-2 px-2 md:px-6 text-sm md:text-md">
                Date
              </th>
              <th className="border text-center py-2 px-2 md:px-5 text-sm md:text-md">
                Time In
              </th>
              <th className="border text-center py-2 px-2 md:px-5 text-sm md:text-md">
                Lunch Out
              </th>
              <th className="border text-center py-2 px-2 md:px-5 text-sm md:text-md">
                Lunch In
              </th>
              <th className="border text-center py-2 px-2 md:px-5 text-sm md:text-md">
                Time Out
              </th>
              <th className="border text-center py-2 px-2 md:px-5 text-sm md:text-md">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="text-center text-sm ">
            {employeeDtr.length > 0 ? (
              employeeDtr.map((logs, index) => {
                return (

                    <tr key={index}>
                      <td className="border text-center py-2">{logs.day}</td>
                      <td
                        className={`border text-center py-2 ${
                          UseLateChecker(
                            logs.dtr.timeIn,
                            logs.schedule.timeIn
                          ) == true && logs.schedule.scheduleBase === 'Office'
                            ? 'text-red-500'
                            : ''
                        }`}
                      >
                        {logs.dtr.timeIn ? UseTwelveHourFormat(logs.dtr.timeIn) : ''}
                      </td>
                      <td className="border text-center py-2">
                        {logs.dtr.lunchOut ? UseTwelveHourFormat(logs.dtr.lunchOut) : ''}
                      </td>
                      <td className="border text-center py-2">
                        {logs.dtr.lunchIn ? UseTwelveHourFormat(logs.dtr.lunchIn) : ''}
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
                        {logs.dtr.timeOut ? UseTwelveHourFormat(logs.dtr.timeOut) : ''}
                      </td>
                      <td className="border text-center py-2">
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
      <div className="w-full flex justify-end pt-4">
        {/* <Link href={`/123/dtr/${date}`} target={'_blank'}>
          <Button variant={'primary'} size={'md'} loading={false}>
            View
          </Button>
        </Link> */}
      </div>
    </>
  );
};
