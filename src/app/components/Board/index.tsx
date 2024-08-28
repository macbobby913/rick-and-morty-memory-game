"use client";
import { Character, CharactersResJSON } from "@/app/type/characters";
import Card, { OnCardFlippedUpwardEventInfo } from "../Card";
import styles from "./styles.module.scss";
import { useState, useEffect, useCallback } from "react";
import Loading from "../Loading";
import ReloadButton from "../ReloadButton";
import LevelSelector from "../LevelSelector";

/* 
  "Board" is responsible for : 

    1. fetch characters  

    2. keeping track of cards that are flipped upward by the player (card is front facing up)

    3. determination logic when player flipped 2 cards

       a. if two cards are the same (same character), make both cards remain front facing up

       b. if both cards are different, flip'em back (make them front facing down)

    4. render character cards
*/

function Board() {
  // ------------------------------------------------------------- 1. fetch characters ---------------------------------------------------------
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchToggle, setRefetchToggle] = useState(false);
  /* 
    The "characters" array here will have doubled & shuffled characters after the fetch is finished, 
    which is what "Board" desired :)

    ex : 

      instead of [A, B, C, D, E] or [A, A, B, B, C, C, D, D, E, E]

      it'll be like [A, C, B, E, D, A, E, D, B, C]
  */
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const getCharacters = async () => {
      try {
        setIsLoading(true);
        const url = "https://rickandmortyapi.com/api/character/1,2,3,4,5";
        const res = await fetch(url, { signal });
        if (res.status !== 200) {
          throw new Error("Failed to fetch characters");
        }
        const characters = (await res.json()) as CharactersResJSON;
        const doubledCharacters = [...characters, ...characters];
        const shuffle = (characters: CharactersResJSON) => {
          for (let i = characters.length - 1; i > 0; i--) {
            // Generate a random index from 0 to i
            const j = Math.floor(Math.random() * (i + 1));
            // Swap elements at index i and j
            [characters[i], characters[j]] = [characters[j], characters[i]];
          }
        };
        shuffle(doubledCharacters);
        setCharacters(doubledCharacters);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getCharacters();
    return () => {
      controller.abort();
    };
  }, [refetchToggle]);

  // ----------------------- 2. keeping track of cards that are flipped upward by the player (card is front facing up) ------------------------
  const [cardFlippedUpwardEventInfoList, setCardFlippedUpwardEventInfoList] =
    useState<OnCardFlippedUpwardEventInfo[]>([]);

  const handleCardFlippedUpward = useCallback(
    (event: OnCardFlippedUpwardEventInfo) => {
      setCardFlippedUpwardEventInfoList((prev) => [...prev, event]);
    },
    []
  );

  // ------------------------------------------- 3. determination logic when player flipped 2 cards --------------------------------------------
  useEffect(() => {
    if (cardFlippedUpwardEventInfoList.length < 2) return;
    // 3. a. if two cards are the same (same character), make both cards remain front facing up
    if (
      cardFlippedUpwardEventInfoList[0].characterName ===
      cardFlippedUpwardEventInfoList[1].characterName
    ) {
      // clear event info list
      setCardFlippedUpwardEventInfoList([]);
      return;
    }
    // 3. b. if both cards are different, flip'em back (make them front facing down)
    setTimeout(() => {
      cardFlippedUpwardEventInfoList.forEach((info) => {
        info.flipCardDownward();
      });
    }, 400);
    // clear event info list
    setCardFlippedUpwardEventInfoList([]);
  }, [cardFlippedUpwardEventInfoList]);

  useEffect(() => {
    setCardFlippedUpwardEventInfoList([]);
  }, [refetchToggle]);

  // ------------------------------------------------------ 4. render character cards ---------------------------------------------------------
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <section className={styles.board}>
            {characters?.map((character, index) => (
              <Card
                key={index}
                src={character.image}
                alt={character.name}
                onCardFlippedUpward={handleCardFlippedUpward}
              />
            ))}
          </section>
          <LevelSelector/>
          <ReloadButton
            onClick={() => setRefetchToggle((prev) => !prev)}
            disabled={isLoading}
          />
        </>
      )}
    </>
  );
}

export default Board;
