import * as yup from 'yup';

const ScheduleSchema = yup.object().shape({
  id: yup.string().notRequired().trim(),
  scheduleType: yup.string().nullable().required().label('Schedule type'),
  name: yup.string().nullable(false).required().trim().label('Name'),
  timeIn: yup.string().nullable().required().label('Time in'),
  timeOut: yup.string().nullable().required().label('Time out'),
  withLunch: yup.boolean().notRequired(),
  lunchIn: yup
    .string()
    .label('Lunch in')
    .when('withLunch', {
      is: true,
      then: yup
        .string()
        .required()
        .typeError('Time in is a required field')
        .trim()
        .label('Time in'),
    })
    .when('withLunch', {
      is: false,
      then: yup.string().notRequired().nullable().label('Time in'),
    }),
  lunchOut: yup
    .string()
    .label('Lunch out')
    .when('withLunch', {
      is: true,
      then: yup
        .string()
        .required()
        .typeError('Time out is a required field')
        .trim()
        .label('Time out'),
    })
    .when('withLunch', {
      is: false,
      then: yup.string().notRequired().nullable().label('Time out'),
    }),
  shift: yup.string().nullable().required().label('Shift'),
});

export default ScheduleSchema;
