import React from 'react';
import styles from '../StoreDetail.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faStar } from '@fortawesome/free-solid-svg-icons';

/**
 * 매장 헤더 컴포넌트 - 로고, 이름, 별점, 배달비 표시
 */
function StoreHeader({ store }) {
    if (!store) {
        return <p>로딩중입니다</p>;
    }

    return (
        <div className={styles.store}>
            <div className={styles.storeContent}>
                <img src={store.logo} alt={store.name} className={styles.storeImage} />
                <div className={styles.storeInfo}>
                    {store.auth && (
                        <FontAwesomeIcon icon={faCircleCheck} size="xl" style={{ color: "#477ce6" }} />
                    )}
                    <h4>{store.name}</h4>
                    <p>
                        <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
                        {store.star}점
                    </p>
                    <p>배달비 {store.deliveryFee}원</p>
                </div>
            </div>
        </div>
    );
}

export default StoreHeader;
