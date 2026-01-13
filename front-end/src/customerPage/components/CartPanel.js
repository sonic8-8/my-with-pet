import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Navbar.module.css';

/**
 * 장바구니 패널 컴포넌트
 */
function CartPanel({ cartItems, cartStatus }) {
    return (
        <div className={styles.panel_content}>
            <h2>장바구니</h2>
            {cartStatus === '로딩중' && <p>로딩중</p>}
            <ul>
                {cartItems.map(item => (
                    <li key={item.id}>
                        <img src={item.img} alt={item.name} style={{ width: '50px' }} />
                        <p>{item.name}</p>
                        <p>{item.price}원</p>
                        <p>수량: {item.quantity}</p>
                    </li>
                ))}
            </ul>
            <Link to="/pay">
                <button>구매하기</button>
            </Link>
        </div>
    );
}

export default CartPanel;
