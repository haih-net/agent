import { builder } from '../../../../builder'
import { readFileSync } from 'fs'
import { join } from 'path'

const guidelinesPath = join(__dirname, 'guidelines.md')
const guidelinesContent = readFileSync(guidelinesPath, 'utf-8')

builder.queryField('postGuidelines', (t) =>
  t.string({
    resolve: () => guidelinesContent,
  }),
)
