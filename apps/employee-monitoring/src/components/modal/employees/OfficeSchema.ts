import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import * as yup from 'yup';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

// parse date if after and return boolean
const parseDateIfAfter = (date: string, value: string | null, compare: string | null) => {
  // if value or compare is not valid return false

  if (dayjs(value, 'HH:mm', true).isValid() === false || dayjs(compare, 'HH:mm', true).isValid() === false)
    return false;
  // return true
  else return dayjs(date + ' ' + value).isAfter(dayjs(date + ' ' + compare));
};

// parse date if before and return boolean
const parseDateIfBefore = (date: string, value: string | null, compare: string | null) => {
  // if value or compare is not valid return false

  if (dayjs(value, 'HH:mm', true).isValid() === false || dayjs(compare, 'HH:mm', true).isValid() === false)
    return false;
  // return true
  else return dayjs(date + ' ' + value).isBefore(dayjs(date + ' ' + compare));
};

// parse date and return boolean
const parseDateIfBetween = (date: string, value: string | null, before: string | null, after: string | null) => {
  // if value or compare is not valid return false

  if (
    dayjs(value, 'HH:mm', true).isValid() === false ||
    dayjs(before, 'HH:mm', true).isValid() === false ||
    dayjs(after, 'HH:mm', true).isValid() === false
  )
    return false;
  // return true
  else return dayjs(date + ' ' + value).isBetween(dayjs(date + ' ' + before), dayjs(date + ' ' + after), 'minutes');
};

