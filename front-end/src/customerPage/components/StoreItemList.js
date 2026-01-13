import React from 'react';
import styles from '../StoreDetail.module.css';

/**
 * 매장 상품 목록 컴포넌트
 */
function StoreItemList({ items, onAddToCart, memberId }) {
    if (!items || items.length === 0) {
        return <p>로딩중입니다</p>;
    }

    return (
        <div className={styles.item_container}>
            {items.map((item, index) => (
                <div key={index} className={styles.item}>
                    <div className={styles.itemContent}>
                        <img src={item.img} className={styles.itemImage} alt={item.name} />
                    </div>
                    <div className={styles.itemInfo}>
                        <h4>{item.name}</h4>
                        <p>{item.price}원</p>
                        <p>{item.info}</p>
                        <input
                            value={memberId || ''}
                            onChange={(e) => { item.memberId = e.target.value; }}
                            className={styles.hidden}
                            readOnly
                        />
                        <button onClick={() => onAddToCart(item)}>
                            장바구니 담기
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StoreItemList;
