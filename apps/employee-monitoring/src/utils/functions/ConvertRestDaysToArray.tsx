/* eslint-disable @nx/enforce-module-boundaries */
import { listOfRestDays } from 'libs/utils/src/lib/constants/rest-days.const';

// converts the array of numbers(rest days) to its corresponding array
function UseConvertRestDaysToArray(restDays: Array<number>) {
  const tempRestDays = restDays.map((day: number) => {
    return listOfRestDays.find((tempDay) => tempDay.value === day);
  });
  return tempRestDays;
}

export default UseConvertRestDaysToArray;
