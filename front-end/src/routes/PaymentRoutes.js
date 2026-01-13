import React from 'react';
import { Route } from 'react-router-dom';

// 결제 페이지
import Checkout from '../Tosspayments/Checkout.js';
import Success from '../Tosspayments/Success.js';
import Fail from '../Tosspayments/Fail.js';

/**
 * 결제 관련 라우트 설정
 */
function PaymentRoutes() {
    return (
        <>
            <Route path="/pay" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/fail" element={<Fail />} />
        </>
    );
}

export default PaymentRoutes;
