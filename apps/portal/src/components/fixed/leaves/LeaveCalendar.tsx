import { useLeaveStore } from '../../../store/leave.store';
import useSWR from 'swr';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from 'date-fns';
import { Fragment, useEffect, useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { useEmployeeStore } from '../../../store/employee.store';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type CalendarProps = {
  clickableDate: boolean;
  type: string; // single or range
};

export default function Calendar({
  type = 'single',
  clickableDate = true,
}: CalendarProps) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  //zustand initialization to access Leave store
  const {
    leaveDateFrom,
    leaveDateTo,

    overlappingLeaveCount,

    setLeaveDateFrom,
    setLeaveDateTo,
    setLeaveDates,
    getUnavailableDates,
    getUnavailableSuccess,
    getUnavailableFail,
    setOverlappingLeaveCount,
  } = useLeaveStore((state) => ({
    leaveDateFrom: state.leaveDateFrom,
    leaveDateTo: state.leaveDateTo,

    overlappingLeaveCount: state.overlappingLeaveCount,

    setLeaveDateFrom: state.setLeaveDateFrom,
    setLeaveDateTo: state.setLeaveDateTo,
    setLeaveDates: state.setLeaveDates,
    getUnavailableDates: state.getUnavailableDates,
    getUnavailableSuccess: state.getUnavailableSuccess,
    getUnavailableFail: state.getUnavailableFail,
    setOverlappingLeaveCount: state.setOverlappingLeaveCount,
  }));

  //fetch unavailable dates (current leaves/holidays)
  const unavailableDatesUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/leave-application/unavailable-dates/${employeeDetails.employmentDetails.userId}`;
  const {
    data: swrUnavailableDates,
    isLoading: swrIsLoading,
    error: swrError,
  } = useSWR(unavailableDatesUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
  const [holidayCount, setHolidayCount] = useState<number>(0);

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      getUnavailableDates(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrUnavailableDates)) {
      getUnavailableSuccess(swrIsLoading, swrUnavailableDates);
    }

    if (!isEmpty(swrError)) {
      getUnavailableFail(swrIsLoading, swrError.message);
    }
  }, [swrUnavailableDates, swrError]);

  function viewDateActivities(day: Date) {
    if (clickableDate) {
      setSelectedDay(day);
      const specifiedDate = format(day, 'yyyy-MM-dd');
      //check if selected date exist in array - returns true/false
      if (selectedDates.includes(specifiedDate)) {
        //removes date
        setSelectedDates(
          selectedDates.filter(function (e) {
            return e !== specifiedDate;
          })
        );
      } else {
        //adds date to arry

        if (!swrUnavailableDates.some((item) => item.date === specifiedDate)) {
          setSelectedDates((selectedDates) => [
            ...selectedDates,
            specifiedDate,
          ]);
        }
      }
    }
  }

  function getHolidayCount() {
    const holiday = swrUnavailableDates?.filter(
      (unavailableDate) =>
        unavailableDate.type === 'Holiday' &&
        unavailableDate.date >= leaveDateFrom &&
        unavailableDate.date <= leaveDateTo
    ).length;
    setHolidayCount(holiday);
  }

  function getOverlappingLeaveCount() {
    const leave = swrUnavailableDates?.filter(
      (unavailableDate) =>
        unavailableDate.type === 'Leave' &&
        unavailableDate.date >= leaveDateFrom &&
        unavailableDate.date <= leaveDateTo
    ).length;
    setOverlappingLeaveCount(leave);
  }

  useEffect(() => {
    setLeaveDateFrom(leaveDateFrom);
    getHolidayCount();
    getOverlappingLeaveCount();
  }, [leaveDateFrom]);

  useEffect(() => {
    setLeaveDateTo(leaveDateTo);
    getHolidayCount();
    getOverlappingLeaveCount();
  }, [leaveDateTo]);

  useEffect(() => {
    setLeaveDates(selectedDates);
  }, [selectedDates]);

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  return (
    <>
      {type === 'range' ? (
        <div className="flex flex-row gap-2 items-center">
          <label className="text-slate-500 text-lg border-slate-300">
            From
          </label>
          <input
            required
            type="date"
            className="text-slate-500 text-lg border-slate-300"
            onChange={(e) =>
              setLeaveDateFrom(e.target.value as unknown as string)
            }
          />
          <label className="text-slate-500 text-lg border-slate-300">To</label>
          <input
            required
            type="date"
            className="text-slate-500 text-lg border-slate-300"
            onChange={(e) =>
              setLeaveDateTo(e.target.value as unknown as string)
            }
          />
          <label className="text-slate-500 text-md border-slate-300">
            ={' '}
            {leaveDateFrom && leaveDateTo
              ? dayjs(`${leaveDateTo}`).diff(`${leaveDateFrom}`, 'day') + 1
              : 0}{' '}
            Calendar Day(s) - {holidayCount} Holiday(s) -{' '}
            {overlappingLeaveCount} Overlapping Leave(s) ={' '}
            {leaveDateFrom && leaveDateTo
              ? dayjs(`${leaveDateTo}`).diff(`${leaveDateFrom}`, 'day') +
                1 -
                holidayCount -
                overlappingLeaveCount
              : 0}{' '}
            Leave Day(s)
          </label>
        </div>
      ) : (
        <div className="relative">
          <div className="">
            <div className="md:grid md:grid-cols-1 md:divide-x md:divide-gray-200 ">
              <div className="w-full">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={previousMonth}
                    className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Previous month</span>
                    <HiOutlineChevronLeft
                      className="w-5 h-5"
                      aria-hidden="true"
                    />
                  </button>
                  <h2 className="flex-auto font-semibold text-gray-900 text-center">
                    {format(firstDayCurrentMonth, 'MMMM yyyy')}
                  </h2>

                  <button
                    onClick={nextMonth}
                    type="button"
                    className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Next month</span>
                    <HiOutlineChevronRight
                      className="w-5 h-5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="grid grid-cols-7 mt-3 text-xs leading-6 text-center text-gray-500">
                  <div className="text-red-600">SUN</div>
                  <div>MON</div>
                  <div>TUE</div>
                  <div>WED</div>
                  <div>THU</div>
                  <div>FRI</div>
                  <div>SAT</div>
                </div>
                <div className="grid grid-cols-7 mt-2 text-sm">
                  {days.map((day, dayIdx) => (
                    <div
                      key={day.toString()}
                      className={classNames(
                        dayIdx === 0 && colStartClasses[getDay(day)],
                        'py-1.5'
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => viewDateActivities(day)}
                        className={classNames(
                          isEqual(day, selectedDay) &&
                            'text-gray-900 font-semibold',
                          !isEqual(day, selectedDay) &&
                            isToday(day) &&
                            'text-red-500',
                          swrUnavailableDates &&
                            swrUnavailableDates.some(
                              (item) =>
                                item.date === format(day, 'yyyy-MM-dd') &&
                                item.type === 'Holiday'
                            ) &&
                            'text-red-600 bg-red-200 rounded-full',
                          swrUnavailableDates &&
                            swrUnavailableDates.some(
                              (item) =>
                                item.date === format(day, 'yyyy-MM-dd') &&
                                item.type === 'Leave'
                            ) &&
                            'text-green-600 bg-green-200 rounded-full',
                          !isEqual(day, selectedDay) &&
                            !isToday(day) &&
                            isSameMonth(day, firstDayCurrentMonth) &&
                            'text-gray-900 font-semibold',
                          !isEqual(day, selectedDay) &&
                            !isToday(day) &&
                            !isSameMonth(day, firstDayCurrentMonth) &&
                            'text-gray-900 font-semibold',
                          isEqual(day, selectedDay) && isToday(day) && '',
                          isEqual(day, selectedDay) && !isToday(day) && '',
                          !isEqual(day, selectedDay) && 'hover:bg-blue-200',
                          (isEqual(day, selectedDay) || isToday(day)) &&
                            'font-semibold',
                          'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                          selectedDates.includes(format(day, 'yyyy-MM-dd'))
                            ? 'bg-indigo-200 rounded-full text-gray-900'
                            : ''
                        )}
                      >
                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                          {format(day, 'd')}
                        </time>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];