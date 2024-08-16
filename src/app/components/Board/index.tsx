import { CharactersResJSON } from "@/app/type/characters";
import Card from "../Card";
import styles from "./styles.module.scss";
import {v4 as uuidv4} from 'uuid';

const getCharacters = async () => {
  const url = "https://rickandmortyapi.com/api/character/1,2,3,4,5";
  const res = await fetch(url);
  if (res.status !== 200) return;
  const characters = (await res.json()) as CharactersResJSON;
  const doubledCharacters = [...characters,...characters];
  function shuffle(characters:CharactersResJSON) {
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

async function Board() {
  /* 
    The "characters" array here has doubled & shuffled characters.

    ex : 

      instead of [A, B, C, D, E] or [A, A, B, B, C, C, D, D, E, E]

      it's like [A, C, B, E, D, A, E, D, B, C]
  */
  const characters = await getCharacters();
  return (
    <section className={styles.board}>
      {characters?.map((character) => (
        <Card key={uuidv4()} src={character.image} alt={character.name} />
      ))}
    </section>
  );
}

export default Board;
