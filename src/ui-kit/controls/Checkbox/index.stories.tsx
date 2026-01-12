import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Checkbox } from './index'

const meta = {
  title: 'UI Kit/Controls/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    label: 'WiFi',
  },
}

export const Checked: Story = {
  args: {
    label: 'Pool',
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Spa',
    disabled: true,
  },
}

export const AmenitiesList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Checkbox label="WiFi" defaultChecked />
      <Checkbox label="Pool" />
      <Checkbox label="Gym" defaultChecked />
      <Checkbox label="Beach" />
      <Checkbox label="Spa" />
    </div>
  ),
}
