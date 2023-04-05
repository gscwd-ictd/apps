import { LeaveType } from 'libs/utils/src/lib/types/leave-benefits.type';
import * as yup from 'yup';
const LeaveBenefitSchema = yup.object().shape({
  id: yup.string().notRequired().trim(),
  leaveName: yup.string().required().trim().label('Leave name'),
  leaveType: yup.string().required().trim().label('Leave type'),
  creditDistribution: yup
    .string()
    .nullable()
    .label('Distribution')
    .when('leaveType', {
      is: LeaveType.SPECIAL,
      then: yup.string().notRequired().nullable(true),
      otherwise: yup.string().nullable().notRequired(),
    }),
  accumulatedCredits: yup
    .number()
    .label('Credits')
    .when('leaveType', {
      is: LeaveType.SPECIAL,
      then: yup.number().notRequired().nullable().label('Credits'),
      otherwise: yup
        .number()
        .required()
        .nullable(false)
        .transform((v, o) => (o === '' ? null : v))
        .label('Credits'),
    }),
  maximumCredits: yup
    .number()
    .label('Credit ceiling')
    .when('leaveType', {
      is: LeaveType.SPECIAL,
      then: yup
        .number()
        .positive()
        .required()
        .nullable(false)
        .typeError('Please enter a valid value')
        .transform((v, o) => (o === '' ? null : v))
        .label('Credit ceiling'),
      otherwise: yup.number().notRequired().nullable().label('Credit ceiling'),
    }),
});
export default LeaveBenefitSchema;
