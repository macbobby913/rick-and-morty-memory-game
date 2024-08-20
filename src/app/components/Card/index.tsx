"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

/* 
  "Card" is responsible for :

    1. render UI

    2. rotation logic
      a. card "look at" cursor position
      b. flipping card upward or downward (making card's front facing up or down)

    3. Logic for WHEN to fire "onCardFlipped" callback when a card FINISHES flipping animation
      a. passing "makeCardFrontFacingDown" callback to "Board"
  
  card's front : the side that has the avatar
  card's back : the side that shows abstract image
*/

export type OnCardFlippedEventInfo = {
  makeCardFrontFacingDown: () => void;
  characterName: string;
};

type CardProps = {
  src: string;
  alt: string;
  onCardFlipped: (event: OnCardFlippedEventInfo) => void;
};

/* 
  handles the ACTUAL rotation for the cardElement 
  which takes whether cardElement is "front facing up" 
  or "back facing up" into consideration.
*/
const setCardRotation = (
  rotX: number,
  rotY: number,
  cardElement: HTMLDivElement,
  isFront: boolean
) => {
  // notice the negative rotY and 180 deg rotation offset here
  const finaleRotY = isFront ? rotY : -rotY + 180;
  cardElement.style.transform = `rotateX(${rotX}deg) rotateY(${finaleRotY}deg)`;
};

/* 
  this method is intended to be called in "mousemove" event,
  it returns the rotation for x and y axis where the cardElement
  is "looking at" the cursor's position.

  it DOES NOT take whether cardElement is "front facing up" 
  or "back facing up" into consideration.
*/
const getCardLookAtCursorRotation = (
  cursorX: number,
  cursorY: number,
  cardHeightHalf: number,
  cardWidthHalf: number
) => {
  // define the amount to rotate in the x axis, ex : 15deg ~ -15deg
  const rotAmountX = 15;
  // for converting percentage into degrees
  const rotRatioX = 100 / rotAmountX;
  // get the percentage of the value of "cursorY" and the value of "cardHeightHalf"
  const percentageY = (cursorY * 100) / cardHeightHalf;
  // convert the percentage into degrees
  const subtractDegX = percentageY / rotRatioX;
  // get the amount of rotation in degrees
  const rotX = rotAmountX - subtractDegX;
  // define the amount to rotate in the y axis, ex : 15deg ~ -15deg
  const rotAmountY = 15;
  const rotRatioY = 100 / rotAmountY;
  const percentageX = (cursorX * 100) / cardWidthHalf;
  const degY = percentageX / rotRatioY;
  const rotY = degY - rotAmountX;

  return {
    rotX,
    rotY,
  };
};

const setGlarePosition = (
  x: number,
  y: number,
  midX: number,
  midY: number,
  glareElement: HTMLDivElement
) => {
  // the distance between the middle of the card's x(or y) position and the cursor's x(or y) position
  const distX = Math.abs(midX - x);
  const distY = Math.abs(midY - y);
  // the x & y position that will be applied to the glare's position
  const finaleX = x < midX ? midX + distX : midX - distX;
  const finaleY = y < midY ? midY + distY : midY - distY;
  glareElement.style.background = `radial-gradient(
    circle at ${finaleX}px ${finaleY}px,
    rgba(255, 255, 255, 0.3),
    transparent
  )`;
};

function Card({ src, alt, onCardFlipped }: CardProps) {
  // -------------------------------------------------------- 2. rotation logic -------------------------------------------------------------
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isFront, setIsFront] = useState<boolean>(false);
  useEffect(() => {
    const cardElement = cardRef.current;
    const glareElement = glareRef.current;
    if (!cardElement || !glareElement) return;

    // ------------------------------------------------ 2. a. card "look at" cursor position ---------------------------------------------------
    const cardLookAtCursor = (ev: MouseEvent) => {
      // the x & y position of the cursor relative to the card
      const x = ev.offsetX;
      const y = ev.offsetY;
      const cardHeightHalf = cardElement.clientHeight / 2;
      const cardWidthHalf = cardElement.clientWidth / 2;
      const { rotX, rotY } = getCardLookAtCursorRotation(
        x,
        y,
        cardHeightHalf,
        cardWidthHalf
      );
      setCardRotation(rotX, rotY, cardElement, isFront);
      setGlarePosition(x, y, cardWidthHalf, cardHeightHalf, glareElement);
    };
    cardElement.addEventListener("mousemove", cardLookAtCursor);

    // ------------------------------- 2. b. flipping card upward or downward (making card's front facing up or down) ---------------------------
    const flipCard = () => {
      setCardRotation(0, 0, cardElement, isFront);
      glareElement.style.background = ` radial-gradient(
        circle at 10% 10%,
        rgba(255, 255, 255, 0.3),
        transparent
      )`;
    };
    cardElement.addEventListener("mouseleave", flipCard);

    return () => {
      cardElement.removeEventListener("mousemove", cardLookAtCursor);
      cardElement.removeEventListener("mouseleave", flipCard);
    };
  }, [cardRef, isFront]);

  // ------------------------ 3. Logic for WHEN to fire "onCardFlipped" callback when a card FINISHES flipping animation ---------------------
  const firstRenderCompleted = useRef<boolean>(false);
  useEffect(() => {
    if (firstRenderCompleted.current === false) return;
    // --------------------------------- 3. a. passing "makeCardFrontFacingDown" callback to "Board" ----------------------------------------
    const makeCardFrontFacingDown = () => setIsFront(false);
    setTimeout(
      () => onCardFlipped({ makeCardFrontFacingDown, characterName: alt }),
      200
    ); // setTimeout is a hacky way to do it
  }, [isFront, onCardFlipped, alt]);

  useEffect(() => {
    firstRenderCompleted.current = true;
  }, []);

  // ----------------------------------------------------------- 1. render UI ------------------------------------------------------------------
  return (
    <div
      className={styles.card}
      style={{
        transform: `rotateX(0deg) rotateY(${isFront ? "0deg" : "180deg"})`,
      }}
      ref={cardRef}
      onClick={() => {
        setIsFront((prev) => !prev);
      }}
    >
      <div className={styles.glare} ref={glareRef} />
      <div className={styles.front}>
        <Image src={src} alt={alt} fill />
      </div>
      <div className={styles.back}>
        <div className={styles.stripe_3} />
        <div className={styles.stripe_1} />
        <div className={styles.stripe_2} />
      </div>
    </div>
  );
}

export default Card;
