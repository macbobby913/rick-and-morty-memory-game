import Image from "next/image";
import styles from "./styles.module.scss";
import loadingImg from "../../../../public/loading.png"

function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.image_wrapper}>
        <Image src={loadingImg} alt="loading" fill />
      </div>
      <div className={styles.dots}>
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

export default Loading;
