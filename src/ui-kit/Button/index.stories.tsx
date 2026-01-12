import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ComponentSize, ComponentVariant } from '../interfaces'
import { Button } from './index'

const meta = {
  title: 'UI Kit/Button',
  component: Button,
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
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    size: ComponentSize.MD,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: ComponentVariant.DEFAULT,
  },
}

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: ComponentVariant.PRIMARY,
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: ComponentVariant.SECONDARY,
  },
}

export const Success: Story = {
  args: {
    children: 'Success Button',
    variant: ComponentVariant.SUCCESS,
  },
}

export const Warning: Story = {
  args: {
    children: 'Warning Button',
    variant: ComponentVariant.WARNING,
  },
}

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: ComponentVariant.DANGER,
  },
}

export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: ComponentVariant.PRIMARY,
    size: ComponentSize.SM,
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: ComponentVariant.PRIMARY,
    size: ComponentSize.LG,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: ComponentVariant.PRIMARY,
    size: ComponentSize.MD,
    disabled: true,
  },
}
