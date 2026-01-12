import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'

export function validateMdxContent(
  content: string | null | undefined,
): string | null | undefined {
  if (content) {
    try {
      unified().use(remarkParse).use(remarkMdx).parse(content)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid content'
      throw new Error(`Invalid content: ${message}`)
    }
  }

  return content
}
