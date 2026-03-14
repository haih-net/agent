import Head from 'next/head'

export interface SeoHeadersProps {
  title?: string
  description?: string | null
  noindex?: boolean
  nofollow?: boolean
}

export const SeoHeaders: React.FC<SeoHeadersProps> = ({
  title,
  description,
  noindex = false,
  nofollow = false,
}) => {
  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}

      <meta
        name="robots"
        content={[
          noindex ? 'noindex' : 'index',
          nofollow ? 'nofollow' : 'follow',
        ].join(', ')}
      />
    </Head>
  )
}
