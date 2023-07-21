import * as yup from 'yup';

export const OfficeSchedSchema = yup.object().shape({
  id: yup.string().notRequired(),
  name: yup.string().required(),

  scheduleType: yup.string().required(),
  timeIn: yup.string().required(),
  timeOut: yup.string().required(),
  scheduleBase: yup.string().required(),
  withLunch: yup.boolean().required(),
  lunchIn: yup.string().when('withLunch', {
    is: true,
    then: yup.string().required().nullable(false),
    otherwise: yup.string().notRequired().nullable(),
  }),
  lunchOut: yup.string().when('withLunch', {
    is: true,
    then: yup.string().required().nullable(false),
    otherwise: yup.string().notRequired().nullable(),
  }),
  shift: yup.string().required(),
});
