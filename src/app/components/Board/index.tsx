"use client";
import { Character } from "@/app/type/characters";
import Card from "../Card";
import styles from "./styles.module.scss";
import { useState, useEffect, useCallback } from "react";

/* 
  "Board" is responsible for : 

    1. render character cards

    2. keeping track of how many cards are flipped upward by the player (card is front facing up)

    3 if the player flipped 2 cards, flip those cards back (card is front facing down)
*/

type BoardProps = { characters: Character[] | undefined };

function Board({ characters }: BoardProps) {
  /* 
    The "characters" array here has doubled & shuffled characters, 
    which is what "Board" desired :)

    ex : 

      instead of [A, B, C, D, E] or [A, A, B, B, C, C, D, D, E, E]

      it's like [A, C, B, E, D, A, E, D, B, C]
  */

  // ----------------------- 2. keeping track of how many cards are flipped upward by the player (card is front facing up) --------------------
  const [flippedCardCount, setFlippedCardCount] = useState<number>(0);
  const [
    makeCardFrontFacingDownCallbacks,
    setMakeCardFrontFacingDownCallbacks,
  ] = useState<(() => void)[]>([]); // collects callbacks received from <Card>s 

  const handleCardFlipped = useCallback((receivedCallback: () => void) => {
    setFlippedCardCount((prev) => prev + 1);
    setMakeCardFrontFacingDownCallbacks((prev) => [...prev, receivedCallback]);
  }, []);

  // -------------------------- 3. if the player flipped 2 cards, flip those cards back (card is front facing down) ---------------------------
  useEffect(() => {
    if (flippedCardCount < 2) return;
    setTimeout(() => {
      makeCardFrontFacingDownCallbacks.forEach((callback) => {
        callback();
      });
      setMakeCardFrontFacingDownCallbacks([]);
      setFlippedCardCount(0);
    }, 400);
  }, [flippedCardCount, makeCardFrontFacingDownCallbacks]);

  // ------------------------------------------------------ 1. render character cards ---------------------------------------------------------
  return (
    <section className={styles.board}>
      {characters?.map((character, index) => (
        <Card
          key={index}
          src={character.image}
          alt={character.name}
          onCardFlipped={handleCardFlipped}
        />
      ))}
    </section>
  );
}

export default Board;
