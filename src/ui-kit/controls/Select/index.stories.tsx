import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Select } from './index'

const meta = {
  title: 'UI Kit/Controls/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof Select>

const defaultOptions = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
]

export const Default: Story = {
  args: {
    options: defaultOptions,
  },
}

export const WithDefaultValue: Story = {
  args: {
    options: defaultOptions,
    defaultValue: 'rating-desc',
  },
}

export const Disabled: Story = {
  args: {
    options: defaultOptions,
    disabled: true,
  },
}
