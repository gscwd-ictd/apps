import { Card } from './Card';
import useSWR from 'swr';
import fetcherEMS from '../../utils/fetcher/FetcherEMS';
import { useEffect } from 'react';
import { useHolidaysStore } from '../../store/holidays.store';
import { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const Holidays = (): JSX.Element => {
  // fetch data for list of holidays
  const {
    data: swrHolidays,
    error: swrError,
    isLoading: swrIsLoading,
    mutate: mutateHolidays,
  } = useSWR('/holidays', fetcherEMS, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // holiday store
  const { holidays, getHolidays, getHolidaysFail, getHolidaysSuccess } =
    useHolidaysStore((state) => ({
      holidays: state.holidays,
      getHolidays: state.getHolidays,
      getHolidaysSuccess: state.getHolidaysSuccess,
      getHolidaysFail: state.getHolidaysFail,
    }));

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
      <Card
        title="Upcoming Holidays"
        className="overflow-y-hidden border-none rounded"
      >
        <div className="flex flex-col justify-between w-full min-h-max">
          <div className="flex flex-col w-full gap-2 overflow-y-auto text-xs">
            {/* Regular Holidays */}

            <div className="text-gray-500"> Regular Holidays</div>
            {swrIsLoading ? (
              <Skeleton count={4} borderRadius={1} />
            ) : (
              <div className="flex flex-col w-full gap-1 px-2 py-1 rounded-lg bg-blue-50">
                {!isEmpty(holidays) ? (
                  <>
                    {holidays.map((holiday) => {
                      const { holidayDate, id, name, type } = holiday;
                      if (
                        type === 'regular' &&
                        dayjs().isBefore(
                          dayjs(holidayDate).format('MM DD, YYYY')
                        ) &&
                        dayjs().isSame(
                          dayjs(holidayDate).format('MM DD, YYYY'),
                          'year'
                        )
                      ) {
                        return (
                          <div key={id} className="flex gap-2 px-2">
                            <div className="w-[30%] ">
                              {dayjs(holidayDate).format('MMMM D')}
                            </div>
                            <div className="w-[70%]">{name}</div>
                          </div>
                        );
                      }
                    })}
                  </>
                ) : (
                  <div className="flex justify-center w-full h-full text-gray-400">
                    -- No Data --
                  </div>
                )}
              </div>
            )}

            {/* Special Holidays */}

            <div className="text-gray-500"> Special non-working Holidays</div>

            {swrIsLoading ? (
              <Skeleton count={4} borderRadius={1} />
            ) : (
              <div className="flex flex-col w-full gap-1 px-2 py-2 rounded-lg bg-blue-50">
                {!isEmpty(holidays) ? (
                  holidays.map((holiday) => {
                    const { holidayDate, id, name, type } = holiday;
                    if (
                      type === 'special' &&
                      dayjs().isBefore(
                        dayjs(holidayDate).format('MM DD, YYYY')
                      ) &&
                      dayjs().isSame(
                        dayjs(holidayDate).format('MM DD, YYYY'),
                        'year'
                      )
                    ) {
                      return (
                        <div key={id} className="flex gap-2 px-2 ">
                          <div className="w-[30%] ">
                            {dayjs(holidayDate).format('MMMM D')}
                          </div>
                          <div className="w-[70%] ">{name}</div>
                        </div>
                      );
                    }
                  })
                ) : (
                  <div className="flex justify-center w-full h-full text-gray-400">
                    -- No Data --
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Button */}

          <div className="flex flex-col mt-2">
            <button className="px-3 py-1 bg-blue-400 rounded">
              <div className="text-xs text-white">View More →</div>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
