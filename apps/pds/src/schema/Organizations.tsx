import * as yup from 'yup'

// yup validation schema
const schema = yup.object().shape({ organization: yup.string().required('Please enter a membership in an organization').trim().label('Membership') })



export default schema