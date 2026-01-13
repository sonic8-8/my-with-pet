import React from 'react';

/**
 * 주문자 정보 입력 폼 컴포넌트
 */
function OrderForm({ formState, handleChange }) {
    return (
        <div className="info_container">
            <h2>장바구니</h2>

            <p className="hidden">주문상태
                <input
                    value={formState.status}
                    onChange={handleChange('status')}
                />
            </p>

            <p>주문자</p>
            <input
                value={formState.recipientName}
                onChange={handleChange('recipientName')}
            />

            <p>배달 주소</p>
            <input
                value={formState.deliveryAddr}
                onChange={handleChange('deliveryAddr')}
            />

            <p>휴대전화번호</p>
            <input
                value={formState.phone}
                onChange={handleChange('phone')}
            />

            <p>가게요청사항</p>
            <input
                value={formState.orderMemo}
                onChange={handleChange('orderMemo')}
            />
        </div>
    );
}

export default OrderForm;
