import React from 'react';
import styles from '../StoreDetail.module.css';
import Map from '../../api/Map';

/**
 * 매장 공지사항/정보 컴포넌트
 */
function StoreNotice({ store }) {
    if (!store) return null;

    return (
        <div className={styles.notice_container}>
            <h5>공지사항</h5>
            <p>{store.notice}</p>
            <h5>가게 전화번호</h5>
            <p>{store.tel}</p>
            <h5>가게정보</h5>
            <p>{store.info}</p>
            <h5>영업시간</h5>
            <p>{store.runningTime}</p>
            <h5>브레이크 타임</h5>
            <p>{store.pauseTime}</p>
            <h5>휴무일</h5>
            <p>{store.holiday}</p>
            <h5>가게 주소</h5>
            <Map />
            <p>{store.addr}</p>
        </div>
    );
}

export default StoreNotice;
