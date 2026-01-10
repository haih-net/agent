/**
 * Safely parses a JSON string or returns the value if already an object.
 * Returns defaultValue on parse failure.
 *
 * @param value - Value to parse (string or object)
 * @param defaultValue - Fallback value if parsing fails
 * @returns Parsed object or defaultValue
 *
 * @example
 * parseJson('{"key": "value"}', {}) // { key: "value" }
 * parseJson({ key: "value" }, {})   // { key: "value" }
 * parseJson('invalid', [])          // []
 */
export const parseJson = <T>(value: unknown, defaultValue: T): T => {
  if (typeof value === 'object') {
    return value as T
  }
  try {
    return JSON.parse(value as string)
  } catch {
    return defaultValue
  }
}
