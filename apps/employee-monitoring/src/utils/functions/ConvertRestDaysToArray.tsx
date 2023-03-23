import { listOfRestDays } from 'libs/utils/src/lib/constants/rest-days.const';

// converts the array of numbers(rest days) to its corresponding array
export const useConvertRestDaysToArray = (restDays: Array<number>) => {
  const tempRestDays = restDays.map((day: number) => {
    return listOfRestDays.find((tempDay) => tempDay.value === day);
  });
  return tempRestDays;
};
