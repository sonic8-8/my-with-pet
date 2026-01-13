import React from 'react';
import { Route } from 'react-router-dom';

// 비즈니스 페이지
import BizMain from '../businessPage/BizMain.js';
import BizLogin from '../businessPage/BizLogin.js';
import BizSignUp from '../businessPage/BizSignUp.js';
import BizNumAuth from '../businessPage/BizNumAuth.js';
import BizMypage from '../businessPage/BizMypage.js';
import BizTempClose from '../businessPage/BizTempClose.js';
import BizItemEdit from '../businessPage/BizItemEdit.js';
import BizInfoEdit from '../businessPage/BizInfoEdit.js';
import BizReview from '../businessPage/BizReview.js';
import BizOrderStatus from '../businessPage/BizOrderStatus.js';
import BizLikeList from '../businessPage/BizLikeList.js';
import BizOrderList from '../businessPage/BizOrderList.js';

/**
 * 비즈니스 관련 라우트 설정
 */
function BusinessRoutes() {
    return (
        <>
            {/* 비즈니스 메인 */}
            <Route path="/business" element={<BizMain />} />

            {/* 로그인/회원가입 */}
            <Route path="/business/login" element={<BizLogin />} />
            <Route path="/business/sign-up" element={<BizSignUp />} />
            <Route path="/business/biz-num" element={<BizNumAuth />} />

            {/* 마이페이지 */}
            <Route path="/business/mypage" element={<BizMypage />} />
            <Route path="/business/temp-close" element={<BizTempClose />} />

            {/* 가게 관리 */}
            <Route path="/business/item-edit" element={<BizItemEdit />} />
            <Route path="/business/info-edit" element={<BizInfoEdit />} />
            <Route path="/business/review" element={<BizReview />} />
            <Route path="/business/order-status" element={<BizOrderStatus />} />
            <Route path="/business/like-list" element={<BizLikeList />} />
            <Route path="/business/order-list" element={<BizOrderList />} />
        </>
    );
}

export default BusinessRoutes;
