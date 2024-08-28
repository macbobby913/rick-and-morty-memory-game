import { Plus, Minus } from "lucide-react";
import styles from "./styles.module.scss";
import { useState } from "react";

function LevelSelector() {
  const [toggle, setToggle] = useState(false);
  return (
    <section
      className={styles.container}
      style={{ maxWidth: toggle ? "1000px" : "60px" }}
      onClick={() => setToggle(!toggle)}
    >
      {toggle ? (
        <div className={styles.inner}>
          <button type="button">
            <Minus strokeWidth={3} size={28} />
          </button>
          <p>1</p>
          <button type="button">
            <Plus strokeWidth={3} size={28} />
          </button>
        </div>
      ) : (
        "Lvl 1"
      )}
    </section>
  );
}

export default LevelSelector;
