import React from 'react';

/**
 * 주문 요약 컴포넌트 - 총 주문금액 표시
 */
function OrderSummary({ totalPrice }) {
    return (
        <h5>총 주문금액 : {totalPrice}원</h5>
    );
}

export default OrderSummary;
