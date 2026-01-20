import React, { useCallback } from 'react'
import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { SignUpFormStyled } from './styles'
import { SignUpFormData, signUpSchema } from './interfaces'
import { SignupMutation, useSignupMutation } from 'src/gql/generated'
import { useAppContext } from 'src/components/AppContext'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { FormControl } from 'src/ui-kit/FormControl'
import { TextField } from 'src/ui-kit/controls/TextField'
import { Button } from 'src/ui-kit/Button'

export type { SignUpFormData }

export interface SignUpFormProps {
  onSuccessHandler?: (data: SignupMutation['response']) => void
  loading?: boolean
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSuccessHandler,
  loading = false,
}) => {
  const { onAuth } = useAppContext()

  const form = useForm<SignUpFormData>({
    defaultValues: {},
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(signUpSchema),
  })

  const { addMessage } = useSnackbar() || {}

  const [signupMutation] = useSignupMutation({})

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      form.trigger().then(async (isValid) => {
        if (isValid) {
          const data = form.getValues()

          try {
            await signupMutation({
              variables: {
                data,
              },
            }).then(async (r) => {
              if (r.data?.response?.token) {
                await onAuth?.(r.data?.response.token)

                onSuccessHandler?.(r.data.response)
              } else {
                throw new Error(r.data?.response?.message || '')
              }
            })
          } catch (error) {
            addMessage?.(
              (error as Error).message || 'Something wrong. Try later',
              {
                variant: 'error',
              },
            )
          }
        }
      })
    },
    [addMessage, form, onAuth, onSuccessHandler, signupMutation],
  )

  const fieldRenderer = useCallback<
    ControllerProps<
      SignUpFormData,
      'fullname' | 'username' | 'email' | 'password'
    >['render']
  >(
    ({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => {
      let label: string
      let placeholder: string
      let type = 'text'
      let required = false

      switch (name) {
        case 'fullname':
          label = 'Full name'
          placeholder = 'Enter full name'
          break
        case 'username':
          label = 'Username'
          placeholder = 'Enter username'
          break
        case 'email':
          label = 'Email'
          placeholder = 'Enter email'
          type = 'email'
          break
        case 'password':
          label = 'Password'
          placeholder = 'Enter password'
          type = 'password'
          required = true
          break
      }

      return (
        <FormControl
          label={label}
          required={required}
          helperText={error?.message}
          error={!!error}
        >
          <TextField
            type={type}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={loading}
          />
        </FormControl>
      )
    },
    [loading],
  )

  return (
    <SignUpFormStyled onSubmit={onSubmit}>
      <FormProvider {...form}>
        <Controller name="fullname" render={fieldRenderer} />
        <Controller name="email" render={fieldRenderer} />
        <Controller name="username" render={fieldRenderer} />
        <Controller name="password" render={fieldRenderer} />

        <Button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign up'}
        </Button>
      </FormProvider>
    </SignUpFormStyled>
  )
}
