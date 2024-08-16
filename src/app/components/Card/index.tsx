"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

type CardProps = {
  src: string;
  alt: string;
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
    rgba(255, 255, 255, 0.5),
    transparent
  )`;
};

function Card({ src, alt }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isFront, setIsFront] = useState<boolean>(true);

  useEffect(() => {
    const cardElement = cardRef.current;
    const glareElement = glareRef.current;
    if (!cardElement || !glareElement) return;

    // reset the card's rotation
    setCardRotation(0, 0, cardElement, isFront);

    const handleMouseMove = (ev: MouseEvent) => {
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
    cardElement.addEventListener("mousemove", handleMouseMove);

    const handleMouseLeave = (ev: MouseEvent) => {
      // reset the card's rotation
      setCardRotation(0, 0, cardElement, isFront);
      glareElement.style.background = ` radial-gradient(
        circle at 10% 10%,
        rgba(255, 255, 255, 0.5),
        transparent
      )`;
    };
    cardElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cardElement.removeEventListener("mousemove", handleMouseMove);
      cardElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cardRef, isFront]);

  return (
    <div
      className={styles.card}
      ref={cardRef}
      onClick={() => {
        // https://developer.mozilla.org/en-US/docs/Web/API/Location/href
        setIsFront((prev) => !prev)
      }}
    >
      <div className={styles.glare} ref={glareRef} />
      <div className={styles.front}>
        <Image src={src} alt={alt} width={300} height={300} />
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
