import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FormattedDate } from './'

const sampleDate = new Date('2025-01-03T10:00:00.000Z')

const meta = {
  title: 'Components/FormattedDate',
  component: FormattedDate,
  args: {
    value: sampleDate,
    locale: 'en-GB',
  },
} satisfies Meta<typeof FormattedDate>

export default meta

type Story = StoryObj<typeof FormattedDate>

export const DateDefault: Story = {}

export const DateTimePadded: Story = {
  args: {
    format: 'dateTimePadded',
  },
}

export const DateShort: Story = {
  args: {
    format: 'dateShort',
  },
}

export const DateMedium: Story = {
  args: {
    format: 'dateMedium',
  },
}

export const DateLong: Story = {
  args: {
    format: 'dateLong',
  },
}

export const DateFull: Story = {
  args: {
    format: 'dateFull',
  },
}

export const DateTimeShort: Story = {
  args: {
    format: 'dateTimeShort',
  },
}

export const DateTimeMedium: Story = {
  args: {
    format: 'dateTimeMedium',
  },
}

export const TimeOnlyShort: Story = {
  args: {
    format: 'timeShort',
  },
}

export const TimeOnlyWithSeconds: Story = {
  args: {
    format: 'timeWithSeconds',
  },
}

export const FromIsoString: Story = {
  args: {
    value: '2025-01-03T10:00:00.000Z',
    format: 'dateTimeShort',
  },
}

export const EmptyWithFallback: Story = {
  args: {
    value: null,
    fallback: '-',
  },
}

export const LocaleDe: Story = {
  args: {
    locale: 'de-DE',
    format: 'datePadded',
  },
}
