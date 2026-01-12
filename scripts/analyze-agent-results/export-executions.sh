#!/bin/bash

# TODO: GraphQL Request workflow data extraction not working properly
# The jq query for resolving indexed array values fails on null values
# Need to implement proper recursive resolution for nested objects
# Currently shows empty data for "Tool: GraphQL Request (Chat Agent)" workflows

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CREDENTIALS_FILE="$SCRIPT_DIR/../../credentials/bootstrap.env"

if [[ ! -f "$CREDENTIALS_FILE" ]]; then
  echo "❌ Credentials file not found: $CREDENTIALS_FILE"
  exit 1
fi

source "$CREDENTIALS_FILE"

N8N_URL="${N8N_URL:-http://localhost:5678}"
N8N_EMAIL="$N8N_BOOTSTRAP_OWNER_EMAIL"
N8N_PASSWORD="$N8N_BOOTSTRAP_OWNER_PASSWORD"
OUTPUT_FILE="${1:-executions-export.md}"

if [[ -z "$N8N_EMAIL" || -z "$N8N_PASSWORD" ]]; then
  echo "❌ N8N_BOOTSTRAP_OWNER_EMAIL or N8N_BOOTSTRAP_OWNER_PASSWORD not set in $CREDENTIALS_FILE"
  exit 1
fi
COOKIE_FILE="/tmp/n8n-export-cookies.txt"
TMP_FILE="/tmp/n8n-executions-tmp.json"

echo "Logging in to n8n..."
LOGIN_RESPONSE=$(curl -s -X POST "$N8N_URL/rest/login" \
  -H "Content-Type: application/json" \
  -d "{\"emailOrLdapLoginId\": \"$N8N_EMAIL\", \"password\": \"$N8N_PASSWORD\"}" \
  -c "$COOKIE_FILE")

# echo "Login response: $LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q '"id"'; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
  rm -f "$COOKIE_FILE"
  exit 1
fi

echo "[]" > "$TMP_FILE"

echo "Fetching executions..."
EXECUTIONS_RESPONSE=$(curl -s "$N8N_URL/rest/executions?limit=100" -b "$COOKIE_FILE")
# echo "Executions response: $EXECUTIONS_RESPONSE"

TOTAL_EXECUTIONS=$(echo "$EXECUTIONS_RESPONSE" | jq '.data.results | length' 2>/dev/null || echo "0")
# echo "Found $TOTAL_EXECUTIONS executions"

EXECUTIONS=$(echo "$EXECUTIONS_RESPONSE" | jq -c '.data.results[]' 2>/dev/null)

