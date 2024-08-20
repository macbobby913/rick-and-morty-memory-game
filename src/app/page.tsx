import Board from "./components/Board";
import { CharactersResJSON } from "./type/characters";
import styles from "./styles.module.scss";

const getCharacters = async () => {
  const url = "https://rickandmortyapi.com/api/character/1,2,3,4,5";
  const res = await fetch(url);
  if (res.status !== 200) return;
  const characters = (await res.json()) as CharactersResJSON;
  const doubledCharacters = [...characters, ...characters];
  function shuffle(characters: CharactersResJSON) {
    for (let i = characters.length - 1; i > 0; i--) {
      // Generate a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements at index i and j
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
  }
  shuffle(doubledCharacters);
  return doubledCharacters;
};

export default async function Home() {
  const characters = await getCharacters();

  return (
    <>
      <section className={styles.bg} >
        <div className={styles.glob_1}/>
        <div className={styles.glob_2}/>
        <div className={styles.glob_3}/>
        <div className={styles.glob_4}/>
        <div className={styles.glob_5}/>
        <div className={styles.glob_6}/>
        <div className={styles.glob_7}/>
      </section>
      <main className="w-full h-screen flex justify-center items-center">
        <Board characters={characters} />
      </main>
    </>
  );
}
