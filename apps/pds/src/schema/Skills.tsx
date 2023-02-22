import * as yup from 'yup'

// yup validation schema
const schema = yup.object().shape({
    skill: yup.string().required('Please enter a skill').trim().label('Skill'),
})

export default schema