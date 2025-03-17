import React, { useRef } from 'react';
import styles from './BizNavbar.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faLocationDot, faCartShopping, faUser, faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function BizNavbar(props) {

  // -------------------------------------------------------------------
  // 페이지(라우트) 이동 관련

  const navigate = useNavigate();

  //--------------------------------------------------------------------

  return (
    
    <nav className={styles.nav_container}>

      <div className={styles.logo_container}>
        <div className={styles.logo_img} />
        <p onClick={ () => { navigate('/business')
          props.setMode('business')
         }} className={styles.logo_name}>펫과함께 비즈니스</p>
      </div>

      <div className={styles.middle_container}></div>

      <ul className={styles.menu_container}>

        <li>
          <input placeholder="검색"></input>
          <button><FontAwesomeIcon icon={faArrowRight} /></button>
        </li>

        <li>
          <FontAwesomeIcon icon={faUser} className={styles.icon}  />
          <p onClick={ () => { navigate('/business/mypage') }}
            className={styles.menu_text}>마이페이지</p>
        </li>
        <li>
          {
            props.isLoggedIn ? (
              <p onClick={props.handleLogout}>로그아웃</p>
            ) : (
              <p onClick={ () => { navigate('/business/login') }}
            className={styles.menu_text}>로그인</p>
            )
          }
        </li>
        <li>
          <p onClick={ () => { navigate('/business/sign-up') }}
            className={styles.menu_text}>회원가입</p>
        </li>
      </ul>

    </nav>
  
);
}

export default BizNavbar;
