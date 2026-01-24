const response = $input.first().json

// Escape curly braces to prevent n8n template parsing. Replaced with utf symbols
function escapeForN8n(str) {
  if (!str) return ''
  return str
    .replace(/\{/g, '⦃')
    .replace(/\}/g, '⦄')
    .replace(/:/g, '꞉')
}

// Format 1: Direct error object (name: NodeApiError, message, description)
if (response.name === 'NodeApiError' || response.name === 'NodeOperationError') {
  const msg = escapeForN8n(response.message) || 'Unknown error'
  const details = escapeForN8n(response.description)
  throw new Error(details ? msg + ' - ' + details : msg)
}

// Format 2: HTTP error with nested error object
if (response.error) {
  const err = response.error
  const msg = escapeForN8n(err.message) || 'Unknown error'
  const details = escapeForN8n(err.description)
  throw new Error(details ? msg + ' - ' + details : msg)
}

// Format 3: GraphQL errors array
if (response.errors && response.errors.length > 0) {
  const errorMessages = response.errors
    .map((err) => {
      const path = err.path ? ' at ' + escapeForN8n(err.path.join('.')) : ''
      const locations = err.locations
        ? ' (line ' + err.locations.map((l) => l.line).join(', ') + ')'
        : ''
      return escapeForN8n(err.message) + path + locations
    })
    .join(' | ')

  throw new Error('GraphQL Error: ' + errorMessages)
}

return [{ json: response }]
