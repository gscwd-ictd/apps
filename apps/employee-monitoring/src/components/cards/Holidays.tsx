/* eslint-disable react-hooks/exhaustive-deps */
import { Card } from './Card';
import useSWR from 'swr';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import { useEffect } from 'react';
import { useHolidaysStore } from '../../store/holidays.store';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Holiday } from '../../utils/types/holiday.type';

export const Holidays = (): JSX.Element => {
  // fetch data for list of holidays
  const {
    data: swrHolidays,
    error: swrError,
    isLoading: swrIsLoading,
  } = useSWR('/holidays', fetcherEMS, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Only retry up to 10 times.
      if (retryCount >= 5) return;

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 15000);
    },
  });

  // holiday store
  const { holidays, getHolidays, getHolidaysFail, getHolidaysSuccess } = useHolidaysStore((state) => ({
    holidays: state.holidays,
    getHolidays: state.getHolidays,
    getHolidaysSuccess: state.getHolidaysSuccess,
    getHolidaysFail: state.getHolidaysFail,
  }));

  // Check number of regular holidays
  const countRegularHolidays = (holidays: Array<Holiday>) => {
    let count = 0;
    holidays.map((holiday) => {
      if (
        holiday.type === 'regular' &&
        dayjs().isBefore(dayjs(holiday.holidayDate).format('MM DD, YYYY')) &&
        dayjs().isSame(dayjs(holiday.holidayDate).format('MM DD, YYYY'), 'year')
      ) {
        count = count + 1;
      }
    });

    return count;
  };

  const countSpecialHolidays = (holidays: Array<Holiday>) => {
    let count = 0;
    holidays.map((holiday) => {
      if (
        holiday.type === 'special' &&
        dayjs().isBefore(dayjs(holiday.holidayDate).format('MM DD, YYYY')) &&
        dayjs().isSame(dayjs(holiday.holidayDate).format('MM DD, YYYY'), 'year')
      ) {
        count = count + 1;
      }
    });

    return count;
  };

  // Initial zustand state update
  useEffect(() => {
    if (swrIsLoading) {
      getHolidays(swrIsLoading);
    }
  }, [swrIsLoading]);

  // Upon success/fail of swr request, zustand state will be updated
  useEffect(() => {
    if (!isEmpty(swrHolidays)) {
      getHolidaysSuccess(swrIsLoading, swrHolidays.data);
    }

    if (!isEmpty(swrError)) {
      getHolidaysFail(swrIsLoading, swrError.message);
    }
  }, [swrHolidays, swrError]);

  return (
    <div className="flex w-full h-full border rounded-md shadow">
      <Card title="Upcoming Holidays" className="overflow-y-hidden border-none rounded">
        <div className="flex flex-col justify-between w-full min-h-max">
          <div className="flex flex-col w-full gap-2 overflow-y-auto text-xs">
            {/* Regular Holidays */}

            <div className="text-gray-500"> Regular Holidays</div>
            {swrIsLoading ? (
              <Skeleton count={4} borderRadius={1} />
            ) : countRegularHolidays(holidays) <= 0 ? (
              <div className="flex justify-center w-full h-full text-gray-400 py-2">-- No Holidays --</div>
            ) : (
              <div className="flex flex-col w-full gap-1 p-2 rounded-lg bg-blue-50">
                {!isEmpty(holidays) ? (
                  <>
                    {holidays.map((holiday) => {
                      const { holidayDate, id, name, type } = holiday;

                      if (
                        type === 'regular' &&
                        dayjs().isBefore(dayjs(holidayDate).format('MM DD, YYYY')) &&
                        dayjs().isSame(dayjs(holidayDate).format('MM DD, YYYY'), 'year')
                      ) {
                        return (
                          <div key={id} className="flex gap-2 px-2">
                            <div className="w-full ">{dayjs(holidayDate).format('MMMM D')}</div>
                            <div className="w-full">{name}</div>
                          </div>
                        );
                      }
                    })}
                  </>
                ) : (
                  <div className="flex justify-center w-full h-full text-gray-400 py-2">-- No Holidays --</div>
                )}
              </div>
            )}

            {/* Special Holidays */}
            <div className="text-gray-500"> Special non-working Holidays</div>

            {swrIsLoading ? (
              <Skeleton count={4} borderRadius={1} />
            ) : countSpecialHolidays(holidays) <= 0 ? (
              <div className="flex justify-center w-full h-full text-gray-400 py-2">-- No Holidays --</div>
            ) : (
              <div className="flex flex-col w-full gap-1 p-2 rounded-lg bg-blue-50">
                {!isEmpty(holidays) ? (
                  holidays.map((holiday) => {
                    const { holidayDate, id, name, type } = holiday;

                    if (
                      type === 'special' &&
                      dayjs().isBefore(dayjs(holidayDate).format('MM DD, YYYY')) &&
                      dayjs().isSame(dayjs(holidayDate).format('MM DD, YYYY'), 'year')
                    ) {
                      return (
                        <div key={id} className="flex gap-2 px-2 ">
                          <div className="w-full ">{dayjs(holidayDate).format('MMMM D')}</div>
                          <div className="w-full ">{name}</div>
                        </div>
                      );
                    }
                  })
                ) : (
                  <div className="flex justify-center w-full h-full text-gray-400 py-2">-- No Holidays --</div>
                )}
              </div>
            )}
          </div>

          {/* Button */}
          <div className="flex flex-col mt-2">
            <button className="px-3 py-1 bg-blue-400 rounded">
              <a rel="noreferrer" href={`/maintenance/events/holidays`}>
                <div className="text-xs text-white">View More →</div>
              </a>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
