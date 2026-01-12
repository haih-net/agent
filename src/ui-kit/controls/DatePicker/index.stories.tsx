import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DatePicker } from './index'

const meta = {
  title: 'UI Kit/Controls/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  args: {},
}

export const WithValue: Story = {
  args: {
    defaultValue: '2025-01-20',
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: '2025-01-20',
    disabled: true,
  },
}

export const DateRange: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <DatePicker defaultValue="2025-01-15" />
      <DatePicker defaultValue="2025-01-20" />
    </div>
  ),
}
