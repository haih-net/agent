import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SignUpForm as Component } from './index'
import { SignupDocument, SignupMutation } from 'src/gql/generated'
import { RequestType } from '.storybook/addons/msw/msw-adapter'

type Props = Parameters<typeof Component>[0]

const meta = {
  title: 'Components/Auth/SignUpForm',
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
          query: SignupDocument,
          response: (): { data: SignupMutation } => ({
            data: {
              response: {
                __typename: 'AuthPayload',
                success: true,
                message: 'Registration successful',
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

export const UserAlreadyExists: Story = {
  parameters: {
    msw: {
      mocks: [
        {
          type: RequestType.GRAPHQL,
          query: SignupDocument,
          response: (): { data: SignupMutation } => ({
            data: {
              response: {
                __typename: 'AuthPayload',
                success: false,
                message: 'User with this email already exists',
                token: null,
              },
            },
          }),
        },
      ],
    },
  },
}
