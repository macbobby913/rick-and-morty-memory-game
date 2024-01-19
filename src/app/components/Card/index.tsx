import styles from "./styles.module.scss";
import Image from "next/image";

type CardProps = {
  src: string;
  alt: string;
};

function Card({ src, alt }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.inner_wrapper}>
        <Image src={src} alt={alt} width={300} height={300} />
      </div>
    </div>
  );
}

export default Card;
