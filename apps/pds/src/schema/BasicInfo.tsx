import dayjs from 'dayjs';
import * as yup from 'yup';

const schema = yup.object().shape({
  lastName: yup.string().required().trim().label('Surname'),
  firstName: yup.string().required().trim().label('First name'),
  middleName: yup.string().required().trim().label('Middle name'),
  nameExtension: yup.string().trim().nullable().required().label('Name extension'),
  birthDate: yup
    .string()
    .required('Please enter a valid birthday')
    .label('Birthdate')
    .typeError('Please enter a valid value')
    .test('Date', 'Please enter a valid birthday', (value) => {
      return dayjs().diff(dayjs(value, 'YYYY-MM-DD' || 'YYYY/MM/DD'), 'hours') >= 0;
    }),
  sex: yup.string().required('Please select from the list').label('Sex'),
  birthPlace: yup.string().required('Please provide your place of birth').trim().label('Birthplace'),
  civilStatus: yup.string().required('Please select from the list').label('Civil status'),
  height: yup
    .number()
    // .integer() //! Change
    .positive('Please enter a valid value')
    .required()
    .max(9.99, 'Please enter a valid value') //! Change
    .transform((v, o) => (o === '' ? 0 : v))
    .label('Height'),
  weight: yup
    .number()
    .positive('Please enter a valid value')
    .max(999, 'Please enter a valid value')
    .transform((v, o) => (o === '' ? 0 : v))
    .required()
    .label('Weight'),
  bloodType: yup.string().required('Please select from the list').label('Blood type'),
  citizenship: yup.string().required('Please select from the list').label('Citizenship'),
  citizenshipType: yup
    .string()
    .notRequired()
    .label('Citizenship type')
    .when('citizenship', { is: 'Dual Citizenship', then: yup.string().required('Please select from the list').label('Citizenship type') }),
  country: yup.string().required('Please select a country from the list').label('Country'),
  telephoneNumber: yup
    .string()
    .nullable(true)
    .trim()
    // .matches(/^([0-9]{7,})$|^([0-9]{10,})$|^N\/A$/, 'Write a valid Telephone Number or N/A')
    .matches(
      /^([0-9]{3}[\-][0-9]{3}[\-][0-9]{4})$|^([0-9]{3}[\-][0-9]{4})$|^N\/A$|^([0-9]{7})$|^([0-9]{10})$/,
      'Write a valid Telephone Number with or without dashes(-) or N/A'
    )
    .label('Telephone number')
    .required(),
  mobileNumber: yup
    .string()
    .required('Please enter a valid mobile number')
    .trim()
    .nullable(false)
    .label('Mobile number')
    .min(10)
    .max(11)
    .matches(/^\d+$/, 'Numbers are only allowed'),
  email: yup
    .string()
    .trim()
    .email('Invalid email format')
    .required('Please enter a valid email address')
    .label('Email address')
    .typeError('Please enter a valid value'),
  gsisNumber: yup
    .string()
    .max(11)
    .matches(/^N\/A$|^([0-9]{10})$|^([0-9]{11})$/, 'Write your 10 or 11-digit GSIS BP Number or N/A')
    .required()
    .trim()
    .label('GSIS BP Number'),
  pagibigNumber: yup
    .string()
    // .max(12)
    .matches(/^([0-9]{4}[\-][0-9]{4}[\-][0-9]{4})$|^([0-9]{12})$|^N\/A$/, 'Write your 12-digit PAG-IBIG MID Number or N/A')
    .required()
    .trim()
    .label('PAG-IBIG MID Number'),
  philhealthNumber: yup
    .string()
    // .max(12)
    .trim()
    // .matches(/^([0-9]{12})$|^N\/A$/, 'Write a valid PhilHealth Number or N/A')
    .matches(/^([0-9]{2}[\-][0-9]{9}[\-][0-9]{1})$|^([0-9]{12})$|^N\/A$/, 'Write a PhilHealth Number with or without dashes(-) or N/A')
    .required()
    .label('PhilHealth Number'),
  sssNumber: yup
    .string()
    // .max(10)
    .trim()
    // .matches(/^([0-9]{10})$|^([0-9]{9})$|^N\/A$/, 'Write a valid SSS Number or N/A')
    .matches(/^([0-9]{2}[\-][0-9]{7}[\-][0-9]{1})$|^([0-9]{10})$|^N\/A$/, 'Write your SSS Number with or without dashes(-) or N/A')
    .required()
    .label('SSS Number'),
  tinNumber: yup
    .string()
    // .max(12)
    .trim()
    // .matches(/^([0-9]{12})$|^([0-9]{9})$|^N\/A$/, 'Write a valid TIN Number or N/A')
    .matches(
      /^([0-9]{3}[\-][0-9]{3}[\-][0-9]{3}[\-][0-9]{3})$|^([0-9]{9})$|^([0-9]{12})$|^([0-9]{3}[\-][0-9]{3}[\-][0-9]{3})$|^N\/A$/,
      'Write your 9 or 12-digit TIN Number with or without dashes(-) or N/A'
    )
    .required()
    .label('TIN Number'),
  agencyNumber: yup
    .string()
    .trim()
    .matches(/^([a-zA-Z0-9-]{5,})$|^N\/A$/, 'Write a valid Employee Agency No.')
    .required()
    .label('Employee Agency No.'),
});

export default schema;
