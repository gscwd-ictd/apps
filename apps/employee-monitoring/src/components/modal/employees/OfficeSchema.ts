import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import * as yup from 'yup';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

// parse date if after and return boolean
const parseDateIfAfter = (
  date: string,
  value: string | null,
  compare: string | null
) => {
  // if value or compare is not valid return false

  if (
    dayjs(value, 'HH:mm', true).isValid() === false ||
    dayjs(compare, 'HH:mm', true).isValid() === false
  )
    return false;
  // return true
  else return dayjs(date + ' ' + value).isAfter(dayjs(date + ' ' + compare));
};

// parse date if before and return boolean
const parseDateIfBefore = (
  date: string,
  value: string | null,
  compare: string | null
) => {
  // if value or compare is not valid return false

  if (
    dayjs(value, 'HH:mm', true).isValid() === false ||
    dayjs(compare, 'HH:mm', true).isValid() === false
  )
    return false;
  // return true
  else return dayjs(date + ' ' + value).isBefore(dayjs(date + ' ' + compare));
};

// parse date and return boolean
const parseDateIfBetween = (
  date: string,
  value: string | null,
  before: string | null,
  after: string | null
) => {
  // if value or compare is not valid return false

  if (
    dayjs(value, 'HH:mm', true).isValid() === false ||
    dayjs(before, 'HH:mm', true).isValid() === false ||
    dayjs(after, 'HH:mm', true).isValid() === false
  )
    return false;
  // return true
  else
    return dayjs(date + ' ' + value).isBetween(
      dayjs(date + ' ' + before),
      dayjs(date + ' ' + after),
      'minutes'
    );
};

export const OfficeSchema = yup.object().shape({
  companyId: yup.string(),
  dtrDate: yup.string(),
  timeIn: yup.string().when('withLunch', {
    is: true,
    then: yup
      .string()
      .notRequired()
      .label('Time in')
      .test({
        name: 'Time in',
        exclusive: false,
        params: {},
        message:
          'Time in should not be greater than lunch out, lunch in, or time out',
        test: function (value) {
          // if lunch out and value is not empty
          if (!isEmpty(this.parent.lunchOut) && !isEmpty(value)) {
            if (
              parseDateIfBefore(
                this.parent.dtrDate,
                value,
                this.parent.lunchOut
              ) === false
            ) {
              return false;
            } else return true;
          }
          // if lunch in and value is not empty
          else if (!isEmpty(this.parent.lunchIn) && !isEmpty(value)) {
            if (
              parseDateIfBefore(
                this.parent.dtrDate,
                value,
                this.parent.lunchIn
              ) === false
            ) {
              return false;
            } else return true;
          }
          // if time out and value is not empty
          else if (!isEmpty(this.parent.timeOut) && !isEmpty(value)) {
            if (
              parseDateIfBefore(
                this.parent.dtrDate,
                value,
                this.parent.timeOut
              ) === false
            ) {
              return false;
            } else return true;
          } else if (isEmpty(value)) return true;
        },
      }),
  }),
  withLunch: yup.boolean(),
  lunchOut: yup.string().when('withLunch', {
    is: true,
    then: yup
      .string()
      .notRequired()
      .label('Lunch out')
      .test({
        name: 'Lunch out',
        exclusive: false,
        params: {},
        message: 'Time should be greater than time in!',
        test: function (value) {
          // if time in and value is not empty
          if (!isEmpty(this.parent.timeIn) && !isEmpty(value)) {
            // parse
            if (
              parseDateIfAfter(
                this.parent.dtrDate,
                value,
                this.parent.timeIn
              ) === false
            )
              return false;
            else return true;
          }

          // if time in is empty and value is not empty
          else if (isEmpty(this.parent.timeIn) && !isEmpty(value)) {
            if (dayjs(this.parent.dtrDate + ' ' + value).isValid() === false) {
              return false;
            } else return true;
          } else if (isEmpty(value)) return true;
        },
      }),
    otherwise: yup.string().notRequired().nullable(),
  }),
  lunchIn: yup.string().when('withLunch', {
    is: true,
    then: yup
      .string()
      .notRequired()
      .label('Lunch in')
      .test({
        name: 'Lunch in',
        exclusive: false,
        params: {},
        message: 'Time should be greater than lunch out!',
        test: function (value) {
          // if lunchout, timeout, and value is not empty
          if (
            !isEmpty(this.parent.lunchOut) &&
            !isEmpty(this.parent.timeOut) &&
            !isEmpty(value)
          ) {
            // if (dayjs(this.parent.dtrDate + ' ' + value).isValid()) {
            //   return dayjs(this.parent.dtrDate + ' ' + value).isAfter(
            //     dayjs(this.parent.dtrDate + ' ' + this.parent.lunchOut)
            //   );
            // } else return false;
            if (
              parseDateIfBetween(
                this.parent.dtrDate,
                value,
                this.parent.lunchOut,
                this.parent.timeOut
              ) === false
            )
              return false;
            else return true;
          } else if (
            isEmpty(this.parent.lunchOut) &&
            !isEmpty(this.parent.timeIn) &&
            !isEmpty(value)
          ) {
            if (dayjs(this.parent.dtrDate + ' ' + value).isValid()) {
              return dayjs(this.parent.dtrDate + ' ' + value).isAfter(
                dayjs(this.parent.dtrDate + ' ' + this.parent.timeIn)
              );
            } else return false;
          } else if (isEmpty(this.parent.lunchOut)) {
            return true;
          }
        },
      }),
    otherwise: yup.string().notRequired().nullable(),
  }),
  timeOut: yup.string().when('withLunch', {
    is: true,
    then: yup
      .string()
      .notRequired()
      .label('Time out')
      .test({
        name: 'Time out',
        exclusive: false,
        params: {},
        message: 'Time should not be greater than lunch out',
        test: function (value) {
          if (!isEmpty(this.parent.lunchIn)) {
            return dayjs(this.parent.dtrDate + ' ' + value).isAfter(
              dayjs(this.parent.dtrDate + ' ' + this.parent.lunchIn)
            );
          } else if (
            isEmpty(this.parent.lunchIn) &&
            !isEmpty(this.parent.lunchOut)
          ) {
            return dayjs(this.parent.dtrDate + ' ' + value).isAfter(
              dayjs(this.parent.dtrDate + ' ' + this.parent.lunchOut)
            );
          } else if (
            isEmpty(this.parent.lunchIn) &&
            isEmpty(this.parent.lunchOut) &&
            !isEmpty(this.parent.timeIn)
          ) {
            return dayjs(this.parent.dtrDate + ' ' + value).isAfter(
              dayjs(this.parent.dtrDate + ' ' + this.parent.timeIn)
            );
          } else return true;
        },
      }),
  }),
});
