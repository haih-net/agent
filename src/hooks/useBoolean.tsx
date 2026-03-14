import { useMemo, useState } from 'react'

export function useBoolean(defaultValue = false) {
  const [value, valueSetter] = useState(defaultValue)

  const { setTrue, setFalse, toggle } = useMemo(() => {
    return {
      setTrue: () => valueSetter(() => true),
      setFalse: () => valueSetter(() => false),
      toggle: () => valueSetter((prev) => !prev),
    }
  }, [])

  return [value, setTrue, setFalse, toggle] as const
}
