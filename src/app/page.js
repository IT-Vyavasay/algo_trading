import Image from 'next/image';
import styles from './page.module.css';
import LiveBTCPrice from './component/temp/displayData';
import Dashboard from './component/includes/Dashboard';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <LiveBTCPrice /> */}
      <Dashboard />
    </main>
  );
}
