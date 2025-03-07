// /* eslint-disable @nx/enforce-module-boundaries */
// import { LeaveType } from 'libs/utils/src/lib/types/leave-benefits.type';
// import * as yup from 'yup';
// const LeaveApplicationSchema = yup.object().shape({
//   employeeId: yup.string().required(),
//   dateOfFiling: yup.string().required(),
//   typeOfLeaveDetails:  yup.object().shape({  id: yup.string().required(), }),

//   leaveApplicationDates: Array<string>;
//   leaveApplicationDatesRange: LeaveDateRange;

//   inPhilippinesOrAbroad?: string; //withinThePhilippines or abroad
//   location?: string;
//   hospital?: string; //inHospital or outPatient
//   illness?: string | null;
//   specialLeaveWomenIllness?: string | null;

//   forMastersCompletion?: boolean;
//   forBarBoardReview?: boolean;
//   studyLeaveOther?: string | null; //applicable for Study Other only

//   other?: string | null; //monetization, terminal leave

//   commutation?: string | null;
//   forMonetization?: boolean;
//   totalNumberOfDays: number; //number of days of leave

//   isLateFiling: boolean;

//   leaveMonetization?: LeaveMonetizationDetail;

//   lateFilingJustification?: string | null;

//   id: yup.string().notRequired().trim(),
//   leaveName: yup.string().required().trim().label('Leave name'),
//   leaveType: yup.string().required().trim().label('Leave type'),
//   creditDistribution: yup
//     .string()
//     .nullable()
//     .label('Distribution')
//     .when('leaveType', {
//       is: LeaveType.SPECIAL,
//       then: yup.string().notRequired().nullable(true),
//       otherwise: yup.string().nullable().notRequired(),
//     }),
//   accumulatedCredits: yup
//     .number()
//     .label('Credits')
//     .when('leaveType', {
//       is: LeaveType.SPECIAL,
//       then: yup.number().notRequired().nullable().label('Credits'),
//       otherwise: yup
//         .number()
//         .required()
//         .nullable(false)
//         .typeError('Credits must be a number')
//         .transform((v, o) => (o === '' ? null : v))
//         .label('Credits'),
//     }),
//   maximumCredits: yup
//     .number()
//     .label('Credit ceiling')
//     .when('leaveType', {
//       is: LeaveType.SPECIAL,
//       then: yup
//         .number()
//         .positive()
//         .required()
//         .nullable(false)
//         .typeError('Please enter a valid value')
//         .transform((v, o) => (o === '' ? null : v))
//         .label('Credit ceiling'),
//       otherwise: yup
//         .number()
//         .notRequired()
//         .nullable()
//         .typeError('Please enter a valid value or empty')
//         .label('Credit ceiling'),
//     }),
// });
// export default LeaveApplicationSchema;
