import styles from './App.module.css';
import {React, useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

// 고객 회원
import Navbar from './customerPage/Navbar.js';
import StoreList from './customerPage/StoreList.js';
import Main from './customerPage/Main.js';
import Footer from './customerPage/Footer.js';
import StoreDetail from './customerPage/StoreDetail.js';
import Mypage from './mypage/Mypage.js';
import Cart from './customerPage/Cart.js';
import Login from './customerPage/Login.js';
import SignUp from './customerPage/SignUp.js';

// 고객 회원 마이페이지
import AddressEdit from './mypage/AddressEdit.js';
import DeleteId from './mypage/DeleteId.js';
import LikeList from './mypage/LikeList.js';
import Mypet from './mypage/MyPet.js';
import OrderList from './mypage/OrderList.js';
import ProfileEdit from './mypage/ProfileEdit.js';

// 비즈니스 회원

import BizLogin from './businessPage/BizLogin.js';
import BizSignUp from './businessPage/BizSignUp.js';
import BizMain from './businessPage/BizMain.js';
import BizItemEdit from './businessPage/BizItemEdit.js';
import BizInfoEdit from './businessPage/BizInfoEdit.js';
import BizNumAuth from './businessPage/BizNumAuth.js';
import BizMypage from './businessPage/BizMypage.js';
import BizTempClose from './businessPage/BizTempClose.js';
import BizReview from './businessPage/BizReview.js';
import BizOrderStatus from './businessPage/BizOrderStatus.js';
import BizLikeList from './businessPage/BizLikeList.js';
import BizOrderList from './businessPage/BizOrderList.js';
import BizNavbar from './businessPage/BizNavbar.js';
import BizSidebar from './businessPage/BizSidebar.js';

// 외부 API
import Chatgpt from './api/Chatgpt.js';
import Checkout from './Tosspayments/Checkout.js';
import Fail from './Tosspayments/Fail.js';
import Success from './Tosspayments/Success.js'



function App() {

  // -------------------------------------------------------------------------
  // 로그인 처리 관련

  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 상태
  const [MemberId, setMemberId] = useState(''); // 사용자 이름을 관리하는 상태

  useEffect(() => {
    // 페이지 로드 시 쿠키에서 로그인 상태 확인
    const token = Cookies.get('token');
    const MemberId = Cookies.get('MemberId');
    if (token && MemberId) {
      setIsLoggedIn(true);
      setMemberId(MemberId);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token'); // 쿠키에서 토큰 삭제
    Cookies.remove('MemberId'); // 쿠키에서 사용자 이름 삭제
    setIsLoggedIn(false); // 로그인 상태 false로 변경
    setMemberId(''); // 사용자 이름 초기화
    alert('로그아웃 되었습니다.');
  };

  // -------------------------------------------------------------------------
  // 네비바 관련

   const [mode, setMode] = useState('customer');


  return (
    <div className={styles.container}>

      <div className={styles.head}>
      
      {/* 네비바 자리 */}

      {
        mode == 'customer' ?
        <Navbar mode={mode} setMode={setMode} />
        :
        <BizNavbar mode={mode} setMode={setMode} />
      }

      </div>

      <div className={styles.body}>

        <div className={styles.sidebar_container}>

          {
            mode == 'business' ?
            <BizSidebar className={styles.sidebar} />
            :
            ''
          }

        </div>

        <div className={styles.route_container}>




          {/* 라우팅 자리 */}
          <Routes>
            
            {/* 고객 메인 페이지 */}
            <Route path="/" element={<Main></Main>}/>

            {/* 고객 로그인 페이지 */}
            <Route path="/login" element={<Login />} />

            {/* 고객 회원가입 페이지 */}
            <Route path="/sign-up" element={<SignUp />} />

            {/* 가게 목록 페이지 */}
            <Route path="/store-list/:type" element={<StoreList></StoreList>} />

            {/* 상품 목록 페이지 */}
            <Route path="/shop/:idx" element={<StoreDetail />} />

            {/* 장바구니 페이지 */}
            <Route path="/cart" element={<Cart />} />
          
            {/* 마이페이지 */}
            <Route path="/mypage" element={<Mypage></Mypage>}/>

              {/* 주문내역 */}
              <Route path="/mypage/order-list" element={<OrderList />}/>

              {/* 배송지관리 */}
              <Route path="/mypage/address-edit" element={<AddressEdit />}/>

              {/* 마이펫 관리 */}
              <Route path="/mypage/my-pet" element={<Mypet />}/>

              {/* 좋아요한 가게 */}
              <Route path="/mypage/like-list" element={<LikeList />}/>

              {/* 개인정보확인/수정 */}
              <Route path="/mypage/profile-edit" element={<ProfileEdit />}/>

              {/* 회원탈퇴 */}
              <Route path="/mypage/delete-id" element={<DeleteId />}/>

            {/* 결제 페이지 */}
            <Route path="/pay" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/fail" element={<Fail />} />
            
    {/* ------------------- 비즈니스 회원 페이지 ------------------- */}

              {/* 비즈니스 회원 메인 페이지 */}
              <Route path="/business" element={<BizMain />} />

              {/* 비즈니스 회원 로그인 페이지 */}
              <Route path='/business/login' element={<BizLogin />} />

              {/* 비즈니스 회원 가입 페이지 */}
              <Route path="/business/sign-up" element={<BizSignUp />} />
                    
              {/* 사업자등록번호 검증 페이지 */}
              <Route path="/business/biz-num" element={<BizNumAuth />} />

              {/* 비즈니스 회원 마이페이지 */}
              <Route path='/business/mypage' element={<BizMypage />} />

              {/* 비즈니스 회원 영업 일시정지 */}
              <Route path='/business/temp-close' element={<BizTempClose />} />

              {/* 비즈니스 회원 판매 메뉴 관리 페이지 */}
              <Route path="/business/item-edit" element={<BizItemEdit />} />

              {/* 비즈니스 회원 공지 및 가게 정보 수정 페이지 */}
              <Route path="/business/info-edit" element={<BizInfoEdit />} />

              {/* 비즈니스 회원 리뷰 페이지 */}
              <Route path='/business/review' element={<BizReview />} />

              {/* 비즈니스 회원 주문상태 변경 페이지 */}
              <Route path="/business/order-status" element={<BizOrderStatus />} />

              {/* 비즈니스 좋아요 현황 페이지 */}
              <Route path="/business/like-list" element={<BizLikeList />} />

              {/* 비즈니스 회원 주문 및 정산 내역 페이지 */}
              <Route path="/business/order-list" element={<BizOrderList />} />
            

          </Routes>
        
        </div>

      </div>
      
      <div className={styles.foot}>

        {/* 챗gpt */}
        <Chatgpt />

        {/* footer 자리 */}
        <Footer mode={mode} setMode={setMode} />
      
      </div>

      
    </div>
  );
}

export default App;