import { Menu, Transition } from '@headlessui/react';
import { useLeaveStore } from '../../../../src/store/leave.store';

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
  parseISO,
  startOfToday,
} from 'date-fns';
import { Fragment, useEffect, useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

type CalendarProps = {
  clickableDate: boolean;
};

export default function Calendar({ clickableDate = true }: CalendarProps) {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  // const [viewActivities, setViewActivities] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  //zustand initialization to access Leave store
  const { leaveDates, currentLeaveDates, setLeaveDates } = useLeaveStore(
    (state) => ({
      leaveDates: state.leaveDates,
      currentLeaveDates: state.currentLeaveDates,
      setLeaveDates: state.setLeaveDates,
    })
  );

  function viewDateActivities(day: Date) {
    if (clickableDate) {
      setSelectedDay(day);
      // setViewActivities(true);
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

        if (!currentLeaveDates.some((item) => item.date === specifiedDate)) {
          setSelectedDates((selectedDates) => [
            ...selectedDates,
            specifiedDate,
          ]);
        }
      }
    }
  }

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

  // let selectedDayMeetings = meetings.filter((meeting) => isSameDay(parseISO(meeting.startDatetime), selectedDay));

  return (
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

                      currentLeaveDates.some(
                        (item) =>
                          item.date === format(day, 'yyyy-MM-dd') &&
                          item.type === 'holiday'
                      ) && 'text-red-600 bg-red-200 rounded-full',

                      currentLeaveDates.some(
                        (item) =>
                          item.date === format(day, 'yyyy-MM-dd') &&
                          item.type === 'leave'
                      ) && 'text-green-600 bg-green-200 rounded-full',
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
  );
}

function Meeting({ meeting }: any) {
  const startDateTime = parseISO(meeting.startDatetime);
  const endDateTime = parseISO(meeting.endDatetime);

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={meeting.imageUrl}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-auto">
        <p className="text-gray-900">{meeting.name}</p>
        <p className="mt-0.5">
          <time dateTime={meeting.startDatetime}>
            {format(startDateTime, 'h:mm a')}
          </time>{' '}
          -{' '}
          <time dateTime={meeting.endDatetime}>
            {format(endDateTime, 'h:mm a')}
          </time>
        </p>
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
