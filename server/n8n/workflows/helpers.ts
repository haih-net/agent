import * as fs from 'fs'

export function readN8nTemplate(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8')
  return content
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/\/\/\s*@ts-check\s*/g, '')
    .replace(/\/\/\s*@ts-nocheck\s*/g, '')
    .replace(/^\s*\n/gm, '')
    .trim()
}

export const SESSION_ID_EXPRESSION =
  "={{ [($('Prepare Context').first().json.sessionId || ''), ($('Prepare Context').first().json.agentId || '')].filter(v => v).join('_') }}"

export const SESSION_ID_SCHEMA = {
  id: 'sessionId',
  displayName: 'sessionId',
  required: true,
  defaultMatch: false,
  display: true,
  canBeUsedToMatch: true,
  type: 'string',
} as const

export const USER_EXPRESSION = '={{ $json.user }}'

export const USER_SCHEMA = {
  id: 'user',
  displayName: 'user',
  required: false,
  defaultMatch: false,
  display: true,
  canBeUsedToMatch: true,
  type: 'object',
} as const
