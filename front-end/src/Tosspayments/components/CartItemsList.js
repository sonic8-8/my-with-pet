import React from 'react';

/**
 * 장바구니 아이템 목록 컴포넌트
 */
function CartItemsList({ cartItems, onRemoveItem, onQuantityChange }) {
    if (cartItems.length === 0) {
        return <p>장바구니가 비어있습니다.</p>;
    }

    return (
        <ul>
            {cartItems.map(item => (
                <div key={item.id} className="item">
                    <img src={item.img} alt={item.name} style={{ width: '100px' }} />
                    <p>{item.name}</p>
                    <p>{item.price}원</p>
                    <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onQuantityChange(item.idx, parseInt(e.target.value, 10))}
                    />
                    <button onClick={() => onRemoveItem(item.idx)}>삭제</button>
                </div>
            ))}
        </ul>
    );
}

export default CartItemsList;
