import { add, eachDayOfInterval, endOfMonth, format, getDay, parse, startOfToday } from 'date-fns';
import React, { Fragment, useState, useCallback } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

function classNames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

type DailyTimeRecordCalendarProps = {
  onDateSelect?: (dates: string[]) => void;
  id: string;
  controller?: object;
  isError?: boolean;
  errorMessage?: string;
  dtrDates?: string[];
};

export default function DailyTimeRecordCalendar({
  onDateSelect: onDateSelectProp,
  id,
  controller,
  isError = false,
  errorMessage,
}: DailyTimeRecordCalendarProps) {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const [dtrDates, setDtrDates] = useState<string[]>([]);

  const handleDateSelect = useCallback(
    (date: string) => {
      setDtrDates((prevDates) => {
        const newDates = prevDates.includes(date) ? prevDates.filter((d) => d !== date) : [...prevDates, date];
        if (onDateSelectProp) {
          onDateSelectProp(newDates);
        }
        return newDates;
      });
    },
    [onDateSelectProp]
  );

  const currentDate = format(new Date(), 'yyyy-MM-dd');

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
    <Fragment>
      {isError && <div className="error-message">{errorMessage}</div>}
      <div className={`relative`}>
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
              <div className={`grid grid-cols-7 mt-3 text-xs leading-6 text-center text-gray-500`}>
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
                      className={classNames(
                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                        dtrDates.includes(format(day, 'yyyy-MM-dd')) && 'bg-green-500 text-white',
                        currentDate === format(day, 'yyyy-MM-dd') && 'bg-blue-500 text-white'
                      )}
                      {...controller}
                      id={id}
                      onClick={() => handleDateSelect(format(day, 'yyyy-MM-dd'))}
                    >
                      <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isError ? <div className="mt-1 text-xs text-red-400">{errorMessage}</div> : null}
    </Fragment>
  );
}

const colStartClasses = ['', 'col-start-2', 'col-start-3', 'col-start-4', 'col-start-5', 'col-start-6', 'col-start-7'];
