import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Popover } from './index'

const meta = {
  title: 'UI Kit/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  args: {
    trigger: 'Click me',
    children: <div style={{ padding: '8px' }}>Popover content here</div>,
  },
}
