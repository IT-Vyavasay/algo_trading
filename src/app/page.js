import Image from 'next/image';
import styles from './page.module.css';
import LiveBTCPrice from './component/temp/displayData';

export default function Home() {
  return (
    <main className={styles.main}>
      <LiveBTCPrice />
    </main>
  );
}
