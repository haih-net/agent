import React, { useCallback } from 'react'
import {
  RangeWrapper,
  RangeLabel,
  RangeInputs,
  RangeInput,
  RangeValues,
  RangeValue,
} from './styles'

export interface RangeSliderProps {
  label?: string
  min: number
  max: number
  minValue: number
  maxValue: number
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
  formatValue?: (value: number) => string
}

function defaultFormatValue(v: number): string {
  return `$${v}`
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  min,
  max,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  formatValue = defaultFormatValue,
}) => {
  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMinChange(Math.min(Number(e.target.value), maxValue - 1))
    },
    [onMinChange, maxValue],
  )

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMaxChange(Math.max(Number(e.target.value), minValue + 1))
    },
    [onMaxChange, minValue],
  )

  return (
    <RangeWrapper>
      {label && <RangeLabel>{label}</RangeLabel>}
      <RangeInputs>
        <RangeInput
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={handleMinChange}
          aria-label="Minimum value"
        />
        <RangeInput
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={handleMaxChange}
          aria-label="Maximum value"
        />
      </RangeInputs>
      <RangeValues>
        <RangeValue>{formatValue(minValue)}</RangeValue>
        <RangeValue>{formatValue(maxValue)}</RangeValue>
      </RangeValues>
    </RangeWrapper>
  )
}
