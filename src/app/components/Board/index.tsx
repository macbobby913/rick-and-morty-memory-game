import { CharactersResJSON } from "@/app/type/characters";
import Card from "../Card";
import styles from "./styles.module.scss";

const getCharacters = async () => {
  const url = "https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10";
  const res = await fetch(url);
  if (res.status !== 200) return;
  const resJSON = (await res.json()) as CharactersResJSON;
  return resJSON;
};

async function Board() {
  const characters = await getCharacters();
  return (
    <section className={styles.board}>
      {characters?.map((character) => (
        <Card key={character.id} src={character.image} alt={character.name} />
      ))}
    </section>
  );
}

export default Board;
