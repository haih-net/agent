const config = $config

let triggerData = {}

if ($('Parse Input').isExecuted) {
  triggerData = $('Parse Input').first().json
} else if ($('Set Test Input').isExecuted) {
  triggerData = $('Set Test Input').first().json
}

return [
  {
    json: {
      query: triggerData.query || '',
      variables: triggerData.variables || {},
      operationName: triggerData.operationName || '',
      endpoint: config.GRAPHQL_ENDPOINT,
      token: triggerData.token || '',
    },
  },
]
