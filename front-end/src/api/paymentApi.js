import api from './axiosConfig';

export const requestPayment = async (orderId, amount, paymentKey) => {
    try {
        const response = await api.post('/v1/payment/confirm', {
            orderId,
            amount,
            paymentKey
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add other payment related API calls here
