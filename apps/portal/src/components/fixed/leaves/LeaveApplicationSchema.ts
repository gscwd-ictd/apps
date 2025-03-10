/* eslint-disable @nx/enforce-module-boundaries */
// import { LeaveName } from 'libs/utils/src/lib/enums/leave.enum';
// import { LeaveType } from 'libs/utils/src/lib/types/leave-benefits.type';
import * as yup from 'yup';
const LeaveApplicationSchema = yup.object().shape({
  //   employeeId: yup.string().required(),
  //   dateOfFiling: yup.string().required(),
  typeOfLeaveDetails: yup.object().shape({ id: yup.string().required(), leaveName: yup.string().required() }),

  lateFilingJustification: yup
    .string()
    .label('Justification Letter')
    .when('isLateFiling', {
      is: true,
      then: yup.string().nullable().required(),
      otherwise: yup.string().nullable().notRequired().typeError('Justification Letter is blank'),
    }),

  //   leaveApplicationDates: yup.array().of(yup.string()),
  //   leaveApplicationDatesRange: yup.array().of(yup.string()),

  //   inPhilippinesOrAbroad: yup.string(),
  //   location: yup.string(),
  //   hospital: yup.string(),
  //   illness: yup.string(),
  //   specialLeaveWomenIllness: yup.string(),

  //   forMastersCompletion: yup.boolean(),
  //   forBarBoardReview: yup.boolean(),
  //   studyLeaveOther: yup.boolean(),

  //   other: yup.string(),

  //   commutation: yup.string(),
  //   forMonetization: yup.boolean(),
  //   totalNumberOfDays: yup.number(),

  //   isLateFiling: yup
  //     .boolean()
  //     .required()
  //     .when('typeOfLeaveDetails.leaveName', {
  //       is: !LeaveName.TERMINAL && !LeaveName.MONETIZATION,
  //       then: yup.boolean().required().typeError('Late Filing is not set'),
  //       otherwise: yup.boolean().notRequired(),
  //     }),
  // .when('typeOfLeaveDetails.leaveName', {
  //   is: LeaveName.MONETIZATION,
  //   then: yup.boolean().notRequired(),
  //   otherwise: yup.boolean().required().typeError('Late Filing is not set'),
  // }),
  //   leaveMonetization: yup
  //     .object()
  //     .shape({
  //       convertedSl: yup.string().required(),
  //       convertedVl: yup.string().required(),
  //       monetizationType: yup.string().required(),
  //       monetizedAmount: yup.number().required(),
  //     })
  //     .when('leaveType', {
  //       is: LeaveName.MONETIZATION,
  //       then: yup
  //         .object()
  //         .shape({
  //           convertedSl: yup.string().required(),
  //           convertedVl: yup.string().required(),
  //           monetizationType: yup.string().required(),
  //           monetizedAmount: yup.number().required(),
  //         }),
  //       otherwise: yup
  //         .object()
  //         .shape({
  //           convertedSl: yup.string().notRequired(),
  //           convertedVl: yup.string().notRequired(),
  //           monetizationType: yup.string().notRequired(),
  //           monetizedAmount: yup.number().notRequired(),
  //         }),
  //     }),
});
export default LeaveApplicationSchema;
