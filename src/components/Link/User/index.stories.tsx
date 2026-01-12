import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UserLink } from './index'

const meta = {
  title: 'Components/Link/UserLink',
  component: UserLink,
  tags: ['autodocs'],
} satisfies Meta<typeof UserLink>

export default meta
type Story = StoryObj<typeof UserLink>

export const Default: Story = {
  args: {
    user: {
      id: 'user-1',
      fullname: 'John Doe',
      username: 'john',
    },
  },
}

export const WithoutId: Story = {
  args: {
    user: {
      id: null,
      fullname: 'Unnamed (no id)',
      username: 'no-id-user',
    },
  },
}
