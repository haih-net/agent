import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormControl } from './index'
import { Textarea } from '../controls/Textarea'
import { TextField } from '../controls/TextField'

const meta = {
  title: 'UI Kit/FormControl',
  component: FormControl,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof FormControl>

export default meta
type Story = StoryObj<typeof FormControl>

export const WithInput: Story = {
  args: {
    label: 'Email',
    helperText: 'We will never share your email',
  },
  render: (args) => (
    <FormControl {...args}>
      <TextField placeholder="Enter your email" type="email" />
    </FormControl>
  ),
}

export const WithTextarea: Story = {
  args: {
    label: 'Description',
  },
  render: (args) => (
    <FormControl {...args}>
      <Textarea placeholder="Enter description" rows={4} />
    </FormControl>
  ),
}

export const Required: Story = {
  args: {
    label: 'Username',
    required: true,
  },
  render: (args) => (
    <FormControl {...args}>
      <TextField placeholder="Enter username" />
    </FormControl>
  ),
}

export const WithError: Story = {
  args: {
    label: 'Password',
    error: true,
    helperText: 'Password must be at least 8 characters',
  },
  render: (args) => (
    <FormControl {...args}>
      <TextField type="password" placeholder="Enter password" />
    </FormControl>
  ),
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    disabled: true,
  },
  render: (args) => (
    <FormControl {...args}>
      <TextField placeholder="Cannot edit" />
    </FormControl>
  ),
}
