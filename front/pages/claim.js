import Head from 'next/head'

export default function Claim() {

  return (
    <div className="container">
      <Head>
        <title>Inhetherit</title>
        <meta name="description" content="Find peace of mind. Bequeath your cryptos!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Claim
        </h1>
      </main>
    </div>
  )
}
