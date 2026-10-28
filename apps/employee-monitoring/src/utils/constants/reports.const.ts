/* eslint-disable @nx/enforce-module-boundaries */
import { SelectOption } from 'libs/utils/src/lib/types/select.type';

export const Reports: Array<SelectOption> = [
  // 0
  {
    label: 'Report on Attendance',
    value: 'report on attendance',
  },
  // 1
  {
    label: 'Report on Personal Business Pass Slip',
    value: 'report on personal business pass slip',
  },
  // 2
  {
    label: 'Report on Official Business Pass Slip',
    value: 'report on official business pass slip',
  },
  // 3
  {
    label: 'Detailed Report on Personal Business Pass Slip',
    value: 'detailed report on personal business pass slip',
  },
  // 4
  {
    label: 'Detailed Report on Official Business Pass Slip',
    value: 'detailed report on official business pass slip',
  },
  // 5
  {
    label: 'Report on Employee Forced Leave Credits',
    value: 'report on employee forced leave credits',
  },
  // 6
  {
    label: 'Report on Employee Leave Credit Balance',
    value: 'report on employee leave credit balance',
  },
  // 7
  {
    label: 'Report on Employee Leave Credit Balance with Money',
    value: 'report on employee leave credit balance with money',
  },
  // 8
  {
    label: 'Report on Summary of Leave Without Pay',
    value: 'report on summary of leave without pay',
  },
  // 9
  {
    label: 'Report on Summary of Sick Leave',
    value: 'report on summary of sick leave',
  },
  // 10
  {
    label: 'Report on Summary of Rehabilitation Leave',
    value: 'report on summary of rehabilitation leave',
  },
  // 11
  {
    label: 'Detailed Report on Personal Business Pass Slip (COS-JO)',
    value: 'detailed report on personal business pass slip (cos-jo)',
  },
  // 12
  {
    label: 'Report on Unused Pass Slip',
    value: 'report on unused pass slip',
  },
  // 13
  {
    label: 'Report on Leave Application (Late Filing)',
    value: 'report on leave application late filing',
  },
  // 14
  {
    label: 'Report on Wellness Pass',
    value: 'report on wellness pass',
  },
];

export const WellnessPassPeriods: Array<SelectOption> = [
  { label: '1st Quarter', value: 'Q1' },
  { label: '2nd Quarter', value: 'Q2' },
  { label: '3rd Quarter', value: 'Q3' },
  { label: '4th Quarter', value: 'Q4' },
  { label: 'All Year', value: 'ALL' },
];

/** Date range (YYYY-MM-DD) of a Wellness Pass period of a year. */
export const wellnessPassPeriodRange = (year: number, period: string) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const startMonth = { Q1: 1, Q2: 4, Q3: 7, Q4: 10 }[period];
  if (!startMonth) return { dateFrom: `${year}-01-01`, dateTo: `${year}-12-31` };
  const endMonth = startMonth + 2;
  const lastDay = new Date(year, endMonth, 0).getDate();
  return { dateFrom: `${year}-${pad(startMonth)}-01`, dateTo: `${year}-${pad(endMonth)}-${pad(lastDay)}` };
};
