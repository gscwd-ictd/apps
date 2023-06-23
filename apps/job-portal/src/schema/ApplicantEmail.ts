import * as yup from 'yup'

const schema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email('Invalid email format')
    .required('Please enter a valid email address')
    .label('Email address')
    .typeError('Please enter a valid value'),
  confirmEmail: yup
    .string()
    .trim()
    .oneOf([yup.ref('email'), null], 'Email Addresses does not match')
    .email('Invalid email format')
    .required('Please enter a valid email address')
    .label('Email address')
    .typeError('Please enter a valid value'),
})

export default schema
