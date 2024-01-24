"use client";
import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

type CardProps = {
  src: string;
  alt: string;
};

const cardRotation = (
  x: number,
  y: number,
  cardHeightHalf: number,
  cardWidthHalf: number,
  cardElement: HTMLDivElement
) => {
  // define the amount to rotate in the x axis, ex : 15deg ~ -15deg
  const rotAmountX = 30;
  // for converting percentage into degrees
  const rotRatioX = 100 / rotAmountX;
  // get the percentage of the value of "y" and the value of "cardHeightHalf"
  const percentageY = (y * 100) / cardHeightHalf;
  // convert the percentage into degrees
  const subtractDegX = percentageY / rotRatioX;
  // get the amount of rotation in degrees
  // "-1" is for reversing the rotation angle relative to the cursor position
  const rotX = (rotAmountX - subtractDegX) * -1;

  // define the amount to rotate in the y axis, ex : 15deg ~ -15deg
  const rotAmountY = 30;
  const rotRatioY = 100 / rotAmountY;
  const percentageX = (x * 100) / cardWidthHalf;
  const degY = percentageX / rotRatioY;
  const rotY = (degY - rotAmountX) * -1;
  // actual rotation
  cardElement.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
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

  useEffect(() => {
    const cardElement = cardRef.current;
    const glareElement = glareRef.current;
    if (!cardElement || !glareElement) return;

    const handleMouseMove = (ev: MouseEvent) => {
      // the x & y position of the cursor relative to the card
      const x = ev.offsetX;
      const y = ev.offsetY;
      const cardHeightHalf = cardElement.clientHeight / 2;
      const cardWidthHalf = cardElement.clientWidth / 2;
      cardRotation(x, y, cardHeightHalf, cardWidthHalf, cardElement);
      setGlarePosition(x, y, cardWidthHalf, cardHeightHalf, glareElement);
    };
    cardElement.addEventListener("mousemove", handleMouseMove);

    const handleMouseLeave = (ev: MouseEvent) => {
      cardElement.style.transform = `rotateX(0deg) rotateY(0deg)`;
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
  }, [cardRef]);

  return (
    <div className={styles.card} ref={cardRef}>
      <div className={styles.inner_wrapper}>
        <Image src={src} alt={alt} width={300} height={300} />
        <div className={styles.glare} ref={glareRef} />
      </div>
    </div>
  );
}

export default Card;
