import { Button, ListDef, Select } from '@gscwd-apps/oneui';
import { EmployeeDetails } from '../../../../src/types/employee.type';
import { format } from 'date-fns';
import Link from 'next/link';
import { useDtrStore } from '../../../store/dtr.store';

type DtrtableProps = {
  employeeDetails: EmployeeDetails;
};

export const DtrTable = ({ employeeDetails }: DtrtableProps) => {
  const date = useDtrStore((state) => state.date);

  const faceScanLogs = [
    {
      id: 1,
      Date: '01-10-2023',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 2,
      Date: '01-09-2023',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 3,
      Date: '01-08-2023',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 4,
      Date: '01-06-2023',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 5,
      Date: '02-10-2023',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 6,
      Date: '02-09-2023',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 7,
      Date: '02-08-2023',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 8,
      Date: '03-16-2023',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 9,
      Date: '03-15-2023',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 10,
      Date: '03-04-2023',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 11,
      Date: '12-25-2022',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 12,
      Date: '04-20-2022',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 13,
      Date: '04-21-2022',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
    {
      id: 14,
      Date: '05-21-2022',
      TimeIn: '7:30AM',
      TimeOut: '12:29PM',
      LunchIn: '12:31PM',
      LunchOut: '5:30PM',
      Schedule: '8:00AM - 5:00PM',
    },
  ];

  return (
    <>
      <div className="w-full flex rounded shadow">
        <table className="w-full bg-slate-50 border-spacing-0 border-0 border-separate">
          <thead className="border-0">
            <tr>
              <th className="border text-center py-2 px-6">Date</th>
              <th className="border text-center py-2 px-5">Time In</th>
              <th className="border text-center py-2 px-5">Lunch Out</th>
              <th className="border text-center py-2 px-5">Lunch In</th>
              <th className="border text-center py-2 px-5">Time Out</th>
              <th className="border text-center py-2 px-5">Schedule</th>
            </tr>
          </thead>
          <tbody className="text-center text-sm ">
            {faceScanLogs.filter(
              (filterLogs) =>
                format(new Date(filterLogs.Date), 'MM-yyyy') ===
                format(new Date(date), 'MM-yyyy')
            ).length > 0 ? (
              faceScanLogs
                .filter(
                  (filterLogs) =>
                    format(new Date(filterLogs.Date), 'MM-yyyy') ===
                    format(new Date(date), 'MM-yyyy')
                )
                .map((logs) => {
                  return (
                    <>
                      <tr>
                        <td colSpan={6}></td>
                      </tr>
                      <tr key={logs.id}>
                        <td className="border text-center py-2">{logs.Date}</td>
                        <td className="border text-center py-2">
                          {logs.TimeIn}
                        </td>
                        <td className="border text-center py-2">
                          {logs.LunchOut}
                        </td>
                        <td className="border text-center py-2">
                          {logs.LunchIn}
                        </td>
                        <td className="border text-center py-2">
                          {logs.TimeOut}
                        </td>
                        <td className="border text-center py-2">
                          {logs.Schedule}
                        </td>
                      </tr>
                    </>
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
        <Link
          href={`/${employeeDetails.profile._id}/dtr/${date}`}
          target={'_blank'}
        >
          <Button variant={'primary'} size={'md'} loading={false}>
            View
          </Button>
        </Link>
      </div>
    </>
  );
};
