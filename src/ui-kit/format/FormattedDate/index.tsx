import React from 'react'

type LocaleLike = string | string[]

type FormattedDateFormat =
  | 'datePadded'
  | 'dateShort'
  | 'dateMedium'
  | 'dateLong'
  | 'dateFull'
  | 'dateTimePadded'
  | 'dateTimeShort'
  | 'dateTimeMedium'
  | 'timeShort'
  | 'timeWithSeconds'

type FormattedDateProps = Intl.DateTimeFormatOptions & {
  value: Date | string | null | undefined
  fallback?: React.ReactNode
  locale?: LocaleLike
  format?: FormattedDateFormat
}

type FormatDateIntlArgs = Omit<FormattedDateProps, 'fallback'>

function getFormatDefaults(
  format: FormattedDateFormat | undefined,
): Intl.DateTimeFormatOptions {
  switch (format) {
    case 'datePadded':
      return { year: 'numeric', month: '2-digit', day: '2-digit' }
    case 'dateShort':
      return { dateStyle: 'short' }
    case 'dateMedium':
      return { dateStyle: 'medium' }
    case 'dateLong':
      return { dateStyle: 'long' }
    case 'dateFull':
      return { dateStyle: 'full' }
    case 'dateTimePadded':
      return {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }
    case 'dateTimeShort':
      return { dateStyle: 'short', timeStyle: 'short' }
    case 'dateTimeMedium':
      return { dateStyle: 'medium', timeStyle: 'medium' }
    case 'timeShort':
      return { hour: '2-digit', minute: '2-digit' }
    case 'timeWithSeconds':
      return { hour: '2-digit', minute: '2-digit', second: '2-digit' }
    default:
      return {}
  }
}

function formatDateIntl({
  value,
  locale,
  format,
  timeZone = 'UTC',
  ...other
}: FormatDateIntlArgs): string {
  if (!value) {
    return ''
  }

  const date = typeof value === 'string' ? new Date(value) : value

  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    ...getFormatDefaults(format),
    ...other,
  }

  return new Intl.DateTimeFormat(locale, options).format(date)
}

export const FormattedDate: React.FC<FormattedDateProps> = ({
  value,
  locale = 'en-US',
  format = 'datePadded',
  fallback = null,
  ...other
}) => {
  if (!value) {
    return fallback ?? null
  }

  return formatDateIntl({
    value,
    locale,
    format,
    ...other,
  })
}
