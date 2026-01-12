import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ComponentSize, ComponentVariant } from '../interfaces'
import { Badge } from './index'

const meta = {
  title: 'UI Kit/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: Object.values(ComponentVariant),
    },
    size: {
      control: 'select',
      options: Object.values(ComponentSize),
    },
  },
  args: {
    size: ComponentSize.MD,
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Default',
  },
}

export const Primary: Story = {
  args: {
    children: 'Active',
    variant: ComponentVariant.PRIMARY,
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: ComponentVariant.SECONDARY,
  },
}

export const Success: Story = {
  args: {
    children: 'Available',
    variant: ComponentVariant.SUCCESS,
  },
}

export const Warning: Story = {
  args: {
    children: 'Limited',
    variant: ComponentVariant.WARNING,
  },
}

export const Danger: Story = {
  args: {
    children: 'Error',
    variant: ComponentVariant.DANGER,
  },
}

export const Small: Story = {
  args: {
    children: 'Small',
    variant: ComponentVariant.PRIMARY,
    size: ComponentSize.SM,
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium',
    variant: ComponentVariant.PRIMARY,
    size: ComponentSize.MD,
  },
}

export const Large: Story = {
  args: {
    children: 'Large',
    variant: ComponentVariant.PRIMARY,
    size: ComponentSize.LG,
  },
}
