import dayjs from 'dayjs';
import * as yup from 'yup';

// yup validation schema
const schema = yup.object().shape({
  organizationName: yup.string().required('Please enter an organization name').trim().label('This'),
  position: yup.string().required('Please enter a position title').trim().label('This'),
  from: yup
    .string()
    .required('Please enter a valid date')
    .trim()
    .label('This')
    .test('date', 'Please enter a valid date', (value) => {
      return dayjs().diff(dayjs(value), 'hours') >= 0;
    }),
  to: yup
    .string()
    .label('This')
    .when('isCurrentlyVol', {
      is: false,
      then: yup
        .string()
        .required('Please enter a valid date')
        .trim()
        .label('This')
        .test('date', 'Please enter a valid date', (value) => {
          return dayjs().diff(dayjs(value), 'hours') >= 0;
        })
        .test({
          name: 'min',
          exclusive: false,
          params: {},
          message: 'Should not be less than date from.',
          test: function (value) {
            return value! >= this.parent.from;
          },
        }),
    })
    .when('isCurrentlyVol', {
      is: true,
      then: yup.string().notRequired().nullable(true).trim().label('This'),
    }),
  numberOfHours: yup.number().when('isCurrentlyVol', {
    is: true,
    then: yup.number().notRequired().nullable(true).label('This'),
    otherwise: yup
      .number()
      .min(1)
      .required()
      .transform((v, o) => (o === '' ? null : v))
      .typeError('Please enter a valid number of hours')
      .label('This'),
  }),
});

export default schema;
