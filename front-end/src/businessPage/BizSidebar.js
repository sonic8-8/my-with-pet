import React from 'react';
import styles from './BizSidebar.module.css';
import { Link } from 'react-router-dom'; // react-router-dom에서 Link import
import { useNavigate } from 'react-router-dom';

function BizSidebar() {

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <ul className={styles.menu_container}>
        <li>
          <p onClick={ () => { navigate('/business/temp-close')} } 
            className={styles.menu_text}>영업 일시중지</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/business/item-edit')} } 
            className={styles.menu_text}>판매 메뉴 관리</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/business/info-edit')} } 
            className={styles.menu_text}>공지 및 가게 정보 수정</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/business/review')} } 
            className={styles.menu_text}>리뷰 관리</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/business/order-status')} } 
            className={styles.menu_text}>주문 상태 변경</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/business/like-list')} } 
            className={styles.menu_text}>좋아요 현황 조회</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/business/order-list')} } 
            className={styles.menu_text}>주문 및 정산내역</p>
        </li>
      </ul>
    </div>
  );
}

export default BizSidebar;
