import * as yup from 'yup'

// yup validation schema
const schema = yup.object().shape({ recognition: yup.string().required('Please enter a recognition').trim().label('Recognition') })

export default schema