import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TextField } from './index'

const meta = {
  title: 'UI Kit/Controls/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof TextField>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const Email: Story = {
  args: {
    placeholder: 'Enter your email',
    type: 'email',
  },
}

export const Password: Story = {
  args: {
    placeholder: 'Enter password',
    type: 'password',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Cannot edit',
    disabled: true,
  },
}
