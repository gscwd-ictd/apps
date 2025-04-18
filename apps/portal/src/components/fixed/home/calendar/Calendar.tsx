import { Menu, Transition } from '@headlessui/react';
import {
  Holidays,
  useCalendarStore,
} from 'apps/portal/src/store/calendar.store';
import { fetchWithToken } from 'apps/portal/src/utils/hoc/fetcher';
import useSWR from 'swr';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns';
import { Fragment, useEffect, useState } from 'react';
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineXCircle,
} from 'react-icons/hi';
import { isEmpty } from 'lodash';
import { ToastNotification } from '@gscwd-apps/oneui';

// const meetings = [
//   {
//     id: 1,
//     name: 'GSCWD 36th Anniversary',
//     imageUrl: '/gwdlogo.png',
//     startDatetime: '2023-08-21T15:00',
//     endDatetime: '2023-08-21T22:00',
//   },
// ];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function EmployeeCalendar() {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [viewActivities, setViewActivities] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const { holidays, getHolidays, getHolidaysSuccess, getHolidaysFail } =
    useCalendarStore((state) => ({
      holidays: state.dates.holidays,
      getHolidays: state.getHolidays,
      getHolidaysSuccess: state.getHolidaysSuccess,
      getHolidaysFail: state.getHolidaysFail,
    }));

  const holidaysUrl = `${process.env.NEXT_PUBLIC_EMPLOYEE_MONITORING_URL}/v1/holidays`;

  const {
    data: swrHolidays,
    isLoading: swrHolidaysIsLoading,
    error: swrHolidaysError,
    mutate: mutateHolidaysUrl,
  } = useSWR(holidaysUrl, fetchWithToken, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  const selectedDayMeetings = swrHolidays?.filter((meeting: Holidays) =>
    isSameDay(Date.parse(meeting.holidayDate), selectedDay)
  );

  // Initial zustand state update
  useEffect(() => {
    if (swrHolidaysIsLoading) {
      getHolidays(swrHolidaysIsLoading);
    }
  }, [swrHolidaysIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrHolidays)) {
      getHolidaysSuccess(swrHolidaysIsLoading, swrHolidays);
    }

    if (!isEmpty(swrHolidaysError)) {
      getHolidaysFail(swrHolidaysIsLoading, swrHolidaysError.message);
    }
  }, [swrHolidays, swrHolidaysError]);

  function viewDateActivities(day: Date) {
    setSelectedDay(day);
    setViewActivities(true);
  }

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
    <div className="relative">
      {!isEmpty(swrHolidaysError) ? (
        <ToastNotification
          toastType="error"
          notifMessage={`Calendar: ${swrHolidaysError.message}.`}
        />
      ) : null}

      <div
        className={`${
          viewActivities
            ? 'top-0 p-10 absolute z-10 bg-slate-100 rounded-md flex justify-center items-start w-full h-full'
            : 'hidden'
        } `}
      >
        <span
          onClick={() => setViewActivities(false)}
          className="absolute top-0 right-0 p-4 cursor-pointer"
        >
          <HiOutlineXCircle className="w-6 h-6 text-slate-600" />
        </span>
        <section>
          <h2 className="font-semibold text-gray-900">
            Schedule for{' '}
            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
              {format(selectedDay, 'MMM dd, yyy')}
            </time>
          </h2>
          <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
            {selectedDayMeetings && selectedDayMeetings.length > 0 ? (
              selectedDayMeetings.map((meeting) => (
                <Meeting meeting={meeting} key={meeting.id} />
              ))
            ) : (
              <p>No events today.</p>
            )}
          </ol>
        </section>
      </div>
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6 ">
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
              <h2 className="flex-auto font-semibold text-center text-gray-900">
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
            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
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
                      isEqual(day, selectedDay) && 'text-white',
                      !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        'text-blue-500',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        '',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-400',
                      isEqual(day, selectedDay) &&
                        isToday(day) &&
                        'bg-blue-500',
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        'bg-gray-900',
                      !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        'font-semibold',
                      swrHolidays &&
                        swrHolidays.some((meeting) =>
                          isSameDay(Date.parse(meeting.holidayDate), day)
                        ) &&
                        'bg-red-500 font-semibold text-white',
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'd')}
                    </time>
                  </button>

                  <div className="w-1 h-1 mx-auto mt-1">
                    {swrHolidays &&
                      swrHolidays.some((meeting) =>
                        isSameDay(Date.parse(meeting.holidayDate), day)
                      ) && (
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meeting({ meeting }: any) {
  // const startDateTime = parseISO(meeting.startDatetime);
  // const endDateTime = parseISO(meeting.endDatetime);

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <img
        src={'/gwdlogo.png'}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-auto">
        <p className="text-gray-900">{meeting.name}</p>
        {/* <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>
            {format(startDateTime, 'h:mm a')}
          </time>{' '}
          -{' '}
          <time dateTime={meeting.endDatetime}>
            {format(endDateTime, 'h:mm a')}
          </time>
        </p> */}
      </div>
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          {/* <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <HiOutlineDotsVertical className="w-6 h-6" aria-hidden="true" />
          </Menu.Button> */}
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {/* <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a href="#" className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a href="#" className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items> */}
        </Transition>
      </Menu>
    </li>
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
