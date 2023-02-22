import dayjs from 'dayjs';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Please enter an eligibility').trim().label('This'),
  rating: yup
    .number()
    .nullable(true)
    .transform((v, o) => (o === '' ? null : v))
    .min(1)
    .max(100)
    .label('Rating')
    .notRequired(),
  examDateFrom: yup
    .string()
    .required('Please enter a valid date')
    .trim()
    .test('Date', 'Please enter a valid date', (value) => {
      return dayjs().diff(dayjs(value), 'hours') >= 0;
    })
    .label('This'),
  examDateTo: yup
    .string()
    .label('This')
    .when('isOneDayOfExam', {
      is: false,
      then: yup
        .string()
        .required('Please enter a valid date')
        .label('This')
        .test('Date', 'Please verify the date', (value) => {
          return dayjs().diff(dayjs(value), 'hours') >= 0;
        })
        .test({
          name: 'min',
          exclusive: false,
          params: {},
          message: 'Please verify the date',
          test: function (value) {
            return value! >= this.parent.examDateFrom;
          },
        }),
      otherwise: yup.string().notRequired().nullable(true),
    }),
  examPlace: yup.string().required('Please do not leave this empty').trim().label('This'),
});

export default schema;
