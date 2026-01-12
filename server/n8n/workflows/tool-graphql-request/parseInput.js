const input = $input.first().json

let variables = {}

if (
  input.variables !== undefined &&
  input.variables !== null &&
  input.variables !== ''
) {
  if (typeof input.variables === 'string') {
    try {
      variables = JSON.parse(input.variables)
    } catch {
      variables = {}
    }
  } else if (typeof input.variables === 'object') {
    variables = input.variables
  }
}

// Handle operationName
let operationName = ''
if (input.operationName && typeof input.operationName === 'string') {
  operationName = input.operationName.trim()
}

return [
  {
    json: {
      query: input.query || '',
      variables,
      operationName,
      token: input.token || '',
    },
  },
]