while IFS= read -r exec; do
  [[ -z "$exec" ]] && continue
  id=$(echo "$exec" | jq -r '.id')
  exec_id=$(echo "$id" | tr -d '"')
  workflow=$(echo "$exec" | jq -r '.workflowName // .workflowId')
  status=$(echo "$exec" | jq -r '.status')
  started=$(echo "$exec" | jq -r '.startedAt')
  stopped=$(echo "$exec" | jq -r '.stoppedAt')
  
  # echo "Processing execution #$COUNTER $id: $workflow ($status)"
  
  EXEC_DETAIL=$(curl -s "$N8N_URL/rest/executions/$id" -b "$COOKIE_FILE")
  # echo "Execution detail for $id: $EXEC_DETAIL"
  DATA_ARR=$(echo "$EXEC_DETAIL" | jq -r '.data.data' 2>/dev/null)
  
  case "$workflow" in
    "Agent: Chat")
      INPUT=$(echo "$DATA_ARR" | jq -r '
        def resolve($arr): if type == "string" and (. | test("^[0-9]+$")) then $arr[. | tonumber] | resolve($arr) else . end;
        . as $arr | 
        (to_entries | map(select(.value | type == "object" and has("chatInput"))) | .[0].value.chatInput) as $idx |
        if $idx then ($idx | resolve($arr)) else null end
      ' 2>/dev/null)
      OUTPUT=$(echo "$DATA_ARR" | jq -r '
        def resolve($arr): if type == "string" and (. | test("^[0-9]+$")) then $arr[. | tonumber] | resolve($arr) elif type == "object" and has("output") then .output | resolve($arr) else . end;
        . as $arr | 
        (to_entries | map(select(.value | type == "object" and has("action") and has("output"))) | .[0].value.output) as $idx |
        if $idx then ($idx | resolve($arr)) else null end
      ' 2>/dev/null)
      CHAT_DATA=$(jq -n --arg input "$INPUT" --arg output "$OUTPUT" '{input: $input, output: $output}')
      jq --arg ts "$started" --arg wf "Agent: Chat" --arg st "$status" --arg data "$CHAT_DATA" --arg execId "$exec_id" --arg type "chat" \
        '. += [{timestamp: $ts, workflow: $wf, status: $st, data: $data, execId: $execId, type: $type}]' "$TMP_FILE" > "${TMP_FILE}.new" && mv "${TMP_FILE}.new" "$TMP_FILE"
      ;;
    "Tool: GraphQL Request (Chat Agent)")
      jq --arg ts "$started" --arg wf "$workflow" --arg st "$status" --arg execId "$exec_id" --arg type "graphql" \
        '. += [{timestamp: $ts, workflow: $wf, status: $st, data: "[GraphQL - skipped]", execId: $execId, type: $type}]' "$TMP_FILE" > "${TMP_FILE}.new" && mv "${TMP_FILE}.new" "$TMP_FILE"
      ;;
    *)
      jq --arg ts "$started" --arg wf "$workflow" --arg st "$status" --arg execId "$exec_id" --arg type "unknown" \
        '. += [{timestamp: $ts, workflow: $wf, status: $st, data: "[Unprocessed workflow]", execId: $execId, type: $type}]' "$TMP_FILE" > "${TMP_FILE}.new" && mv "${TMP_FILE}.new" "$TMP_FILE"
      ;;
  esac
done <<< "$EXECUTIONS"

echo "# N8N Executions Export (Historical Order)" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Generated: $(date -Iseconds)" >> "$OUTPUT_FILE"
echo "Source: $N8N_URL" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

jq -c 'sort_by(.execId | tonumber) | .[]' "$TMP_FILE" 2>/dev/null | while IFS= read -r item; do
  [[ -z "$item" ]] && continue
  ts=$(echo "$item" | jq -r '.timestamp')
  wf=$(echo "$item" | jq -r '.workflow')
  st=$(echo "$item" | jq -r '.status')
  data=$(echo "$item" | jq -r '.data')
  exec_id=$(echo "$item" | jq -r '.execId // "?"')
  item_type=$(echo "$item" | jq -r '.type // "unknown"')
  
  echo "## #$exec_id - $ts - $wf" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  echo "- **Status**: $st" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  if [[ "$item_type" == "unknown" ]]; then
    echo "*[Unprocessed workflow - data extraction not implemented]*" >> "$OUTPUT_FILE"
  elif [[ "$item_type" == "chat" ]]; then
    input_text=$(echo "$data" | jq -r '.input // ""')
    output_text=$(echo "$data" | jq -r '.output // ""')
    echo "### Input" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    echo "$input_text" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "### Output" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
    echo "$output_text" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
  elif [[ "$item_type" == "graphql" ]]; then
    echo "*[GraphQL workflow - skipped]*" >> "$OUTPUT_FILE"
  else
    echo '```json' >> "$OUTPUT_FILE"
    echo "$data" >> "$OUTPUT_FILE"
    echo '```' >> "$OUTPUT_FILE"
  fi
  
  echo "" >> "$OUTPUT_FILE"
  echo "---" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
done

rm -f "$COOKIE_FILE" "$TMP_FILE"
echo "Exported to $OUTPUT_FILE"
