import { useSearchParams } from "react-router-dom";
import styles from "./Toss.module.css";

function Fail() {
  const [searchParams] = useSearchParams();

  return (
    <div className={`${styles.result} ${styles.wrapper}`}>
      <div className={styles.box_section}>
        <h2>
          결제 실패
        </h2>
        <p>{`에러 코드: ${searchParams.get("code")}`}</p>
        <p>{`실패 사유: ${searchParams.get("message")}`}</p>
      </div>
    </div>
  );
}

export default Fail;