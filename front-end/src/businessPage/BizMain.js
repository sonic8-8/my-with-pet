import { useNavigate } from "react-router-dom";
import styles from './BizMain.module.css';




function BizMain() {

    const navigate = useNavigate();


    return(

        <div className={styles.container}>
            <div>
                <p>펫과함께 사장님</p>
                <p>입금 예정 금액은 
                    <p className={styles.point_text}>원</p> 입니다.</p>
            </div>
        
            <div className={styles.graph_container}>

            </div>

            <div className={styles.graph_container}>

            </div>

            <div className={styles.graph_container}>

            </div>

            <div className={styles.graph_container}>

            </div>

        </div>
    )
}

export default BizMain;