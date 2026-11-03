/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

type ReportExcelButtonProps = {
  /** report title, also used for the file name */
  title: string;
  /** the report document returned by the API: { report: [...], signatory } (or the rows themselves) */
  reportDoc: any;
};

/** Column headers for the field names used by the reports. Unknown fields get a readable version of their name. */
const HEADERS: Record<string, string> = {
  companyId: 'Employee No.',
  name: 'Name',
  employeeName: 'Name',
  positionTitle: 'Position',
  numberOfTimesLate: 'No. of Times Late',
  datesLate: 'Date/s Late',
  numberOfTimesUndertime: 'No. of Times Undertime',
  datesUndertime: 'Date/s Undertime',
  totalMinutesLateUndertime: 'Total Minutes Late & Undertime',
  conversion: 'Conversion (Leave Credits)',
  numberOfTimesHalfDay: 'No. of Times Half Day',
  daysHalfDay: 'Date/s Half Day',
  noAttendance: 'No Attendance',
  numberOfNoAttendance: 'No. of Days No Attendance',
  noOfTimes: 'No. of Times',
  dates: 'Dates',
  totalMinutes: 'Total Minutes',
  psDate: 'Date',
  dtrDate: 'Date',
  natureOfBusiness: 'Type',
  noOfMinConsumed: 'No. of Minutes Consumed',
  timeInTimeOut: 'Time Out - Time In',
  reason: 'Purpose / Destination',
  ledgerDebit: 'Ledger Debit',
  scheduleTimeIn: 'Schedule Time In',
  scheduleLunchIn: 'Schedule Lunch In',
  timeIn: 'Time In',
  lunchOut: 'Lunch Out',
  lunchIn: 'Lunch In',
  timeOut: 'Time Out',
  minutesLate: 'Minutes Late',
  accumulatedHours: 'Accumulated Hours',
  excessMinutes: 'Excess Minutes (over 4 hrs / quarter)',
  chargedToLeave: 'Charged to Leave',
  forcedLeaveBalance: 'Forced Leave Balance',
  vacationLeaveBalance: 'Vacation Leave Balance',
  sickLeaveBalance: 'Sick Leave Balance',
  totalLeaveBalance: 'Total Leave Balance',
  monthlyRate: 'Monthly Rate',
  leaveName: 'Leave',
  leaveDates: 'Leave Dates',
  noOfDays: 'No. of Days',
  dateOfFiling: 'Date of Filing',
  dateApplied: 'Date Applied',
  dateApproved: 'Date Approved',
  justification: 'Justification',
  leaveCount: 'Leave Count',
};

/** ids and nested objects are not useful in a spreadsheet */
const SKIPPED = new Set(['employeeId', 'id', 'passSlipId', 'leaveApplicationId', 'supervisorId', 'wellnessDates']);

const header = (key: string) =>
  HEADERS[key] ??
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

/** Downloads the report rows as an .xlsx file (same data as the PDF). */
export const ReportExcelButton = ({ title, reportDoc }: ReportExcelButtonProps) => {
  const router = useRouter();
  const rows: Array<Record<string, any>> = Array.isArray(reportDoc) ? reportDoc : reportDoc?.report ?? [];

  const download = async () => {
    const XLSX = await import('xlsx');
    const keys: string[] = [];
    rows.forEach((row) =>
      Object.keys(row ?? {}).forEach((key) => {
        const value = row[key];
        if (!SKIPPED.has(key) && !keys.includes(key) && (value === null || typeof value !== 'object')) keys.push(key);
      })
    );
    const period =
      router.query.date_from && router.query.date_to
        ? `${router.query.date_from} to ${router.query.date_to}`
        : router.query.month_year
        ? `${router.query.month_year}`
        : '';
    const aoa: any[][] = [
      [title.toUpperCase()],
      [[period, router.query.org_name].filter(Boolean).join(' - ')],
      [],
      ['No.', ...keys.map(header)],
      ...rows.map((row, index) => [
        index + 1,
        ...keys.map((key) => {
          const value = row[key];
          if (value === null || value === undefined) return '';
          const asNumber = Number(value);
          return typeof value === 'number' ||
            (value !== '' && !isNaN(asNumber) && /^-?\d+(\.\d+)?$/.test(String(value)))
            ? asNumber
            : value;
        }),
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [{ wch: 5 }, ...keys.map((key) => ({ wch: Math.min(60, Math.max(12, header(key).length + 2)) }))];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    const fileName = [title, period]
      .filter(Boolean)
      .join(' ')
      .replace(/[\\/:*?"<>|]/g, '-');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div className="flex justify-end w-full mb-3">
      <button
        type="button"
        disabled={isEmpty(rows)}
        onClick={download}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <i className="bx bxs-file-export"></i>
        Download Excel
      </button>
    </div>
  );
};

export default ReportExcelButton;
