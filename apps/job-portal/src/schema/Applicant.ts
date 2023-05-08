import * as yup from "yup";

const schema = yup.object().shape({
  lastName: yup.string().required().trim().label("Last name"),
  firstName: yup.string().required().trim().label("First name"),
  middleName: yup.string().required().trim().label("Middle name"),
  nameExtension: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .label("Name extension"),
  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Please enter a valid email address")
    .label("Email address")
    .typeError("Please enter a valid value"),
  checkbox: yup.boolean().required(),
});

export default schema;
