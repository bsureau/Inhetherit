import Head from 'next/head'
import styles from '../styles/index.module.css'
import Link from 'next/link';

export default function Index() {

  return (
    <div className="container">
      <Head>
        <title>Inhetherit</title>
        <meta name="description" content="Find peace of mind. Bequeath your cryptos!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Find peace of mind. <br />
          Bequeath your Eth!
        </h1>
        <div className={styles.actions}>
          <Link href="/will">
            <a className="primary-button">Make a will</a>
          </Link>
          <Link href="/claim">
            <a className="primary-button">Claim</a>
          </Link>
          <Link href="/faq">
            <a className="secondary-button">FAQs</a>
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Maître Yoda
        </a>
      </footer>
    </div>
  )
}
