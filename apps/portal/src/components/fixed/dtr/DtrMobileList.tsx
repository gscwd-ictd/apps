/* eslint-disable @nx/enforce-module-boundaries */
import { Button } from '@gscwd-apps/oneui';
import dayjs from 'dayjs';
import { HiPencilAlt } from 'react-icons/hi';
import { UseLateChecker } from 'libs/utils/src/lib/functions/LateChecker';
import { UseUndertimeChecker } from 'libs/utils/src/lib/functions/UndertimeChecker';
import { UseLateLunchInChecker } from 'libs/utils/src/lib/functions/LateLunchInChecker';
import { UseTwelveHourFormat } from 'libs/utils/src/lib/functions/TwelveHourFormatter';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { HolidayTypes } from 'libs/utils/src/lib/enums/holiday-types.enum';
import { EmployeeDtrWithSchedule } from 'libs/utils/src/lib/types/dtr.type';

type DtrMobileListProps = {
  dtrDays: Array<EmployeeDtrWithSchedule>;
  /** office schedule: 4 logs a day; field / pumping station: time in and time out with their dates */
  isOffice: boolean;
  serverDate: string;
  onEdit: (logs: EmployeeDtrWithSchedule) => void;
};

const fmt = (time?: string | null) => (time ? UseTwelveHourFormat(time) : '--');

/** same rules as the desktop table */
const isUndertime = (logs: EmployeeDtrWithSchedule, isOffice: boolean) => {
  const blocked =
    logs.holidayType === HolidayTypes.REGULAR ||
    logs.holidayType === HolidayTypes.SPECIAL ||
    logs.dtr.remarks === 'Rest Day';
  if (blocked) return false;
  if (logs.dtr.remarks.includes('Work Suspension')) {
    if (!isOffice && logs.schedule.shift === 'night') return false;
    const suspensionTimeOut = logs.dtr.remarks.split('Work Suspension (')[1]?.split(')')[0];
    return (
      !!suspensionTimeOut &&
      UseUndertimeChecker(logs.dtr.timeOut, suspensionTimeOut) == true &&
      logs.isRestDay === false &&
      logs.isHoliday === false
    );
  }
  return UseUndertimeChecker(logs.dtr.timeOut, logs.schedule.timeOut) == true;
};

const isLate = (logs: EmployeeDtrWithSchedule) =>
  UseLateChecker(logs.dtr.timeIn, logs.schedule.timeIn) == true &&
  logs.holidayType !== HolidayTypes.REGULAR &&
  logs.holidayType !== HolidayTypes.SPECIAL &&
  logs.dtr.remarks !== 'Rest Day';

const rowStyle = (logs: EmployeeDtrWithSchedule) =>
  logs.holidayType === HolidayTypes.REGULAR
    ? 'bg-red-200 border-red-200'
    : logs.holidayType === HolidayTypes.SPECIAL
    ? 'bg-blue-300 border-blue-300'
    : logs.dtr.remarks === 'Rest Day' && !logs.dtrCorrection
    ? 'bg-gray-200 border-gray-200'
    : logs.dtrCorrection
    ? 'bg-amber-200 border-amber-200'
    : 'bg-white border-gray-200';

const TimeCell = ({ label, value, warn }: { label: string; value: string; warn?: boolean }) => (
  <div className="flex flex-col items-center px-1 py-1.5 rounded bg-white/60">
    <span className="text-[10px] uppercase tracking-wide text-gray-500">{label}</span>
    <span className={`text-sm font-medium ${warn ? 'text-red-500' : 'text-gray-800'}`}>{value}</span>
  </div>
);

/** DTR as one card per day, for phones (the table is shown from the md breakpoint up) */
export const DtrMobileList = ({ dtrDays, isOffice, serverDate, onEdit }: DtrMobileListProps) => {
  const today = serverDate ? DateFormatter(serverDate, 'YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');

  return (
    <div className="flex flex-col gap-2 md:hidden">
      {dtrDays.map((logs, index) => {
        const canEdit = DateFormatter(logs.day, 'YYYY-MM-DD') < today;
        const timeOutDate =
          !isOffice && logs.schedule.shift === 'night' ? dayjs(logs.day).add(1, 'day').format('YYYY-MM-DD') : logs.day;

        return (
          <div key={index} className={`border rounded-lg p-3 ${rowStyle(logs)}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-gray-800">{dayjs(logs.day).format('MMM DD, YYYY')}</div>
                <div className="text-xs text-gray-500">
                  {dayjs(logs.day).format('dddd')} · {fmt(logs.schedule.timeIn)} - {fmt(logs.schedule.timeOut)}
                </div>
              </div>
              <Button
                variant={canEdit ? 'primary' : 'danger'}
                size={'sm'}
                loading={false}
                onClick={() => onEdit(logs)}
                disabled={!canEdit}
              >
                <div className="flex justify-center">
                  <HiPencilAlt className="w-4 h-5" />
                </div>
              </Button>
            </div>

            {isOffice ? (
              <div className="grid grid-cols-4 gap-1 mt-2">
                <TimeCell label="Time In" value={fmt(logs.dtr.timeIn)} warn={isLate(logs)} />
                <TimeCell label="Lunch Out" value={fmt(logs.dtr.lunchOut)} />
                <TimeCell
                  label="Lunch In"
                  value={fmt(logs.dtr.lunchIn)}
                  warn={
                    UseLateLunchInChecker(logs.dtr.lunchIn, logs.schedule.lunchIn) == true &&
                    logs.schedule.scheduleBase === 'Office'
                  }
                />
                <TimeCell label="Time Out" value={fmt(logs.dtr.timeOut)} warn={isUndertime(logs, true)} />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1 mt-2">
                <TimeCell
                  label={`In · ${dayjs(logs.day).format('MMM DD')}`}
                  value={fmt(logs.dtr.timeIn)}
                  warn={isLate(logs)}
                />
                <TimeCell
                  label={`Out · ${dayjs(timeOutDate).format('MMM DD')}`}
                  value={fmt(logs.dtr.timeOut)}
                  warn={isUndertime(logs, false)}
                />
              </div>
            )}

            {logs.dtr.remarks || logs.dtrCorrection ? (
              <div className="mt-2 text-xs text-gray-700">
                {logs.dtr.remarks}
                {logs.dtrCorrection ? (
                  <span className="block capitalize">Time Log Correction {logs.dtrCorrection.status}</span>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
