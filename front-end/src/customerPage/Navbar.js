import React, { useRef } from 'react';
import styles from './Navbar.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faLocationDot, faCartShopping, faUser, faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { asyncAddAddress, asyncAddCart } from '../Redux/store';
import { useDispatch } from 'react-redux';
import { addAddress, removeAddress, updateAddress } from '../Redux/store';
import { asyncLoadAddress } from '../Redux/store';


function Navbar(props) {

  // -----------------------------------------------------------------
  // 패널 움직임 관련

  const navigate = useNavigate();

  const [activePanel, setActivePanel] = useState(false);

  const panelRef = useRef(null);

  const handleMouseEnter = (panelName) => {
      setActivePanel(panelName); // 메뉴가 마우스에 닿으면 패널 열기
  };
  
  const handlePanelMouseLeave = () => {
    setActivePanel(null); // 패널에서 마우스가 벗어나면 패널 닫기
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActivePanel(null); // 패널 외부 클릭 시 패널 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // -------------------------------------------------------------------------
  // 로그인 처리 관련

  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 상태
  const [MemberId, setMemberId] = useState(''); // 사용자 이름을 관리하는 상태

  useEffect(() => {
    // 페이지 로드 시 쿠키에서 로그인 상태 확인
    const token = Cookies.get('token');
    const MemberId = Cookies.get('MemberId');
    if (token && MemberId) {
      setIsLoggedIn(true);
      setMemberId(MemberId);
    }
  }, [MemberId]);

  const handleLogout = () => {
    Cookies.remove('token'); // 쿠키에서 토큰 삭제
    Cookies.remove('MemberId'); // 쿠키에서 사용자 이름 삭제
    setIsLoggedIn(false); // 로그인 상태 false로 변경
    setMemberId(''); // 사용자 이름 초기화
    alert('로그아웃 되었습니다.');
  };

 // -------------------------------------------------------------------------
 // Redux 사용

  const cartItems = useSelector(state => state.cart.items);
  const cartStatus = useSelector(state => state.cart.status);
  const cartError = useSelector(state => state.cart.error);

  const addresses = useSelector(state => state.address.addresses);
  const addressStatus = useSelector(state => state.address.status);
  const addressError = useSelector(state => state.address.error);

  const dispatch = useDispatch();

  useEffect( () => {
    dispatch(asyncLoadAddress());
  }, [dispatch]);
  

 // -------------------------------------------------------------------------

  return (
    
    <nav className={styles.nav_container}>

      <div className={styles.logo_container}>
        <div className={styles.logo_img} />
        <p onClick={ () => { navigate('/')
          props.setMode('customer')
         }} className={styles.logo_name}>펫과함께</p>
      </div>

      <div className={styles.middle_container}></div>

      <ul className={styles.menu_container}>
        <li>
          <FontAwesomeIcon icon={faBell} className={styles.icon} />
          <p onMouseEnter={() => { handleMouseEnter('alert') }}
            className={styles.menu_text}>알림</p>
        </li>  
        <li>
          <FontAwesomeIcon icon={faCartShopping} className={styles.icon}  />
          <p onMouseEnter={ () => { handleMouseEnter('cart') }} 
            className={styles.menu_text}>장바구니</p>
        </li>
        <li>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon}  />
          <p onMouseEnter={ () => { handleMouseEnter('search') } }
            className={styles.menu_text}>검색창</p>
        </li>
        <li>
          <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
          <p onMouseEnter={ () => { handleMouseEnter('address') } }
            className={styles.menu_text}>주소</p>
        </li>
        <li>
          <FontAwesomeIcon icon={faUser} className={styles.icon}  />
          <p onClick={ () => { navigate('/mypage') }}
            className={styles.menu_text}>마이페이지</p>
        </li>
        <li>
          {
            isLoggedIn ? (
              <p onClick={handleLogout}>로그아웃</p>
            ) : (
              <p onClick={ () => { navigate('/login') }}
            className={styles.menu_text}>로그인</p>
          
            )
          }
        </li>
        <li>
          <p onClick={ () => { navigate('/sign-up') }}
            className={styles.menu_text}>회원가입</p>
        </li>
      </ul>

      {/* 오른쪽 패널 (알림, 주소, 장바구니) */}
      <div ref={panelRef} 
      className={`${styles.panel} ${activePanel ? styles.active : ''}`}
      onMouseLeave={handlePanelMouseLeave} // 패널에서 마우스 벗어날 시 handlePanelMouseLeave 호출
      >
        {activePanel === 'alert' && (
          <div className={styles.panel_content}>
            {/* 알림 내용 */}
            <p>배송 상태</p>
            <p>리뷰 답변</p>
          </div>
        )}
        {activePanel === 'address' && (
          <div className={styles.panel_content}>
            
            {/* 주소 관련 기능 */}
            <div className={styles.address_container}>
              <p>현재 주소</p>
              {
                addressStatus === '로딩중' && <p>로딩중</p> }
              {
                addresses.map( (data, index) => {
                  return (
                  <div key={index}>
                    <h4>현재 주소</h4>
                    { data.isCurrent === true ? (
                      <p>{data.addr}</p>
                    ) : '' }
                    <h4>주소 목록</h4>
                    { data.isCurrent === false ? (
                      <p>
                        {data.addr}
                        <button>주소 삭제</button>
                      </p>
                    ) : '' }                   
                  </div>
                )}
              )
             }

              {/* 기능 추가하기 */}
              <button>주소 추가</button> 
              <input 
                type="text" 
                placeholder="주소를 입력하세요" 
                className={styles.address_input} 
              />
            </div>
            
          </div>
        )}
        {
          activePanel === 'cart' && (
            <div className={styles.panel_content}>
              <h2>장바구니</h2>
                {/* 조건부 랜더링 */}
               { cartStatus === '로딩중' && <p>로딩중</p> }
                <ul>
                  {cartItems.map(item => (
                    <li key={item.id}>
                      <img src={item.img} alt={item.name} style={{ width: '50px' }} />
                      <p>{item.name}</p>
                      <p>{item.price}원</p>
                      <p>수량: {item.quantity}</p> 
                      {/* 필요에 따라 수량 변경, 삭제 버튼 추가 */}
                    </li>
                  ))
              }
              </ul>
              <Link to="/pay">
                <button>구매하기</button>
              </Link>
            </div>
          )
        }
        {activePanel === 'search' && (
          <div className={styles.panel_content}>
            <input placeholder="검색"></input>
            <button><FontAwesomeIcon icon={faArrowRight} /></button>
          </div>
        )}
      </div>
    </nav>
  
);
}

export default Navbar;
