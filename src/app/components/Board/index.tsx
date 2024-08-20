"use client";
import { Character } from "@/app/type/characters";
import Card, { OnCardFlippedEventInfo } from "../Card";
import styles from "./styles.module.scss";
import { useState, useEffect, useCallback } from "react";

/* 
  "Board" is responsible for : 

    1. render character cards

    2. keeping track of cards that are flipped upward by the player (card is front facing up)

    3. determination logic when player flipped 2 cards

       a. if two cards are the same (same character), make both cards remain front facing up

       b. if both cards are different, flip'em back (make them front facing down)
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

  // ----------------------- 2. keeping track of cards that are flipped upward by the player (card is front facing up) ------------------------
  const [cardFlippedEventInfoList, setCardFlippedEventInfoList] = useState<
    OnCardFlippedEventInfo[]
  >([]);

  const handleCardFlipped = useCallback((event: OnCardFlippedEventInfo) => {
    setCardFlippedEventInfoList((prev) => [...prev, event]);
  }, []);

  useEffect(() => {
    if (cardFlippedEventInfoList.length < 2) return;
    // ------------------------------------------- 3. determination logic when player flipped 2 cards --------------------------------------------

    // 3. a. if two cards are the same (same character), make both cards remain front facing up
    if (
      cardFlippedEventInfoList[0].characterName ===
      cardFlippedEventInfoList[1].characterName
    ) {
      // clear event info list
      setCardFlippedEventInfoList([]);
      return;
    }
    // 3. b. if both cards are different, flip'em back (make them front facing down)
    setTimeout(() => {
      cardFlippedEventInfoList.forEach((info) => {
        info.makeCardFrontFacingDown();
      });
    }, 400);
    // clear event info list
    setCardFlippedEventInfoList([]);
  }, [cardFlippedEventInfoList]);

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
