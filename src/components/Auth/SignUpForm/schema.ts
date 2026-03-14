import * as yup from 'yup'
import { SignUpFormData } from './interfaces'

let referrerToken = yup.string()

if (process.env.NEXT_PUBLIC_SITE_SIGNUP_STRATEGY !== 'ANY') {
  referrerToken = referrerToken.required()
}

export const signUpSchema: yup.ObjectSchema<SignUpFormData> = yup
  .object()
  .shape({
    fullname: yup.string(),
    username: yup
      .string()
      .test(
        'username-format',
        'Username can only contain letters, numbers and underscores',
        (value) => !value || /^[a-zA-Z0-9_]+$/.test(value),
      ),
    email: yup.string().email('Invalid email format'),
    password: yup
      .string()
      .required('Password is required')
      .test(
        'password-strength',
        'Password must be at least 8 characters and contain a lowercase letter, uppercase letter, and number',
        (value) =>
          !!value &&
          value.length >= 8 &&
          /[a-z]/.test(value) &&
          /[A-Z]/.test(value) &&
          /[0-9]/.test(value),
      ),
    referrerToken,
  })
