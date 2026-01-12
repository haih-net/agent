import Head from 'next/head'

export const Page401: React.FC = () => {
  return (
    <>
      <Head>
        <title>Access denied</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <h2>Access denied</h2>
    </>
  )
}
