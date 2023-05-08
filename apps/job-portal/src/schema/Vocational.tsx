import * as yup from 'yup'

// yup validation schema
const schema = yup.object().shape({
    isOngoing: yup.boolean(),
    applicantId: yup.string(),
    schoolName: yup.string().required('Please enter school name').trim().label('This'),
    degree: yup.string().trim().required('Please do not leave this empty').label('This'),
    from: yup
        .number()
        .required()
        .nullable(false)
        .label('This')
        .typeError('Please enter a valid year')
        .min(1900, 'Please enter a valid year')
        .max(2100, 'Please enter a valid year'),
    to: yup
        .number()
        .label('This')
        .when('isOngoing', {
            is: false,
            then: yup
                .number()
                .nullable(false)
                .label('Year')
                .typeError('Please enter a valid year')
                .min(1900, 'Please enter a valid year')
                .max(2100, 'Please enter a valid year')
                .required()
                .test({
                    name: 'min',
                    exclusive: false,
                    params: {},
                    message: 'Please check the year',
                    test: function (value) {
                        return value! >= parseFloat(this.parent.from)
                    },
                }),
            otherwise: yup.number().notRequired().nullable(true),
        }),
    units: yup.string().trim().notRequired().nullable(true),
    awards: yup.string().trim().notRequired().nullable(true),
    yearGraduated: yup
        .number()
        .nullable(true)
        .transform((v, o) => (o === '' ? null : v))
        .notRequired()
        .when('isGraduated', {
            is: true,
            then: yup
                .number()
                .required('Please enter a valid year ')
                .typeError('Please enter a valid year')
                .min(1900, 'Please enter a valid year')
                .max(2100, 'Please enter a valid year')
                .test({
                    name: 'min',
                    exclusive: false,
                    params: {},
                    message: 'Should be equal to "Year to"',
                    test: function (value) {
                        return value! === parseFloat(this.parent.to)
                    },
                }),
        }),
})

export default schema