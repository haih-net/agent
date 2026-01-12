import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UserPageView as Component } from '../'
import {
  MeDocument,
  MeQuery,
  UpdateCurrentUserDocument,
  UpdateCurrentUserMutation,
} from 'src/gql/generated'
import {
  RequestType,
  GraphQLRequestContext,
} from '.storybook/addons/msw/msw-adapter'

import { mockCurrentUser, mockViewedUser } from '.storybook/mocks/user'

type Props = Parameters<typeof Component>[0]

const meta = {
  title: 'pages/Users/User/View',
  component: Component,
  argTypes: {},
} satisfies Meta<Props>

export default meta

type Story = StoryObj<Props>

export const NotAuthenticated: Story = {
  args: {
    user: mockViewedUser,
  },
  parameters: {
    appContext: {
      user: null,
    },
    msw: {
      mocks: [
        {
          type: RequestType.GRAPHQL,
          query: MeDocument,
          response: (): { data: MeQuery } => ({
            data: { me: null },
          }),
        },
      ],
    },
  },
}

export const AuthenticatedOtherUser: Story = {
  args: {
    user: mockViewedUser,
  },
  parameters: {
    appContext: {
      user: mockCurrentUser,
    },
    msw: {
      mocks: [
        {
          type: RequestType.GRAPHQL,
          query: MeDocument,
          response: (): { data: MeQuery } => ({
            data: { me: mockCurrentUser },
          }),
        },
      ],
    },
  },
}

export const AuthenticatedOwnProfile: Story = {
  args: {
    user: mockCurrentUser,
  },
  parameters: {
    appContext: {
      user: mockCurrentUser,
    },
    msw: {
      mocks: [
        {
          type: RequestType.GRAPHQL,
          query: MeDocument,
          response: (): { data: MeQuery } => ({
            data: { me: mockCurrentUser },
          }),
        },
        {
          type: RequestType.GRAPHQL,
          query: UpdateCurrentUserDocument,
          response: (
            req: GraphQLRequestContext,
          ): { data: UpdateCurrentUserMutation } => {
            return {
              data: {
                response: {
                  ...mockCurrentUser,
                  ...req.variables?.data,
                },
              },
            }
          },
        },
      ],
    },
  },
}
