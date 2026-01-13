import styles from './App.module.css';
import { useState } from 'react';
import { Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// 네비게이션 & 레이아웃
import Navbar from './customerPage/Navbar.js';
import BizNavbar from './businessPage/BizNavbar.js';
import BizSidebar from './businessPage/BizSidebar.js';
import Footer from './customerPage/Footer.js';
import Chatgpt from './api/Chatgpt.js';

// 라우트 설정
import CustomerRoutes from './routes/CustomerRoutes.js';
import BusinessRoutes from './routes/BusinessRoutes.js';
import PaymentRoutes from './routes/PaymentRoutes.js';

/**
 * 메인 애플리케이션 컴포넌트
 */
function App() {
  const [mode, setMode] = useState('customer');

  return (
    <div className={styles.container}>
      {/* 헤더 - 네비게이션 */}
      <div className={styles.head}>
        {mode === 'customer' ? (
          <Navbar mode={mode} setMode={setMode} />
        ) : (
          <BizNavbar mode={mode} setMode={setMode} />
        )}
      </div>

      {/* 바디 */}
      <div className={styles.body}>
        {/* 사이드바 (비즈니스 모드) */}
        <div className={styles.sidebar_container}>
          {mode === 'business' && <BizSidebar className={styles.sidebar} />}
        </div>

        {/* 라우트 컨테이너 */}
        <div className={styles.route_container}>
          <Routes>
            <CustomerRoutes />
            <BusinessRoutes />
            <PaymentRoutes />
          </Routes>
        </div>
      </div>

      {/* 푸터 */}
      <div className={styles.foot}>
        <Chatgpt />
        <Footer mode={mode} setMode={setMode} />
      </div>
    </div>
  );
}

export default App;