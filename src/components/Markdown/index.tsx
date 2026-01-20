import ReactMarkdown, {
  Components,
  defaultUrlTransform,
  UrlTransform,
} from 'react-markdown'

import { MarkdownStyled } from './styles'
import React from 'react'
import Link from 'next/link'
import remarkGfm from 'remark-gfm'

/**
 * Начиная с 9 версии ремарк стал обнулять тел и мейлто ссылки.
 * https://github.com/remarkjs/react-markdown/issues/829
 */
const urlTransform: UrlTransform = (url, _name, _node) => {
  const fixed = defaultUrlTransform(url)

  // если схема tel/mailto — пропускаем как есть
  if (url.startsWith('tel:') || url.startsWith('mailto:')) {
    return url
  }
  return fixed
}

const components: Components = {
  a: ({ node: _node, href: hrefProps, ...props }) => {
    const href: string | undefined = hrefProps

    return (
      <>
        {href ? (
          <Link
            href={href}
            {...props}
            target={href && /^https?:/.test(href) ? '_blank' : undefined}
          />
        ) : (
          <span {...props} />
        )}
      </>
    )
  },
}

type MarkdownProps = {
  children: string | null | undefined
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  return children ? (
    <MarkdownStyled>
      <ReactMarkdown
        urlTransform={urlTransform}
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </MarkdownStyled>
  ) : null
}
