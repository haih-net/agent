import React, { useCallback } from 'react'
import dynamic from 'next/dynamic'

import * as yup from 'yup'

import { PostEditFormStyled, PostEditFormToolbarStyled } from './styles'

import {
  Controller,
  ControllerProps,
  FormProvider,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import {
  PostCreateInput,
  PostFragment,
  PostsConnectionDocument,
  PostStatus,
  useCreatePostMutation,
  UserStatusEnum,
  useUpdatePostMutation,
} from 'src/gql/generated'
import { useSnackbar } from 'src/ui-kit/Snackbar'
import { TextField } from 'src/ui-kit/controls/TextField'
import { FormControl } from 'src/ui-kit/FormControl'
import { Button } from 'src/ui-kit/Button'
import { ComponentVariant } from 'src/ui-kit/interfaces'
import { PostBannerStyled } from 'src/components/Post/styles'
import { useAppContext } from 'src/components/AppContext'

const MarkdownEditor = dynamic(
  () => import('src/components/Markdown/Editor').then((r) => r.MarkdownEditor),
  {
    ssr: false,
  },
)

type FormData = Omit<PostCreateInput, 'parentId'>

function getDefaultValues(post: PostEditFormProps['post']): FormData {
  return {
    title: post?.title ?? '',
    description: post?.description ?? '',
    intro: post?.intro ?? '',
    content: post?.content ?? '',
    status: post?.status ?? PostStatus.PUBLISHED,
  }
}

export const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  intro: yup.string(),
  content: yup.string().required(),
  status: yup
    .mixed<PostStatus>()
    .oneOf(Object.values(PostStatus))
    .label('Status'),
})

type PostEditFormProps = {
  post: PostFragment | undefined
  parentId: string | null | undefined
  cancelHandler: (() => void) | undefined
}

export const PostEditForm: React.FC<PostEditFormProps> = ({
  post,
  cancelHandler,
  parentId,
}) => {
  const { user: currentUser } = useAppContext()

  const { addMessage } = useSnackbar() || {}

  const router = useRouter()

  const [createPostMutation, { loading: loadingCreatePost }] =
    useCreatePostMutation({
      refetchQueries: [PostsConnectionDocument],
    })
  const [updatePostMutation, { loading: loadingUpdatePost }] =
    useUpdatePostMutation({
      refetchQueries: [PostsConnectionDocument],
    })

  const loading = loadingCreatePost || loadingUpdatePost

  const form = useForm<FormData>({
    defaultValues: getDefaultValues(post),
    resolver: yupResolver(schema),
    shouldFocusError: false,
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()

      form
        .trigger()
        .then(async (reason) => {
          if (reason === true) {
            const { ...other } = form.getValues()

            const request = post
              ? updatePostMutation({
                  variables: {
                    // lang: language,
                    data: {
                      ...other,
                    },
                    where: {
                      id: post.id,
                    },
                  },
                })
              : createPostMutation({
                  variables: {
                    // lang: language,
                    data: {
                      ...other,
                      parentId,
                    },
                  },
                })

            request
              .then((r) => {
                const post = r.data?.response

                if (post) {
                  addMessage?.('Success', {
                    variant: 'success',
                  })

                  cancelHandler?.()

                  router.push(`/posts/${post.id}`)
                } else {
                  addMessage?.('Error', { variant: 'error' })
                }
              })
              .catch((error) => {
                const errorMessage = error.message || 'Request error'
                addMessage?.(errorMessage, { variant: 'error' })
              })
          } else {
            console.error('Form errors', form.formState.errors)

            const errorMessage = 'Please, check form'
            addMessage?.(errorMessage, { variant: 'warning' })
          }
        })
        .catch((error) => {
          console.error(error)
          addMessage?.('Unexpected error', {
            variant: 'error',
          })
        })
    },
    [
      addMessage,
      createPostMutation,
      form,
      post,
      router,
      updatePostMutation,
      cancelHandler,
      parentId,
    ],
  )

  const fieldRenderer = useCallback<
    ControllerProps<
      FormData,
      'content' | 'description' | 'intro' | 'status' | 'title'
    >['render']
  >(({ field: { name, value, onChange, onBlur }, fieldState: { error } }) => {
    let label: string
    const helperText = undefined
    let EditorComponent:
      | typeof TextField
      | typeof MarkdownEditor
      | React.FC<React.HtmlHTMLAttributes<HTMLSelectElement>> = TextField

    switch (name) {
      case 'title':
        label = 'title'
        break
      case 'description':
        label = 'SEO description'
        break
      case 'intro':
        label = 'Intro'
        EditorComponent = MarkdownEditor
        break
      case 'status':
        label = 'Status'

        EditorComponent = (
          props: React.HtmlHTMLAttributes<HTMLSelectElement>,
        ) => {
          return (
            <select {...props}>
              {Object.values(PostStatus).map((n) => {
                return (
                  <option key={n} value={n}>
                    {n}
                  </option>
                )
              })}
            </select>
          )
        }
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

  const isActive = currentUser && currentUser.status === UserStatusEnum.ACTIVE

  return (
    <FormProvider {...form}>
      <PostEditFormStyled onSubmit={onSubmit}>
        {!isActive && (
          <PostBannerStyled>
            You cannot publish posts until you are activated
          </PostBannerStyled>
        )}

        <Controller name="title" render={fieldRenderer} />
        <Controller name="description" render={fieldRenderer} />
        {post?.id && <Controller name="status" render={fieldRenderer} />}
        <Controller name="intro" render={fieldRenderer} />
        {/* <Controller name="intro" render={fieldRenderer} /> */}
        <Controller name="content" render={fieldRenderer} />

        <PostEditFormToolbarStyled>
          {cancelHandler && (
            <Button
              variant={ComponentVariant.SECONDARY}
              type="button"
              onClick={cancelHandler}
            >
              Cancel
            </Button>
          )}

          <Button
            variant={ComponentVariant.SUCCESS}
            type="submit"
            disabled={!isActive || loading}
          >
            Save
          </Button>
        </PostEditFormToolbarStyled>
      </PostEditFormStyled>
    </FormProvider>
  )
}
