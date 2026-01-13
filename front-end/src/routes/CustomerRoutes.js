import React from 'react';
import { Route } from 'react-router-dom';

// 고객 페이지
import Main from '../customerPage/Main.js';
import Login from '../customerPage/Login.js';
import SignUp from '../customerPage/SignUp.js';
import StoreList from '../customerPage/StoreList.js';
import StoreDetail from '../customerPage/StoreDetail.js';
import Cart from '../customerPage/Cart.js';

// 마이페이지
import Mypage from '../mypage/Mypage.js';
import OrderList from '../mypage/OrderList.js';
import AddressEdit from '../mypage/AddressEdit.js';
import Mypet from '../mypage/MyPet.js';
import LikeList from '../mypage/LikeList.js';
import ProfileEdit from '../mypage/ProfileEdit.js';
import DeleteId from '../mypage/DeleteId.js';

/**
 * 고객 관련 라우트 설정
 */
function CustomerRoutes() {
    return (
        <>
            {/* 고객 메인 페이지 */}
            <Route path="/" element={<Main />} />

            {/* 로그인/회원가입 */}
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* 가게/상품 */}
            <Route path="/store-list/:type" element={<StoreList />} />
            <Route path="/shop/:idx" element={<StoreDetail />} />
            <Route path="/cart" element={<Cart />} />

            {/* 마이페이지 */}
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/mypage/order-list" element={<OrderList />} />
            <Route path="/mypage/address-edit" element={<AddressEdit />} />
            <Route path="/mypage/my-pet" element={<Mypet />} />
            <Route path="/mypage/like-list" element={<LikeList />} />
            <Route path="/mypage/profile-edit" element={<ProfileEdit />} />
            <Route path="/mypage/delete-id" element={<DeleteId />} />
        </>
    );
}

export default CustomerRoutes;
