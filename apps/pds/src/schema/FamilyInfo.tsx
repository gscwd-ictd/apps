import * as yup from 'yup';

const schema = yup.object().shape({
  spouseLName: yup.string().required().trim().label('Surname'),
  spouseFName: yup.string().required().trim().label('First Name'),
  spouseMName: yup.string().required().trim().label('Middle Name'),
  spouseNameExt: yup.string().required().trim().label('Name Extension'),
  spouseEmpBusName: yup.string().required().trim().label('Employer or Business Name'),
  spouseBusAddr: yup.string().required().trim().label('Business Address'),
  spouseTelNo: yup.string().required().trim().min(3, 'Please input a valid telephone number').max(12).label('Telephone No.'),
  spouseOccupation: yup.string().required().trim().label('Occupation'),
  fatherLName: yup.string().required().trim().label('Surname'),
  fatherFName: yup.string().required().trim().label('First Name'),
  fatherMName: yup.string().required().trim().label('Middle Name'),
  fatherNameExt: yup.string().required().trim().label('Name Extension'),
  motherLName: yup.string().required().trim().label('Surname'),
  motherFName: yup.string().required().trim().label('First Name'),
  motherMName: yup.string().required().trim().label('Middle Name'),
});

export default schema;
