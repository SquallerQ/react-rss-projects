import * as Yup from 'yup';

export const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Z]/, 'Name must start with an uppercase letter')
    .matches(/^[a-zA-Z0-9]*$/, 'Name must contain only Latin characters')
    .required('Name is required'),
  age: Yup.number()
    .typeError('Age must be a number')
    .min(13, 'Age must be at least 13 years')
    .required('Age is required')
    .nullable(),
  email: Yup.string()
    .email('Invalid email format')
    .matches(/^[a-zA-Z0-9@.]*$/, 'Email must contain only Latin characters')
    .required('Email is required'),
  password: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/,
      'Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character'
    )
    .matches(
      /^[a-zA-Z0-9!@#$%^&*]*$/,
      'Password must contain only Latin characters'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .matches(
      /^[a-zA-Z0-9!@#$%^&*]*$/,
      'Confirm password must contain only Latin characters'
    )
    .required('Required'),
  gender: Yup.string().required('Required'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('Required'),
  picture: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
});
