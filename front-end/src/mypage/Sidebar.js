import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css'

function Sidebar() {
  return (
    <nav className={styles.container}>
      <ul className={styles.menu_container}>
        <li>
          <p onClick={ () => { navigate('/mypage/order-list') }}
            className={styles.menu_text}>주문내역</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/mypage/order-list') }}
              className={styles.menu_text}>배송지 관리</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/mypage/my-pet') }}
              className={styles.menu_text}>마이펫 관리</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/mypage/like-list') }}
              className={styles.menu_text}>좋아요한 가게</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/mypage/profile-edit') }}
                className={styles.menu_text}>개인정보확인/수정</p>
        </li>
        <li>
          <p onClick={ () => { navigate('/mypage/delete-id') }}
              className={styles.menu_text}>회원탈퇴</p>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
