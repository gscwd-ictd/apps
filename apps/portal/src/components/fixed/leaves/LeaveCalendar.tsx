/* eslint-disable @nx/enforce-module-boundaries */
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
import { useEffect, useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { useEmployeeStore } from '../../../store/employee.store';
import { fetchWithToken } from '../../../utils/hoc/fetcher';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import { LeaveName } from 'libs/utils/src/lib/enums/leave.enum';
import axios from 'axios';
import { DateFormatter } from 'libs/utils/src/lib/functions/DateFormatter';
import { LoadingSpinner, ToastNotification } from '@gscwd-apps/oneui';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type CalendarProps = {
  clickableDate: boolean;
  type: string; // single or range
  leaveName: string;
  isLateFiling?: boolean;
};

export default function Calendar({
  type = 'single',
  clickableDate = true,
  leaveName,
  isLateFiling = false,
}: CalendarProps) {
  const [isSearchingForLastDay, setIsSearchingForLastDay] = useState<boolean>(false);
  const tempToday = startOfToday(); //date now based on machine time
  const [today, setToday] = useState(startOfToday()); //will be replaced by server time once fetch is complete
  const [selectedDay, setSelectedDay] = useState(tempToday);
  const [currentMonth, setCurrentMonth] = useState(format(tempToday, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [lastDateOfDuty, setLastDateOfDuty] = useState();
  const [errorAllowableSpl, setErrorAllowableSpl] = useState<string>(null);
  const [futureLeaveCount, setFutureLeaveCount] = useState<number>(0);
  // set state for employee store
  const employeeDetails = useEmployeeStore((state) => state.employeeDetails);

  //zustand initialization to access Leave store
  const {
    leaveDateFrom,
    leaveDateTo,
    overlappingLeaveCount,
    applyLeaveModalIsOpen,
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
    applyLeaveModalIsOpen: state.applyLeaveModalIsOpen,
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
    shouldRetryOnError: true,
    revalidateOnFocus: true,
    refreshInterval: 3000,
  });
  const [holidayCount, setHolidayCount] = useState<number>(0);

  // Initial zustand state update
  useEffect(() => {
    setSelectedDates([]);
  }, [leaveName]);

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

      //get count of future pending/approved leaves from today
      const futureLeaves = swrUnavailableDates?.unavailableDates?.filter(
        (unavailableDate) =>
          unavailableDate.type === 'Leave' &&
          unavailableDate.date >= dayjs(swrUnavailableDates?.dateTimeNow).format('YYYY-MM-DD')
      ).length;
      setFutureLeaveCount(futureLeaves);
      setToday(swrUnavailableDates?.dateTimeNow);
      setCurrentMonth(dayjs(swrUnavailableDates?.dateTimeNow).format('MMM-YYYY'));
    }

    if (!isEmpty(swrError)) {
      getUnavailableFail(swrIsLoading, swrError.message);
    }
  }, [swrUnavailableDates, swrError]);

  useEffect(() => {
    if (
      leaveName === LeaveName.SICK ||
      leaveName === LeaveName.SPECIAL_PRIVILEGE ||
      leaveName === LeaveName.SOLO_PARENT
    ) {
      //remove past dates up to last date of duty
      setSelectedDates(selectedDates.filter((dates) => dayjs(`${dates}`).diff(`${lastDateOfDuty}`, 'day') > 0));
    } else {
      //remove past dates up to today
      setSelectedDates(selectedDates.filter((dates) => dayjs(`${dates}`).diff(`${today}`, 'day') >= 0));
    }
  }, [isLateFiling]);

  //reseting of selected dates if a condition is removed (unchecking late filing, unselecting leave dates between today and 10th day)
  useEffect(() => {
    //check if there are selected dates between today up to the 10th day and has no future pending/approved leaves
    if (
      selectedDates.filter(
        (dates) => dayjs(`${dates}`).diff(`${today}`, 'day') >= 0 && dayjs(`${dates}`).diff(`${today}`, 'day') <= 10
      ).length <= 0 &&
      selectedDates.length > 0 &&
      (leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
        leaveName === LeaveName.VACATION ||
        leaveName === LeaveName.FORCED ||
        leaveName === LeaveName.SOLO_PARENT ||
        leaveName === LeaveName.SPECIAL_PRIVILEGE ||
        leaveName === LeaveName.SICK) &&
      futureLeaveCount <= 0
    ) {
      //check if there are only past dates selected for VL, FL - legit late filing
      if (
        (leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
          leaveName === LeaveName.VACATION ||
          leaveName === LeaveName.FORCED) &&
        isLateFiling &&
        selectedDates.filter((dates) => dayjs(`${dates}`).diff(`${today}`, 'day') < 0).length > 0 &&
        selectedDates.filter((dates) => dayjs(`${dates}`).diff(`${today}`, 'day') > 10).length <= 0
      ) {
        //do nothing - will not clear the selected dates array
      }
      //check if there are only past dates selected for SPL/SICK/SOLO PARENT - legit late filing
      else if (
        (leaveName === LeaveName.SICK ||
          leaveName === LeaveName.SPECIAL_PRIVILEGE ||
          leaveName === LeaveName.SOLO_PARENT) &&
        isLateFiling &&
        selectedDates.filter((dates) => dayjs(`${dates}`).diff(`${lastDateOfDuty}`, 'day') < 0).length > 0 &&
        selectedDates.filter((dates) => dayjs(`${dates}`).diff(`${lastDateOfDuty}`, 'day') > 10).length <= 0
      ) {
        //do nothing - will not clear the selected dates array
      }
      //check if there are future dates selected for VL, FL, SOLO PARENT, SPL, SICK
      else if (
        (leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
          leaveName === LeaveName.VACATION ||
          leaveName === LeaveName.FORCED ||
          leaveName === LeaveName.SOLO_PARENT ||
          leaveName === LeaveName.SICK ||
          leaveName === LeaveName.SPECIAL_PRIVILEGE) &&
        selectedDates.filter((dates) => dayjs(`${dates}`).diff(`${today}`, 'day') > 10).length > 0
      ) {
        setSelectedDates(selectedDates.filter((dates) => dayjs(`${dates}`).diff(`${today}`, 'day') <= 10));
      }
    }
  }, [selectedDates]);

  function viewDateActivities(day: Date) {
    if (clickableDate) {
      setSelectedDay(day);
      const specifiedDate = format(day, 'yyyy-MM-dd');

      if (DateFormatter(day, 'YYYY-MM-DD') === '2025-01-27') {
        //do nothing
        //will not add date to array
        //Muslim holiday
        //8hr work suspension only / not considered as holiday in the office
      }
      //check if selected date exist in array - returns true/false
      else if (selectedDates.includes(specifiedDate)) {
        //removes date
        setSelectedDates(
          selectedDates.filter(function (e) {
            return e !== specifiedDate;
          })
        );
      } else {
        //adds date to array
        //if selected date is not found in unavailable dates array
        if (!swrUnavailableDates?.unavailableDates?.some((item) => item.date === specifiedDate)) {
          //for all leaves with credits with future dates from today and has future approved/pending leaves - allow future dates till infinity
          if (
            (leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
              leaveName === LeaveName.VACATION ||
              leaveName === LeaveName.FORCED ||
              leaveName === LeaveName.SOLO_PARENT ||
              leaveName === LeaveName.SPECIAL_PRIVILEGE ||
              leaveName === LeaveName.SICK) &&
            dayjs(`${specifiedDate}`).diff(`${today}`, 'day') > 10 &&
            // !isLateFiling &&
            (futureLeaveCount > 0 ||
              selectedDates.filter(
                (dates) =>
                  dayjs(`${dates}`).diff(`${today}`, 'day') >= 0 && dayjs(`${dates}`).diff(`${today}`, 'day') <= 10
              ).length > 0)
          ) {
            setSelectedDates((selectedDates) => [...selectedDates, specifiedDate]);
          }

          //for VL within 10 days from today and not late filing
          else if (
            leaveName === LeaveName.VACATION &&
            dayjs(`${specifiedDate}`).diff(`${today}`, 'day') >= 0 &&
            dayjs(`${specifiedDate}`).diff(`${today}`, 'day') <= 10 &&
            !isLateFiling
          ) {
            setSelectedDates((selectedDates) => [...selectedDates, specifiedDate]);
          }
          //for FL/SOLO PARENT within 10 days from today and not late filing
          else if (
            (leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
              leaveName === LeaveName.FORCED ||
              leaveName === LeaveName.SOLO_PARENT) &&
            dayjs(`${specifiedDate}`).diff(`${today}`, 'day') >= 0 &&
            dayjs(`${specifiedDate}`).diff(`${today}`, 'day') <= 10 &&
            !isLateFiling
          ) {
            setSelectedDates((selectedDates) => [...selectedDates, specifiedDate]);
          }
          //for SPL/SICK/SOLO PARENT, between last duty date and today and not late filing
          else if (
            (leaveName === LeaveName.SPECIAL_PRIVILEGE ||
              leaveName === LeaveName.SICK ||
              leaveName === LeaveName.SOLO_PARENT) &&
            DateFormatter(specifiedDate, 'YYYY-MM-DD') > DateFormatter(lastDateOfDuty, 'YYYY-MM-DD') &&
            dayjs(`${specifiedDate}`).diff(`${today}`, 'day') <= 10 &&
            !isLateFiling
          ) {
            setSelectedDates((selectedDates) => [...selectedDates, specifiedDate]);
          }
          // SPL/SICK and late filing
          else if (
            (leaveName === LeaveName.SPECIAL_PRIVILEGE || leaveName === LeaveName.SICK) &&
            dayjs(`${specifiedDate}`).diff(`${today}`, 'day') <= 10 &&
            isLateFiling
          ) {
            setSelectedDates((selectedDates) => [...selectedDates, specifiedDate]);
          }
          //for VL, FL, Solo Parent, SPL, within 10 days from today and the past days and is late filing
          else if (
            (leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
              leaveName === LeaveName.VACATION ||
              leaveName === LeaveName.FORCED ||
              leaveName === LeaveName.SOLO_PARENT) &&
            dayjs(`${specifiedDate}`).diff(`${today}`, 'day') <= 10 &&
            isLateFiling
          ) {
            setSelectedDates((selectedDates) => [...selectedDates, specifiedDate]);
          }

          //for sick leave and today is Monday
          // else if (
          //   leaveName === LeaveName.SICK &&
          //   // today.getDay() == 1 &&
          //   // dayjs(`${today}`).diff(`${specifiedDate}`, 'day') <= 3 &&
          //   dayjs(`${specifiedDate}`).diff(`${today}`, 'day') <= 10
          // ) {
          //   setSelectedDates((selectedDates) => [...selectedDates, specifiedDate]);
          // }

          //for sick leave and today is Tuesday - Fri
          // else if (
          //   leaveName === LeaveName.SICK &&
          //   today.getDay() >= 2 &&
          //   today.getDay() <= 5 &&
          //   dayjs(`${today}`).diff(`${specifiedDate}`, 'day') <= 1 &&
          //   dayjs(`${specifiedDate}`).diff(`${today}`, 'day') <= 10
          // ) {
          //   setSelectedDates((selectedDates) => [...selectedDates, specifiedDate]);
          // }
          else if (
            leaveName === LeaveName.PATERNITY ||
            leaveName === LeaveName.VAWC ||
            leaveName === LeaveName.SPECIAL_EMERGENCY_CALAMITY
          ) {
            setSelectedDates((selectedDates) => [...selectedDates, specifiedDate]);
          }
        }
      }
    }
  }

  function getHolidayCount() {
    const holiday = swrUnavailableDates?.unavailableDates?.filter(
      (unavailableDate) =>
        unavailableDate.type === 'Holiday' &&
        unavailableDate.date >= leaveDateFrom &&
        unavailableDate.date <= leaveDateTo
    ).length;
    setHolidayCount(holiday);
  }

  function getOverlappingLeaveCount() {
    const leave = swrUnavailableDates?.unavailableDates?.filter(
      (unavailableDate) =>
        unavailableDate.type === 'Leave' && unavailableDate.date >= leaveDateFrom && unavailableDate.date <= leaveDateTo
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

  //search for last date of duty from today
  async function isLastDutyDate(date: Date) {
    let isDateFound = false;
    let dateToSearch = dayjs(date).subtract(1, 'day');
    while (!isDateFound && applyLeaveModalIsOpen) {
      setIsSearchingForLastDay(true);
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/daily-time-record/employees/${
            employeeDetails.employmentDetails.companyId
          }/${dayjs(dateToSearch).format('YYYY-MM-DD')}`
        );
        if (!isEmpty(data)) {
          if (!isEmpty(data.data.dtr.timeIn) || !isEmpty(data.data.dtr.timeOut)) {
            isDateFound = true;
            setLastDateOfDuty(data.data.date);
            setIsSearchingForLastDay(false);
          } else {
            isDateFound = false;
            dateToSearch = dayjs(dateToSearch).subtract(1, 'day');
            setIsSearchingForLastDay(false);
          }
        } else {
          setErrorAllowableSpl('Error');
          isDateFound = true;
          setIsSearchingForLastDay(false);
        }
      } catch (error: any) {
        setErrorAllowableSpl(error);
        isDateFound = true;
        setIsSearchingForLastDay(false);
      }
    }
  }

  //search for last date of duty from today
  useEffect(() => {
    setErrorAllowableSpl(null);
    if (
      (leaveName === LeaveName.SPECIAL_PRIVILEGE ||
        leaveName === LeaveName.SICK ||
        leaveName === LeaveName.SOLO_PARENT) &&
      applyLeaveModalIsOpen &&
      swrUnavailableDates
    ) {
      isLastDutyDate(swrUnavailableDates?.dateTimeNow);
    }
  }, [leaveName, applyLeaveModalIsOpen, swrUnavailableDates]);

  return (
    <>
      {!isEmpty(errorAllowableSpl) ? (
        <ToastNotification toastType="error" notifMessage={`${errorAllowableSpl}: Failed to get last date of duty.`} />
      ) : null}

      {type === 'range' ? (
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <div className="w-full flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between gap-2 items-center">
            <div className="flex gap-2 w-full items-center">
              {/* <label className="text-slate-500 text-md border-slate-300 w-14 md:w-auto">From</label> */}
              <input
                required
                type="date"
                value={leaveDateFrom ? leaveDateFrom : ''}
                className="text-slate-500 text-md border-slate-300 rounded w-full"
                onChange={(e) => setLeaveDateFrom(e.target.value as unknown as string)}
              />
            </div>
            <label className="text-slate-500 text-md text-center border-slate-300 w-full">To</label>
            <div className="flex gap-2 w-full items-center">
              <input
                required
                type="date"
                value={leaveDateTo ? leaveDateTo : ''}
                className="text-slate-500 text-md border-slate-300 rounded w-full"
                onChange={(e) => setLeaveDateTo(e.target.value as unknown as string)}
              />
            </div>
          </div>

          <label className="text-center text-slate-500 text-sm border-slate-300 w-full">
            = {leaveDateFrom && leaveDateTo ? dayjs(`${leaveDateTo}`).diff(`${leaveDateFrom}`, 'day') + 1 : 0} Calendar
            Day(s)
            {/* - {holidayCount} Holiday(s)  */}
            {/* removed on 9/3/2024 as per maam Tin request */} - {overlappingLeaveCount} Overlapping Leave(s) ={' '}
            <label className="font-bold">
              {leaveDateFrom && leaveDateTo
                ? dayjs(`${leaveDateTo}`).diff(`${leaveDateFrom}`, 'day') +
                  1 -
                  // - holidayCount
                  // removed on 9/3/2024 as per maam Tin request
                  overlappingLeaveCount
                : 0}{' '}
              Leave Day(s)
            </label>
          </label>
        </div>
      ) : (
        <div className="relative">
          {isSearchingForLastDay || !swrUnavailableDates ? (
            <div className="flex-col justify-center items-center w-full">
              <LoadingSpinner size={'lg'} />
              <div className="pt-3 text-center text-xs font-medium text-slate-500 w-full">
                Searching for last date you rendered work...
              </div>
            </div>
          ) : (
            <div className="">
              <div className="flex justify-center items-center text-red-600 mb-3">
                {`Server Date: ${dayjs(today).format('MM-DD-YYYY')}`}
              </div>
              <div className="md:grid md:grid-cols-1 md:divide-x md:divide-gray-200 ">
                <div className="w-full">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={previousMonth}
                      className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Previous month</span>
                      <HiOutlineChevronLeft className="w-5 h-5" aria-hidden="true" />
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
                      <HiOutlineChevronRight className="w-5 h-5" aria-hidden="true" />
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
                        className={classNames(dayIdx === 0 && colStartClasses[getDay(day)], 'py-1.5')}
                      >
                        <button
                          type="button"
                          onClick={() => viewDateActivities(day)}
                          className={classNames(
                            isEqual(day, selectedDay) && 'text-gray-900 font-semibold',

                            //disable date selection for January 27, 2025 - 8hr work suspension/not a holiday
                            DateFormatter(day, 'YYYY-MM-DD') === '2025-01-27' && 'text-red-600 bg-red-300 rounded-full',

                            //disable date selection for past dates from current day for VL/FL
                            (leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
                              leaveName === LeaveName.VACATION ||
                              leaveName === LeaveName.FORCED) &&
                              dayjs(`${day}`).diff(`${today}`, 'day') < 0 &&
                              isLateFiling === false &&
                              'text-slate-300',
                            //disable date selection starting from 10th day from current day for Vl/FL/SOLO/SPL if late filing
                            // (leaveName === LeaveName.VACATION ||
                            //   leaveName === LeaveName.FORCED ||
                            //   leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                            //   leaveName === LeaveName.SICK ||
                            //   leaveName === LeaveName.SOLO_PARENT) &&
                            //   dayjs(`${day}`).diff(`${today}`, 'day') > 10 &&
                            //   isLateFiling === true &&
                            //   'text-slate-300',
                            //disable date selection starting from 10th day from current day for FL/SOLO/SPL - added allow all dates if a date with the 10 days is selected
                            (leaveName === LeaveName.LEAVE_WITHOUT_PAY ||
                              leaveName === LeaveName.FORCED ||
                              leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                              leaveName === LeaveName.SICK ||
                              leaveName === LeaveName.SOLO_PARENT) &&
                              dayjs(`${day}`).diff(`${today}`, 'day') > 10 &&
                              futureLeaveCount <= 0 &&
                              selectedDates.filter(
                                (dates) =>
                                  dayjs(`${dates}`).diff(`${today}`, 'day') >= 0 &&
                                  dayjs(`${dates}`).diff(`${today}`, 'day') <= 10
                              ).length <= 0 &&
                              'text-slate-300',
                            //disable date selection starting from 10th day from current day for VL ONLY - added allow all dates if a date with the 10 days is selected
                            leaveName === LeaveName.VACATION &&
                              dayjs(`${day}`).diff(`${today}`, 'day') > 10 &&
                              futureLeaveCount <= 0 &&
                              selectedDates.filter(
                                (dates) =>
                                  dayjs(`${dates}`).diff(`${today}`, 'day') >= 0 &&
                                  dayjs(`${dates}`).diff(`${today}`, 'day') <= 10
                              ).length <= 0 &&
                              'text-slate-300',

                            //disable date selection for past dates from last day of duty for SPL/SICK ONLY
                            (leaveName === LeaveName.SPECIAL_PRIVILEGE ||
                              leaveName === LeaveName.SICK ||
                              leaveName === LeaveName.SOLO_PARENT) &&
                              DateFormatter(day, 'YYYY-MM-DD') <= DateFormatter(lastDateOfDuty, 'YYYY-MM-DD') &&
                              isLateFiling === false &&
                              'text-slate-300',
                            //disable date selection from 3rd day beyond in the past if previous day is SUN from current day for SL
                            // leaveName === LeaveName.SICK &&
                            //   dayjs(`${today}`).diff(`${day}`, 'day') > 3 &&
                            //   today.getDay() == 1 &&
                            //   'text-slate-300',
                            // leaveName === LeaveName.SICK &&
                            //   today.getDay() >= 2 &&
                            //   today.getDay() <= 5 &&
                            //   dayjs(`${today}`).diff(`${day}`, 'day') <= 1 &&
                            //   dayjs(`${day}`).diff(`${today}`, 'day') <= 10 &&
                            //   'text-slate-300',
                            //disable date selection for more than 10 days from current day for SL - added allow all dates if a date with the 10 days is selected
                            leaveName === LeaveName.SICK &&
                              dayjs(`${day}`).diff(`${today}`, 'day') > 10 &&
                              futureLeaveCount <= 0 &&
                              selectedDates.filter(
                                (dates) =>
                                  dayjs(`${dates}`).diff(`${today}`, 'day') >= 0 &&
                                  dayjs(`${dates}`).diff(`${today}`, 'day') <= 10
                              ).length <= 0 &&
                              'text-slate-300',
                            swrUnavailableDates?.dateTimeNow === format(day, 'yyyy-MM-dd') && 'text-red-500',
                            swrUnavailableDates?.unavailableDates &&
                              swrUnavailableDates?.unavailableDates?.some(
                                (item) => item.date === format(day, 'yyyy-MM-dd') && item.type === 'Holiday'
                              ) &&
                              'text-red-600 bg-red-300 rounded-full',
                            swrUnavailableDates?.unavailableDates &&
                              swrUnavailableDates?.unavailableDates?.some(
                                (item) => item.date === format(day, 'yyyy-MM-dd') && item.type === 'Leave'
                              ) &&
                              swrUnavailableDates?.unavailableDates &&
                              !swrUnavailableDates?.unavailableDates?.some(
                                (item) => item.date === format(day, 'yyyy-MM-dd') && item.type === 'Holiday'
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
                            (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                            'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                            selectedDates.includes(format(day, 'yyyy-MM-dd'))
                              ? 'bg-indigo-200 rounded-full text-gray-900'
                              : ''
                          )}
                        >
                          <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const colStartClasses = ['', 'col-start-2', 'col-start-3', 'col-start-4', 'col-start-5', 'col-start-6', 'col-start-7'];
