import { UserFragment, useUpdateCurrentUserMutation } from 'src/gql/generated'
import { UserEditFormStyled } from './styles'
import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { userEditSchema, UserFormData } from './interfaces'
import React, { useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { TextField } from 'src/ui-kit/controls/TextField'
import { FormControl } from 'src/ui-kit/FormControl'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'

const MarkdownEditor = dynamic(() => import('src/components/Markdown/Editor'), {
  ssr: false,
})

function getDefaultValues(user: UserEditFormProps['user']): UserFormData {
  return {
    username: user?.username ?? '',
    fullname: user?.fullname ?? '',
    image: user?.image ?? '',
    content: user?.content ?? '',
  }
}

type UserEditFormProps = {
  user: UserFragment
  closeForm?: () => void
}

export const UserEditForm: React.FC<UserEditFormProps> = ({
  user,
  closeForm,
  ...other
}) => {
  const { addMessage } = useSnackbar() || {}

  const form = useForm<UserFormData>({
    defaultValues: getDefaultValues(user),
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(userEditSchema),
  })

  const [updateCurrentUserMutation, { loading: updateUserInRequest }] =
    useUpdateCurrentUserMutation()

  const inRequest = updateUserInRequest

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()

      form
        .trigger()
        .then((reason) => {
          if (reason === true) {
            const { ...other } = form.getValues()

            const request = updateCurrentUserMutation({
              variables: {
                data: {
                  ...other,
                },
              },
            })

            request
              .then((r) => {
                const data = r.data?.response

                if (data) {
                  addMessage?.('Data saved', {
                    variant: 'success',
                  })

                  form.reset(getDefaultValues(data))
                  closeForm?.()
                } else {
                  addMessage?.('No data received', { variant: 'error' })
                }
              })
              .catch((error) => {
                const errorMessage = error.message || 'Request error'
                addMessage?.(errorMessage, { variant: 'error' })
              })
          } else {
            console.error(form.formState.errors)

            addMessage?.('Validation error', { variant: 'warning' })
          }
        })
        .catch((error) => {
          console.error(error)
          addMessage?.('Unexpected error', {
            variant: 'error',
          })
        })
    },
    [addMessage, form, updateCurrentUserMutation, closeForm],
  )

  const fieldRenderer = useCallback<
    ControllerProps<
      UserFormData,
      'username' | 'fullname' | 'image' | 'content'
    >['render']
  >(({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => {
    let label: string
    const helperText = undefined
    let EditorComponent: typeof TextField | typeof MarkdownEditor = TextField

    switch (name) {
      case 'username':
        label = 'Username'
        break
      case 'fullname':
        label = 'Full name'
        break
      case 'image':
        label = 'Image'
        break
      case 'content':
        label = 'Content'
        EditorComponent = MarkdownEditor
        break
    }

    return (
      <FormControl
        label={label}
        helperText={error ? error.message : helperText}
        error={!!error}
      >
        <EditorComponent
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormControl>
    )
  }, [])

  return (
    <UserEditFormStyled {...other} onSubmit={onSubmit}>
      <FormProvider {...form}>
        <Controller name="username" render={fieldRenderer} />
        <Controller name="fullname" render={fieldRenderer} />
        <Controller name="image" render={fieldRenderer} />
        <Controller name="content" render={fieldRenderer} />

        <div>
          <Button type="submit" disabled={inRequest}>
            Save
          </Button>
          <Button
            type="button"
            variant={ComponentVariant.SECONDARY}
            onClick={closeForm}
            disabled={inRequest}
            style={{ marginLeft: '8px' }}
          >
            Cancel
          </Button>
        </div>
      </FormProvider>
    </UserEditFormStyled>
  )
}
