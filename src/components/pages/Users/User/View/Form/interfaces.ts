import { CurrentUserUpdateInput } from 'src/gql/generated'
import * as yup from 'yup'

export type UserFormData = CurrentUserUpdateInput

export const userEditSchema: yup.ObjectSchema<UserFormData> = yup
  .object()
  .shape({
    fullname: yup.string(),
    password: yup.string(),
    username: yup.string(),
    image: yup.string(),
    content: yup.string(),
  })
