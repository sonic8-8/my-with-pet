import React, { useState, useEffect } from 'react'; //React 라이브러리와 함께 useState와 useEffect 훅을 가져옴
//useState: 상태 변수를 선언하고 관리, useEffect: 컴포넌트가 렌더링될 때와 특정 값이 변경될 때 실행할 사이드 이펙트를 정의
import axios from 'axios'; //코드 바꿔서 삭제해도 됨
import styles from './Payment.module.css'; // 수정: Tosspay.module.css 가져오기

const Payment = () => {                             //Payment라는 이름의 함수형 컴포넌트를 정의
  const [orderId, setOrderId] = useState('');       //orderId 상태 변수를 선언하고 초기값을 빈 문자열로 설정 //setOrderId 함수는 orderId 상태를 업데이트하는 데 사용
  const [amount, setAmount] = useState(100);        //amount 상태 변수를 선언하고 초기값을 100으로 설정         //★★★★ 초기에 100원으로 설정한거임!!!!!!!!!!!!!!!
  const [paymentKey, setPaymentKey] = useState('');     //paymentKey 상태 변수를 선언하고 초기값을 빈 문자열로 설정
  const [response, setResponse] = useState(null); // response 상태 변수를 선언하고 초기값을 null로 설정합니다. setResponse 함수는 response 상태를 업데이트하는 데 사용
  const [couponApplied, setCouponApplied] = useState(false); //couponApplied 상태 변수를 선언하고 초기값을 false로 설정
  //쿠폰 클릭 아이콘 보여주기만, 따로 동작은 못함 에러뜨는 상황

  //useEffect(()=>{}); 컴포넌트가 렌더링 될 때마다 실행    useEffect(()=>{},[]); 컴포넌트가 처음 렌더링 될 떄 실행
  // useEffect(()=>{},[amount]); 컴포넌트가 처음 렌더링 될 때 실행 후 amount값이 변경되면 re-rendering된 이후 실행
  useEffect(() => {                     //useEffect 훅을 사용하여 컴포넌트가 렌더링될 때와 amount 상태가 변경될 때 실행할 사이드 이펙트를 정의
     // body에 클래스 추가
     document.body.classList.add(styles.body); //이거 덕에 배경 섞이는거 막기 가능 ,<body> 요소에 CSS 클래스를 추가하는 방법
    //document.body: document 객체는 현재 웹 페이지를 나타내며, body는 웹 페이지의 본문 요소
    //classList: classList는 요소의 클래스 목록을 조작하는 데 사용되는 속성
    //.add(styles.body): add() 메서드는 classList 객체의 메서드로, 지정된 클래스를 요소의 클래스 목록에 추가(css .body를 추가하는 기능임)
      
    
    //const script = document.createElement('script');은 JavaScript를 사용하여 새로운 <script> 요소를 생성하는 코드 //동적으로 스크립트를 추가하거나 로드할 수 있음
    const script = document.createElement('script');    //document.createElement('script'): document.createElement() 메서드는 지정된 HTML 요소를 생성
    script.src = "https://js.tosspayments.com/v1/payment-widget";
    script.async = true;    //async 속성은 <script> 요소에 사용되며, 브라우저가 스크립트를 비동기적으로 로드
    //결제 위젯을 로드하기 위해 스크립트 태그를 동적으로 생성 , 스크립트의 소스는 https://js.tosspayments.com/v1/payment-widget이며, 비동기로 로드


    script.onload = () => {
      const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
      const customerKey = btoa(Math.random()).slice(0, 20);
      //JavaScript를 사용하여 임의의 문자열을 생성하고, Base64 인코딩을 통해 해당 문자열을 인코딩한 후 처음 20자를 가져옴(Math.random이니 랜덤으로), btoa() 함수는 주어진 문자열을 Base64로 인코딩
      const paymentWidget = window.PaymentWidget(clientKey, customerKey);
      //스크립트 로드 시 콜백 함수 정의, clientKey와 customerKey를 설정하고, 결제 위젯을 초기화
      //window객체는 JavaScript에서 매우 중요한 객체로, 웹브라우저의 전역 객체 입니다!

      paymentWidget.renderPaymentMethods("#payment-method", { value: amount }); //결제 방법 렌더링  //@@@@(amount)가 값임
      paymentWidget.renderAgreement("#agreement");                              //약관 동의 섹션을 렌더링

      const coupon = document.getElementById('coupon-box');
      coupon.addEventListener('change', () => {
        paymentWidget.updateAmount(coupon.checked ? amount - 5000 : amount);
      });
      //쿠폰 적용 여부를 감지하여 결제 금액을 업데이트 함 //원래 여기서 paymentWidget.updateAmount가 동작되야 하는데 파일 환경 바꾸는 과정에서 기능이 날아간듯함

      const button = document.getElementById('payment-button');     //결제 버튼 클릭 이벤트를 감지하여 결제를 요청
      button.addEventListener('click', () => {
        paymentWidget.requestPayment({                  //결제 요청 메소드
          orderId: btoa(Math.random()).slice(0, 20),    //주문번호 랜덤
          orderName: "건",                              //★★★이걸로 주문 이름 설정임 -> back -> DB 이 구조 기억@!        주문이름임!!
          successUrl: window.location.origin + "/success", //window.location.origin은 현재페이지의 origin(프로토콜,호스트,포트),여기에 /success 또는 /fail을 붙여 결제 완료 후 사용자를 이동
          failUrl: window.location.origin + "/fail",        //successUrl와 failUrl: 결제 성공 시와 실패 시 리다이렉션될 URL임
          customerEmail: "customer123@gmail.com",       //고객 메일
          customerName: "김토스",                         //고객 이름
          customerMobilePhone: "01012341234",             //고객 전화 번호      
        });
      });
    };

    document.body.appendChild(script);
  }, [amount]);
  //스크립트 태그를 body에 추가함 , amount 값이 변경될 때마다 이 효과가 다시 실행

  return (        //ui rendering 한거임
    <div className={styles.wrapper}> {/* 클래스명 변경하여 module.css로 적용했다는 뜻*/}
      <div className={styles.box_section}> {/* 클래스명 변경하여 module.css로 적용했다는 뜻 */}
        <div id="payment-method"></div>
        <div id="agreement"></div>
        <div style={{ paddingLeft: '25px' }}>
          <div className="checkable typography--p"> {/* typography 저번에 승환형님 자리에서 에러났었음 */}            
            <label htmlFor="coupon-box" className="checkable__label typography--regular">
              <input
                id="coupon-box"
                className="checkable__input"
                type="checkbox"
                aria-checked="true"
                onChange={() => setCouponApplied(!couponApplied)}
              />
              <span className="checkable__label-text">5,000원 쿠폰 적용</span>
              {/* 현재 위에 파일 고치면서 함수 날아간듯함 쿠폰 적용 안됨 */}
            </label>
          </div>
        </div>
        <div className={styles.result}> {/* 수정함 클래스명 변경함 */}
          <button className={styles.button} id="payment-button"> {/* 수정함 클래스명 변경함 */}
            결제하기
          </button>
        </div>
      </div>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      {/*  React JSX 문법에서 사용되는 조건부 렌더링임 response 변수가 존재하고(truthy) 있을 경우에만 다음의 JSX 코드를 실행       
      JSON.stringify(response, null, 2) 함수는 JavaScript 객체를 JSON 문자열로 변환함,  null은 replacer 함수를 나타내며, 2는 들여쓰기 수를 나타냄
      (replacer JSON 문자열로 변환할 때 객체의 속성을 필터링하거나 변형하는 데 사용)
      <pre> 태그는 내부의 텍스트를 그대로 보여주며, HTML에서 텍스트 포맷을 유지하는 데 사용

      요약
      response 변수가 존재할 때(값이 null 또는 undefined가 아닐 때), JSON.stringify(response, null, 2)을 사용하여 response 객체를 문자열로 변환하고 이를 <pre> 태그 내에 표시함,
      이를 통해 화면에 response 객체의 내용 출력함
      */}
    </div>
  );
};

export default Payment;