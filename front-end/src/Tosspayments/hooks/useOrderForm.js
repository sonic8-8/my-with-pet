import { useState } from 'react';
import api from '../../api/axiosConfig';

/**
 * 주문 폼 상태 관리 Custom Hook
 * @param {Array} cartItems - 장바구니 아이템
 * @returns {Object} { formState, handleChange, handleOrder }
 */
export function useOrderForm(cartItems) {
    const [formState, setFormState] = useState({
        status: "",
        recipientName: "",
        deliveryAddr: "",
        phone: "",
        orderMemo: ""
    });

    const handleChange = (field) => (e) => {
        setFormState(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleOrder = async () => {
        const orderData = {
            cartItems,
            status: formState.status,
            orderMemo: formState.orderMemo,
            deliveryAddr: formState.deliveryAddr,
            recipientPhone: formState.phone
        };

        try {
            const response = await api.post('/order', JSON.stringify(orderData));
            if (response.status !== 200) {
                alert('주문에 실패하였습니다.');
                console.error('주문 실패:', response.data);
            }
        } catch (error) {
            alert('주문에 실패하였습니다.');
            console.error('주문 실패:', error);
        }
    };

    return { formState, handleChange, handleOrder };
}

export default useOrderForm;
