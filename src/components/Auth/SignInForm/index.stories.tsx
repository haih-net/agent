import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SignInForm as Component } from './index'
import { SigninDocument, SigninMutation } from 'src/gql/generated'
import { RequestType } from '.storybook/addons/msw/msw-adapter'

type Props = Parameters<typeof Component>[0]

const meta = {
  title: 'Components/Auth/SignInForm',
  component: Component,
  parameters: {
    appContext: {
      user: null,
    },
  },
} satisfies Meta<Props>

export default meta

type Story = StoryObj<Props>

export const Default: Story = {
  parameters: {
    msw: {
      mocks: [
        {
          type: RequestType.GRAPHQL,
          query: SigninDocument,
          response: (): { data: SigninMutation } => ({
            data: {
              response: {
                __typename: 'AuthPayload',
                success: true,
                message: 'Login successful',
                token: 'mock-jwt-token-12345',
              },
            },
          }),
        },
      ],
    },
  },
}

export const Loading: Story = {
  args: {
    loading: true,
  },
}

export const InvalidCredentials: Story = {
  parameters: {
    msw: {
      mocks: [
        {
          type: RequestType.GRAPHQL,
          query: SigninDocument,
          response: (): { data: SigninMutation } => ({
            data: {
              response: {
                __typename: 'AuthPayload',
                success: false,
                message: 'Invalid username or password',
                token: null,
              },
            },
          }),
        },
      ],
    },
  },
}
