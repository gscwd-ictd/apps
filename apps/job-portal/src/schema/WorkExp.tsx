import dayjs from 'dayjs'
import * as yup from 'yup'

// yup validation schema
const schema = yup.object().shape({
  positionTitle: yup.string().required('Please enter a position title').trim().label('This'),
  companyName: yup.string().required('Please enter a company name').trim().label('This'),
  monthlySalary: yup
    .number()
    .required()
    .min(1, 'Please enter a valid salary')
    .typeError('Please enter a valid salary')
    .transform((v, o) => (o === '' ? null : v))
    .label('This'),
  appointmentStatus: yup.string().required('Please select from the list').trim().label('This'),
  isGovernmentService: yup.boolean().required('Please select from the list').label('This'),
  salaryGrade: yup
    .string()
    .label('This')
    .when('isGovernmentService', {
      is: true,
      then: yup
        .string()
        .required()
        .trim()
        .nullable(false)
        .typeError('Should not be empty')
        .label('This')
        .matches(/^([0-2][0-9])*-[1-8]$|^([3][0-2])*-[1-8]$|^([3][3])*-[1-3]$/, 'Must match the format "00-0"'),
      // .matches(/^[0-9]*-[1-8]$/, 'Must match the format "xx-x"'),
      //  .matches(/^([0-2][1-9])$|^([3][1-9])$/, "Write a valid Telephone Number or N/A"),
      // .matches(/^[0-9][1-3]*-[1-8]$/, 'Must match the format "xx-x"'),
      otherwise: yup
        .string()
        .notRequired()
        .trim()
        .nullable(true)
        .transform((v, o) => (o === '' ? null : v))
        .matches(/^([0-2][0-9])*-[1-8]$|^([3][0-2])*-[1-8]$|^([3][3])*-[1-3]$/, 'Must match the format "00-0"'),
    }),
  from: yup
    .string()
    .required()
    .trim()
    .label('This')
    .test('Date', 'Please enter a valid date', (value) => {
      return dayjs().diff(dayjs(value), 'hours') >= 0
    }),
  isPresentWork: yup.boolean().notRequired(),
  to: yup
    .string()
    .label('This')
    .when('isPresentWork', {
      is: false,
      then: yup
        .string()
        .required()
        .typeError('Please enter a valid date')
        .trim()
        .label('This')
        .test('Date', 'Please enter a valid date', (value) => {
          return dayjs().diff(dayjs(value), 'hours') >= 0
        })
        .test({
          name: 'min',
          exclusive: false,
          params: {},
          message: 'Please verify the date',
          test: function (value) {
            return value! >= this.parent.from
          },
        }),
    })
    .when('isPresentWork', { is: true, then: yup.string().notRequired().trim().nullable(true).label('This') }),
})

export default schema
