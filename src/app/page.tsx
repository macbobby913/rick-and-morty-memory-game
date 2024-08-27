import Board from "./components/Board";
import styles from "./styles.module.scss";

export default async function Home() {
  return (
    <>
      <section className={styles.bg}>
        <div className={styles.glob_1} />
        <div className={styles.glob_2} />
        <div className={styles.glob_3} />
        <div className={styles.glob_4} />
        <div className={styles.glob_5} />
        <div className={styles.glob_6} />
        <div className={styles.glob_7} />
      </section>
      <main className="relative w-full h-screen flex justify-center items-center">
        <Board />
      </main>
    </>
  );
}
