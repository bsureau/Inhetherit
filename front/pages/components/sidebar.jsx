import styles from "../../styles/components/sidebar.module.css"
import Link from 'next/link';

export default function Sidebar() {

  return (
      <nav className={styles.main}>
        <Link href="/">
          <a>INHETHERIT</a>
        </Link>
        <Link href="/will">
          <a>Make a will</a>
        </Link>
        <Link href="/claim">
          <a>Claim</a>
        </Link>
        <Link href="/faq">
          <a>FAQs</a>
        </Link>
      </nav>
  )
}
