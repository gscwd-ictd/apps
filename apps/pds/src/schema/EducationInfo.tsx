import * as yup from 'yup';

const schema = yup.object().shape({
  elemSchoolName: yup.string().required('Please enter school name').trim().label('This'),
  elemDegree: yup.string().required('Please select from the list').trim().label('This'),
  elemFrom: yup
    .number()
    .required('Year started should not be empty')
    .nullable(false)
    .transform((v, o) => (o === '' ? null : v))
    .typeError('Please enter a valid year')
    .min(1900, 'Please enter a valid year')
    .max(2100, 'Please enter a valid year')
    .label('This'),
  elemTo: yup
    .number()
    .nullable(false)
    .transform((v, o) => (o === '' ? null : v))
    .typeError('Please enter a valid year')
    .min(1900, 'Please enter a valid year')
    .max(2100, 'Please enter a valid year')
    .required()
    .test({
      name: 'min',
      exclusive: false,
      params: {},
      message: 'Please verify the year',
      test: function (value) {
        return value! >= this.parent.elemFrom;
      },
    })
    .label('This'),
  elemUnits: yup.string().required('Please select from the list').trim().label('This'),
  elemYearGraduated: yup
    .number()
    .label('This')
    .nullable(true)
    .notRequired()
    .when('elemUnits', {
      is: 'Grade 1',
      then: yup.number().nullable(true).notRequired().label('This'),
    })
    .when('elemUnits', {
      is: 'Grade 2',
      then: yup.number().nullable(true).notRequired().label('This'),
    })
    .when('elemUnits', {
      is: 'Grade 3',
      then: yup.number().nullable(true).notRequired().label('This'),
    })
    .when('elemUnits', {
      is: 'Grade 4',
      then: yup.number().nullable(true).notRequired().label('This'),
    })
    .when('elemUnits', {
      is: 'Grade 5',
      then: yup.number().nullable(true).notRequired().label('This'),
    })
    .when('elemUnits', {
      is: 'Graduated',
      then: yup
        .number()
        .required('')
        .nullable(false)
        .transform((v, o) => (o === '' ? null : v))
        .typeError('Please enter a valid year')
        .min(1900, 'Please enter a valid year')
        .max(2100, 'Please enter a valid year')
        .label('This')
        .test({
          name: 'min',
          exclusive: false,
          params: {},
          message: "Should be the same with 'Year Ended'",
          test: function (value) {
            return value! === this.parent.elemTo;
          },
        }),
    }),

  elemAwards: yup
    .string()
    .trim()
    .nullable(true)
    .required()
    // .matches(/^([A-Za-z0-9_@./#&+-]{1,})$|^N\/A$/, 'Should enter a valid input')
    .label('This'),
  secSchoolName: yup.string().nullable(true).notRequired().trim().label('This'),
  secDegree: yup
    .string()
    .when('secSchoolName', {
      is: null,
      then: yup.string().notRequired().nullable(true).trim(),
      otherwise: yup.string().nullable(false).trim().required('Please select from the list'),
    })
    .when('secSchoolName', {
      is: '',
      then: yup.string().notRequired().nullable(true).trim(),
      otherwise: yup.string().nullable(false).trim().required('Please select from the list'),
    })
    .label('This'),
  secFrom: yup
    .number()
    .when('secSchoolName', {
      is: null,
      then: yup.number().nullable(true).notRequired(),
      otherwise: yup
        .number()
        .nullable(false)
        .required('Please enter a valid year')
        .transform((v, o) => (o === '' ? null : v))
        .typeError('Please enter a valid year')
        .min(1900, 'Please enter a valid year')
        .max(2100, 'Please enter a valid year'),
    })
    .when('secSchoolName', {
      is: '',
      then: yup.number().nullable(true).notRequired(),
      otherwise: yup
        .number()
        .nullable(false)
        .required('Please enter a valid year')
        .transform((v, o) => (o === '' ? null : v))
        .typeError('Please enter a valid year')
        .min(1900, 'Please enter a valid year')
        .max(2100, 'Please enter a valid year'),
    })
    .label('This'),
  secTo: yup
    .number()
    .when('secSchoolName', {
      is: null,
      then: yup.number().nullable(true).notRequired(),
      otherwise: yup
        .number()
        .nullable(false)
        .required('Please enter a valid year')
        .transform((v, o) => (o === '' ? null : v))
        .typeError('Please enter a valid year')
        .min(1900, 'Please enter a valid year')
        .max(2100, 'Please enter a valid year')
        .test({
          name: 'min',
          exclusive: false,
          params: {},
          message: 'Please verify the year',
          test: function (value) {
            return value! >= this.parent.secFrom;
          },
        })
        .required(),
    })
    .when('secSchoolName', {
      is: '',
      then: yup.number().nullable(true).notRequired(),
      otherwise: yup
        .number()
        .nullable(false)
        .required('Please enter a valid year')
        .transform((v, o) => (o === '' ? null : v))
        .typeError('Please enter a valid year')
        .min(1900, 'Please enter a valid year')
        .max(2100, 'Please enter a valid year')
        .test({
          name: 'min',
          exclusive: false,
          params: {},
          message: 'Please verify the year',
          test: function (value) {
            return value! >= this.parent.secFrom;
          },
        })
        .required(),
    })
    .label('This'),
  secUnits: yup
    .string()
    .when('secSchoolName', {
      is: null,
      then: yup.string().nullable(true).notRequired().trim(),
      otherwise: yup.string().nullable(false).required('Please select from the list'),
    })
    .when('secSchoolName', {
      is: '',
      then: yup.string().nullable(true).notRequired().trim(),
      otherwise: yup.string().nullable(false).required('Please select from the list'),
    })
    .label('This'),
  secYearGraduated: yup
    .number()
    .when(['secUnits', 'secSchoolName'], {
      is: (secUnits: string | null, secSchoolName: string | null) =>
        secUnits !== 'Graduated' && (secSchoolName !== null || secSchoolName !== ''),
      then: yup.number().nullable(true).notRequired(),
      otherwise: yup
        .number()
        .nullable(true)
        .transform((v, o) => (o === '' ? null : v))
        .min(1900, 'Please enter a valid year')
        .max(2100, 'Please enter a valid year')
        .typeError('Please enter a valid year')
        .required('Please enter a valid year')
        .test({
          name: 'min',
          exclusive: false,
          params: {},
          message: "Should be the same with 'Year Ended'",
          test: function (value) {
            return value! === this.parent.secTo;
          },
        }),
    })
    .label('This'),
  secAwards: yup
    .string()
    .when('secSchoolName', {
      is: null,
      then: yup.string().nullable(true).notRequired().trim(),
      otherwise: yup
        .string()
        .nullable(false)
        .required()
        // .matches(/^([A-Za-z0-9_@./#&+-]{1,})$|^N\/A$/, 'Should enter a valid input')
        .label('This'),
    })
    .when('secSchoolName', {
      is: '',
      then: yup.string().nullable(true).notRequired().trim(),
      otherwise: yup
        .string()
        .nullable(false)
        .required()
        // .matches(/^([A-Za-z0-9_@./#&+-]{1,})$|^N\/A$/, 'Should enter a valid input')
        .label('This'),
    }),
});

export default schema;
