import dayjs from 'dayjs';
import * as yup from 'yup';

// yup schema validation
const schema = yup.object().shape({
  // offRelDetails: yup.string().when(''),
  govtId: yup.string().required().label('This'),
  govtIdNo: yup.string().required().label('This'),
  issueDate: yup
    .string()
    .notRequired()
    .nullable()
    // .test('Date', 'Please choose a valid date', (value) => {
    //   return dayjs().diff(dayjs(value), 'hours') >= 0;
    // })
    .label('This'),
  issuePlace: yup.string().required().label('This'),
  offRelThird: yup.number().required().label('This'),
  offRelFourth: yup.number().required().label('This'),
  offRelDetails: yup
    .string()
    .label('Office relation details')
    .when('offRelThird', {
      is: 1,
      then: yup.string().required('Please provide details'),
      otherwise: yup.string().nullable(true).notRequired(),
    })
    .when('offRelFourth', {
      is: 1,
      then: yup.string().required('Please provide details'),
      otherwise: yup.string().nullable(true).notRequired(),
    }),
  isGuilty: yup.number().required().label('This'),
  guiltyDetails: yup.string().when('isGuilty', {
    is: 1,
    then: yup
      .string()
      .nullable(false)
      .required('Please provide administrative offense details'),
    otherwise: yup.string().nullable(true).notRequired(),
  }),
  isCharged: yup.number().required().label('This'),
  chargedDateFiled: yup.string().when('isCharged', {
    is: 1,
    then: yup.string().nullable(false).required('Please provide details'),
    otherwise: yup.string().nullable(true).notRequired(),
  }),
  chargedCaseStatus: yup.string().when('isCharged', {
    is: 1,
    then: yup.string().nullable(false).required('Please provide details'),
    otherwise: yup.string().nullable(true).notRequired(),
  }),
  isConvicted: yup.number().required().label('This'),
  convictedDetails: yup.string().when('isConvicted', {
    is: 1,
    then: yup.string().nullable(false).required('Please provide details'),
    otherwise: yup.string().nullable(true).notRequired(),
  }),
  isSeparated: yup.number().required().label('This'),
  separatedDetails: yup.string().when('isSeparated', {
    is: 1,
    then: yup.string().nullable(false).required('Please provide details'),
    otherwise: yup.string().nullable(true).notRequired(),
  }),
  isCandidate: yup.number().required().label('This'),
  candidateDetails: yup.string().when('isCandidate', {
    is: 1,
    then: yup.string().nullable(false).required('Please provide details'),
    otherwise: yup.string().nullable(true).notRequired(),
  }),
  isImmigrant: yup.number().required().label('This'),
  immigrantDetails: yup.string().when('isImmigrant', {
    is: 1,
    then: yup.string().nullable(false).required('Please provide details'),
    otherwise: yup.string().nullable(true).notRequired(),
  }),
  isIndigenousMember: yup.number().required().label('This'),
  indigenousMemberDetails: yup.string().when('isIndigenousMember', {
    is: 1,
    then: yup.string().nullable(false).required('Please provide details'),
    otherwise: yup.string().nullable(true).notRequired(),
  }),
  isPwd: yup.number().required().label('This'),
  pwdIdNumber: yup.string().when('isPwd', {
    is: 1,
    then: yup.string().nullable(false).required('Please provide details'),
    otherwise: yup.string().nullable(true).notRequired(),
  }),
  isSoloParent: yup.number().required().label('This'),
  soloParentIdNumber: yup.string().when('isSoloParent', {
    is: 1,
    then: yup.string().nullable(false).required('Please provide details'),
    otherwise: yup.string().nullable(true).notRequired(),
  }),
});

export default schema;
