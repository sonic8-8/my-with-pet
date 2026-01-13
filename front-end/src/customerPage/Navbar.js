import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCartShopping, faUser, faBell, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from './Navbar.module.css';

// Redux actions
import { asyncLoadAddress } from '../Redux/store';

// Custom Hooks
import { usePanelState } from './hooks/usePanelState';
import { useAuth } from './hooks/useAuth';

// Panel Components
import AlertPanel from './components/AlertPanel';
import CartPanel from './components/CartPanel';
import AddressPanel from './components/AddressPanel';
import SearchPanel from './components/SearchPanel';

/**
 * 네비게이션 바 컴포넌트
 */
function Navbar(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Custom Hooks
  const { activePanel, panelRef, handleMouseEnter, handlePanelMouseLeave } = usePanelState();
  const { isLoggedIn, handleLogout } = useAuth();

  // Redux state
  const cartItems = useSelector(state => state.cart.items);
  const cartStatus = useSelector(state => state.cart.status);
  const addresses = useSelector(state => state.address.addresses);
  const addressStatus = useSelector(state => state.address.status);

  // Load addresses on mount
  useEffect(() => {
    dispatch(asyncLoadAddress());
  }, [dispatch]);

  return (
    <nav className={styles.nav_container}>
      {/* 로고 */}
      <div className={styles.logo_container}>
        <div className={styles.logo_img} />
        <p
          onClick={() => { navigate('/'); props.setMode('customer'); }}
          className={styles.logo_name}
        >
          펫과함께
        </p>
      </div>

      <div className={styles.middle_container}></div>

      {/* 메뉴 */}
      <ul className={styles.menu_container}>
        <li>
          <FontAwesomeIcon icon={faBell} className={styles.icon} />
          <p onMouseEnter={() => handleMouseEnter('alert')} className={styles.menu_text}>알림</p>
        </li>
        <li>
          <FontAwesomeIcon icon={faCartShopping} className={styles.icon} />
          <p onMouseEnter={() => handleMouseEnter('cart')} className={styles.menu_text}>장바구니</p>
        </li>
        <li>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon} />
          <p onMouseEnter={() => handleMouseEnter('search')} className={styles.menu_text}>검색창</p>
        </li>
        <li>
          <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
          <p onMouseEnter={() => handleMouseEnter('address')} className={styles.menu_text}>주소</p>
        </li>
        <li>
          <FontAwesomeIcon icon={faUser} className={styles.icon} />
          <p onClick={() => navigate('/mypage')} className={styles.menu_text}>마이페이지</p>
        </li>
        <li>
          {isLoggedIn ? (
            <p onClick={handleLogout}>로그아웃</p>
          ) : (
            <p onClick={() => navigate('/login')} className={styles.menu_text}>로그인</p>
          )}
        </li>
        <li>
          <p onClick={() => navigate('/sign-up')} className={styles.menu_text}>회원가입</p>
        </li>
      </ul>

      {/* 패널 */}
      <div
        ref={panelRef}
        className={`${styles.panel} ${activePanel ? styles.active : ''}`}
        onMouseLeave={handlePanelMouseLeave}
      >
        {activePanel === 'alert' && <AlertPanel />}
        {activePanel === 'cart' && <CartPanel cartItems={cartItems} cartStatus={cartStatus} />}
        {activePanel === 'address' && <AddressPanel addresses={addresses} addressStatus={addressStatus} />}
        {activePanel === 'search' && <SearchPanel />}
      </div>
    </nav>
  );
}

export default Navbar;
