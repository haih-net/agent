import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Textarea } from './index'

const meta = {
  title: 'UI Kit/Controls/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    rows: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    rows: 4,
  },
}

export const SmallRows: Story = {
  args: {
    placeholder: 'Short textarea',
    rows: 2,
  },
}

export const LargeRows: Story = {
  args: {
    placeholder: 'Large textarea',
    rows: 8,
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Cannot edit',
    rows: 4,
    disabled: true,
  },
}
