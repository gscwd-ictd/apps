/* eslint-disable @nx/enforce-module-boundaries */
import { SelectOption } from 'libs/utils/src/lib/types/select.type';

function UseRestDaysOptionToNumberArray(restDays: SelectOption[]) {
  const restDayNumbers = restDays.map((restDay) => {
    return parseInt(restDay.value.toString());
  });
  return restDayNumbers;
}

export default UseRestDaysOptionToNumberArray;
