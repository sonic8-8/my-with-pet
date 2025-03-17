import styles from './StoreList.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function StoreList() {

    // ----------------------------------------------------------------------
    // 가게 정보 요청 관련

    let [storeList, setStoreList] = useState([]);
    
    
    let {type} = useParams(); // URL 파라미터를 받아오는 훅

    useEffect( () => {
        axios.get('http://localhost:8085/api/store-list',
            {params: { type: type }} // URL 파라미터로 type 전달
        )
        .then( (response) => {
            setStoreList(response.data)
            console.log(response.data);
        })
        .catch( () => { 
            console.error('통신 이상하거나 데이터가 없음');
        })
    }, [type]); // type 변경마다 useEffect 실행

    // ----------------------------------------------------------------------
    // 네비게이션

    let navigate = useNavigate();
    const handleStoreClick = ( (idx) => {
        navigate(`/shop/${idx}`)
    })

    // ----------------------------------------------------------------------

    return (
        <div className={styles.store_container}>
            {
                storeList.length > 0 ? (
                    storeList.map((store, index) => (
                        <div key={index} className={styles.store} onClick={() => handleStoreClick(store.idx)}>
                          <div className={styles.storeContent}>
                            <img src={store.logo} alt={store.name} className={styles.storeImage} />
                            <div className={styles.storeInfo}>
                              {store.auth == true ? <FontAwesomeIcon icon={faCircleCheck} size="xl" style={{color: "#477ce6"}} />
                              : <p></p>}
                              <h4>{store.name}</h4>
                              <p>
                                <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} />
                                {store.star}점</p>
                              <p>배달비 {store.deliveryFee}원</p>
                            </div>
                          </div>
                        </div>
                      ))
                ) : (
                    <p>로딩중입니다</p>
                )
            }
        </div>
    )
}

export default StoreList;