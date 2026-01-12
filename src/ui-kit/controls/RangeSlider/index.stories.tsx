import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RangeSlider } from './index'

const meta = {
  title: 'UI Kit/RangeSlider',
  component: RangeSlider,
} satisfies Meta<typeof RangeSlider>

export default meta
type Story = StoryObj<typeof RangeSlider>

function RangeSliderDemo() {
  const [minValue, setMinValue] = useState(50)
  const [maxValue, setMaxValue] = useState(200)

  return (
    <RangeSlider
      label="Price Range"
      min={0}
      max={500}
      minValue={minValue}
      maxValue={maxValue}
      onMinChange={setMinValue}
      onMaxChange={setMaxValue}
    />
  )
}

export const Default: Story = {
  render: () => <RangeSliderDemo />,
}
