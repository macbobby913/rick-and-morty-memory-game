import Board from "./components/Board";
import { CharactersResJSON } from "./type/characters";

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
    <main className="w-full h-screen bg-orange-100 flex justify-center items-center">
      <Board characters={characters}/>
    </main>
  );
}
