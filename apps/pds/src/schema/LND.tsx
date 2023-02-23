import dayjs from 'dayjs'
import * as yup from 'yup'

// yup validation schema
const schema = yup.object().shape({
    title: yup.string().required('Please enter a title').trim().label('This').trim(),
    conductedBy: yup.string().required('Please do not leave this empty ').trim().label('This').trim(),
    type: yup.string().required('Please select from the list').trim().label('This'),
    from: yup
        .string()
        .required('Please enter a valid date')
        .trim()
        .test('date', 'Please enter a valid date', (value) => {
            return dayjs().diff(dayjs(value), 'hours') >= 0
        })
        .label('This'),
    to: yup
        .string()
        .required('Please enter a valid date')
        .trim()
        .label('This')
        .test('date', 'Please enter a valid date', (value) => {
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
    numberOfHours: yup
        .number()
        .min(1, 'Please enter a valid number of hour(s)')
        .typeError('Please enter a valid number of hour(s)')
        .required()
        .label('This')
        .transform((v, o) => (o === '' ? null : v)),
})

export default schema