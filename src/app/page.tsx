import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.introduction}>
        <span className={styles.eyebrow}>Previsão do tempo</span>
        <h1>Weather Dashboard</h1>
        <p>A estrutura inicial está pronta para receber os componentes.</p>
      </section>
    </main>
  );
}
