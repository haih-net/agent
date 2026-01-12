import Head from 'next/head'

export interface SeoHeadersProps {
  title?: string
  description?: string
  noindex?: boolean
  nofollow?: boolean
}

export const SeoHeaders: React.FC<SeoHeadersProps> = ({
  title,
  description,
  noindex,
  nofollow,
}) => {
  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {(noindex || nofollow) && (
        <meta
          name="robots"
          content={[
            noindex ? 'noindex' : 'index',
            nofollow ? 'nofollow' : 'follow',
          ].join(', ')}
        />
      )}
    </Head>
  )
}
