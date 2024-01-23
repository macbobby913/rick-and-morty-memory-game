"use client";
import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

type CardProps = {
  src: string;
  alt: string;
};

function Card({ src, alt }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardElement = cardRef.current;
    const glareElement = glareRef.current;
    if (!cardElement || !glareElement) return;

    const handleMouseMove = (ev: MouseEvent) => {
      const cardHeightHalf = cardElement.clientHeight / 2;
      // the amount to rotate in the x axis, ex : 15deg ~ -15deg
      const rotAmountX = 30;
      const rotRatioX = 100 / rotAmountX;
      const percentageY = (ev.offsetY * 100) / cardHeightHalf;
      const subtractDegX = percentageY / rotRatioX;
      const rotX = rotAmountX - subtractDegX;

      const rotAmountY = 30;
      const rotRatioY = 100 / rotAmountY;
      const cardWidthHalf = cardElement.clientWidth / 2;
      const percentageX = (ev.offsetX * 100) / cardWidthHalf;
      const degY = percentageX / rotRatioY;
      const rotY = degY - rotAmountX;
      cardElement.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

      // set glare position based on cursor position
      glareElement.style.background = `radial-gradient(
      circle at ${ev.offsetX}px ${ev.offsetY}px,
      rgba(255, 255, 255, 0.5),
      transparent
    )`;
    };
    cardElement.addEventListener("mousemove", handleMouseMove);

    const handleMouseLeave = (ev: MouseEvent) =>
      (cardElement.style.transform = `rotateX(0deg)`);
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