export const OfficeSchema = yup.object().shape({
  companyId: yup.string(),
  dtrDate: yup.string(),
  withLunch: yup.boolean(),

  //  time in
  timeIn: yup.string(),
  // timeIn: yup.string().when('withLunch', {
  //   is: true,
  //   then: yup
  //     .string()
  //     .notRequired()
  //     .nullable()
  //     .label('Time in')
  //     .test('test-time-in', (value, validationContext) => {
  //       const {
  //         createError,
  //         parent: { lunchOut, dtrDate, lunchIn, timeOut },
  //       } = validationContext;
  //       // if lunch out and value is not empty
  //       if (!isEmpty(lunchOut) && !isEmpty(value)) {
  //         if (parseDateIfBefore(dtrDate, value, lunchOut) === false) {
  //           return createError({
  //             message: 'Time in should be lesser than lunch out!',
  //           });
  //         } else return true;
  //       }
  //       // if lunch in and value is not empty
  //       else if (!isEmpty(lunchIn) && !isEmpty(value)) {
  //         if (parseDateIfBefore(dtrDate, value, lunchIn) === false) {
  //           return createError({
  //             message: 'Time in should be lesser than lunch in!',
  //           });
  //         } else return true;
  //       }
  //       // if time out and value is not empty
  //       else if (!isEmpty(timeOut) && !isEmpty(value)) {
  //         if (parseDateIfBefore(dtrDate, value, timeOut) === false) {
  //           return createError({
  //             message: 'Time in should be lesser than time out!',
  //           });
  //         } else return true;
  //       } else if (!isEmpty(value) && isEmpty(lunchOut) && isEmpty(lunchIn) && isEmpty(timeOut)) return true;
  //       else if (isEmpty(value)) return true;
  //     }),
  //   otherwise: yup
  //     .string()
  //     .notRequired()
  //     .nullable()
  //     .label('Time in')
  //     .test('test-time-in', (value, validationContext) => {
  //       const {
  //         createError,
  //         parent: { dtrDate, timeOut },
  //       } = validationContext;

  //       // if time out and value is not empty
  //       if (!isEmpty(timeOut) && !isEmpty(value)) {
  //         if (parseDateIfBefore(dtrDate, value, timeOut) === false) {
  //           // create error
  //           return createError({
  //             message: 'Time in must be lesser than time out!',
  //           });
  //         } else return true;
  //       } else if (isEmpty(timeOut) && !isEmpty(value)) return true;
  //       else if (isEmpty(value)) return true;
  //     }),
  // }),

  // !isEmpty(watch('lunchIn')) ? true : false,
  // lunch out
  lunchOut: yup.string().when('withLunch', {
    is: true,
    then: yup
      .string()
      .required()
      .nullable()
      .label('Lunch out')
      .test('lunch-out-test', (value, validationContext) => {
        const {
          createError,
          parent: { timeIn, dtrDate, lunchIn, timeOut },
        } = validationContext;

        // if time in and value is not empty
        if (!isEmpty(timeIn) && isEmpty(lunchIn) && isEmpty(timeOut) && !isEmpty(value)) {
          // parse
          if (parseDateIfAfter(dtrDate, value, timeIn) === false)
            return createError({
              message: 'Lunch out must be greater than time in!',
            });
          else return true;
        }

        // if time in, lunchin value is not empty
        else if (!isEmpty(timeIn) && !isEmpty(lunchIn) && !isEmpty(value)) {
          // parse between
          if (parseDateIfBetween(dtrDate, value, timeIn, lunchIn) === false) {
            return createError({
              message: 'Lunch out must be in between time in and lunch in!',
            });
          } else return true;
        }

        // if time in, lunchin value is not empty
        else if (!isEmpty(timeIn) && isEmpty(lunchIn) && !isEmpty(timeOut) && !isEmpty(value)) {
          // parse between
          if (parseDateIfBetween(dtrDate, value, timeIn, timeOut) === false) {
            return createError({
              message: 'Lunch out must be in between time in and time out!',
            });
          } else return true;
        }

        // if time in, lunch in, time out is empty and value is not empty
        else if (isEmpty(timeIn) && isEmpty(lunchIn) && isEmpty(timeOut) && !isEmpty(value)) {
          // if valid return error
          if (dayjs(dtrDate + ' ' + value).isValid() === false) {
            return false;
          } else return true;
        }
        // if time in is empty and lunch in has a value
        else if (isEmpty(timeIn) && !isEmpty(lunchIn) && !isEmpty(value)) {
          if (parseDateIfBefore(dtrDate, value, lunchIn) === false) {
            return createError({
              message: 'Lunch out must be lesser than lunch in!',
            });
          } else return true;
        }

        // else
        else if (isEmpty(value)) return true;
      }),
    otherwise: yup.string().notRequired().nullable(),
  }),

  // lunch in
  // lunchIn: yup
  //   .string()
  //   .when('withLunch', {
  //     is: true,
  //     then: yup
  //       .string()
  //       .nullable()
  //       .label('Lunch in')
  //       .test('test-lunch-in', (value, validationContext) => {
  //         const {
  //           createError,
  //           parent: { dtrDate, timeIn, lunchOut, timeOut },
  //         } = validationContext;

  //         // if timeout and everything is empty and value is not empty
  //         if (!isEmpty(timeOut) && isEmpty(lunchOut) && isEmpty(timeIn) && !isEmpty(value)) {
  //           // parse
  //           if (parseDateIfBefore(dtrDate, value, timeOut) === false)
  //             return createError({
  //               message: 'Lunch in must be lesser than time out!',
  //             });
  //           else return true;
  //         }

  //         // if time out, lunch out, and value is not empty
  //         else if (!isEmpty(timeOut) && !isEmpty(lunchOut) && !isEmpty(value)) {
  //           // parse between
  //           if (parseDateIfBetween(dtrDate, value, lunchOut, timeOut) === false) {
  //             return createError({
  //               message: 'Lunch in must be in between lunch out and time out!',
  //             });
  //           } else return true;
  //         }

  //         // if time time out, time in, and value is not empty
  //         else if (!isEmpty(timeOut) && isEmpty(lunchOut) && !isEmpty(timeIn) && !isEmpty(value)) {
  //           // parse between
  //           if (parseDateIfBetween(dtrDate, value, timeIn, timeOut) === false) {
  //             return createError({
  //               message: 'Lunch out must be in between time in and time out!',
  //             });
  //           } else return true;
  //         }

  //         // if time in, lunch in, time out is empty and value is not empty
  //         else if (isEmpty(timeIn) && isEmpty(lunchOut) && isEmpty(timeOut) && !isEmpty(value)) {
  //           // if valid return error
  //           if (dayjs(dtrDate + ' ' + value).isValid() === false) {
  //             return false;
  //           } else return true;
  //         }

  //         // else
  //         else if (isEmpty(value)) return true;
  //       }),
  //     otherwise: yup.string().notRequired().nullable(),
  //   })
  //   .when('lunchOut', {
  //     is: (value) => value != '' || value != null,
  //     then: yup
  //       .string()
  //       .required('Editing of Lunch Out Log must be accompanied with Lunch In Log')
  //       .nullable(false)
  //       .typeError('Editing of Lunch Out Log must be accompanied with Lunch In Log'),
  //     otherwise: yup.string().notRequired().nullable(),
  //   }),

  // lunch in
  lunchIn: yup.string().when('withLunch', {
    is: true,
    then: yup
      .string()
      .required()
      .nullable()
      .label('Lunch in')
      .test('test-lunch-in', (value, validationContext) => {
        const {
          createError,
          parent: { dtrDate, timeIn, lunchOut, timeOut },
        } = validationContext;

        // if timeout and everything is empty and value is not empty
        if (!isEmpty(timeOut) && isEmpty(lunchOut) && isEmpty(timeIn) && !isEmpty(value)) {
          // parse
          if (parseDateIfBefore(dtrDate, value, timeOut) === false)
            return createError({
              message: 'Lunch in must be lesser than time out!',
            });
          else return true;
        }

        // if time out, lunch out, and value is not empty
        else if (!isEmpty(timeOut) && !isEmpty(lunchOut) && !isEmpty(value)) {
          // parse between
          if (parseDateIfBetween(dtrDate, value, lunchOut, timeOut) === false) {
            return createError({
              message: 'Lunch in must be in between lunch out and time out!',
            });
          } else return true;
        }

        // if time time out, time in, and value is not empty
        else if (!isEmpty(timeOut) && isEmpty(lunchOut) && !isEmpty(timeIn) && !isEmpty(value)) {
          // parse between
          if (parseDateIfBetween(dtrDate, value, timeIn, timeOut) === false) {
            return createError({
              message: 'Lunch out must be in between time in and time out!',
            });
          } else return true;
        }

        // if time in, lunch in, time out is empty and value is not empty
        else if (isEmpty(timeIn) && isEmpty(lunchOut) && isEmpty(timeOut) && !isEmpty(value)) {
          // if valid return error
          if (dayjs(dtrDate + ' ' + value).isValid() === false) {
            return false;
          } else return true;
        }

        // else
        else if (isEmpty(value)) return true;
      }),
    otherwise: yup.string().notRequired().nullable(),
  }),

  // time out
  timeOut: yup.string(),
  // timeOut: yup.string().when('withLunch', {
  //   is: true,
  //   then: yup
  //     .string()
  //     .notRequired()
  //     .nullable()
  //     .label('Time out')
  //     .test('test-time-out', (value, validationContext) => {
  //       const {
  //         createError,
  //         parent: { dtrDate, lunchIn, lunchOut, timeIn },
  //       } = validationContext;

  //       // if lunch in and value is not empty
  //       if (!isEmpty(lunchIn) && !isEmpty(value)) {
  //         // parse if before
  //         if (parseDateIfAfter(dtrDate, value, lunchIn) === false) {
  //           // return error
  //           return createError({
  //             message: 'Time out must be greater than lunch in!',
  //           });
  //         } else return true;
  //       }
  //       // if lunch out, value is not empty, and else is empty
  //       else if (isEmpty(lunchIn) && !isEmpty(lunchOut) && !isEmpty(value)) {
  //         if (parseDateIfAfter(dtrDate, value, lunchOut) === false) {
  //           // return error
  //           return createError({
  //             message: 'Time out must be greater than lunch out!',
  //             type: 'as',
  //           });
  //         } else return true;
  //       }

  //       // if lunch out, value is not empty, and else is empty
  //       else if (isEmpty(lunchIn) && isEmpty(lunchOut) && !isEmpty(timeIn) && !isEmpty(value)) {
  //         if (parseDateIfAfter(dtrDate, value, timeIn) === false) {
  //           // return error
  //           return createError({
  //             message: 'Time out must be greater than time in!',
  //           });
  //         } else return true;
  //       }

  //       // if time in, value is not empty, and else is empty
  //       else if (isEmpty(lunchIn) && isEmpty(lunchOut) && isEmpty(timeIn) && !isEmpty(value)) {
  //         // if valid return error
  //         if (dayjs(dtrDate + ' ' + value).isValid() === false) {
  //           return false;
  //         } else return true;
  //       }

  //       // if value is empty
  //       else if (isEmpty(value)) return true;
  //     }),
  //   otherwise: yup
  //     .string()
  //     .notRequired()
  //     .nullable()
  //     .label('Time out')
  //     .test('test-time-out', (value, validationContext) => {
  //       const {
  //         createError,
  //         parent: { dtrDate, timeIn },
  //       } = validationContext;

  //       // if time out and value is not empty
  //       if (!isEmpty(timeIn) && !isEmpty(value)) {
  //         if (parseDateIfAfter(dtrDate, value, timeIn) === false) {
  //           // create error
  //           return createError({
  //             message: 'Time out must be greater than time in!',
  //           });
  //         } else return true;
  //       }
  //     }),
  // }),
});
