import React, { useEffect, useState } from 'react';
import styles from './Payment.module.css'; // 수정: Tosspay.module.css 가져오기

const Success = () => {
  const [paymentKey, setPaymentKey] = useState('');
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setPaymentKey(urlParams.get('paymentKey'));
    setOrderId(urlParams.get('orderId'));
    setAmount(urlParams.get('amount'));  
    //현재 URL의 쿼리 문자열을 파싱하여 urlParams라는 변수에 저장-> URL 쿼리 파리미터 접근 가능
    //URL의 쿼리 파라미터를 파싱하여 paymentKey, orderId, amount 상태를 설정

    const confirmPayment = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/confirm', {  // URL을 8085로 설정
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey: urlParams.get('paymentKey'),
            orderId: urlParams.get('orderId'),
            amount: urlParams.get('amount'),
          }),
        });
        //confirmPayment라는 비동기 함수를 정의
        //fetch API를 사용하여 결제 확인 요청을 보냄
        //method는 POST로 설정
        //headers는 요청의 콘텐츠 타입을 application/json으로 설정
        //body는 paymentKey, orderId, amount를 포함한 JSON 문자열




        const json = await response.json();
        if (!response.ok) {
          // 결제 실패 비즈니스 로직
          window.location.href = `/fail?message=${json.message}&code=${json.code}`;
          return;
        }
        //실패사유와, 실패한코드를 보여줌

        // 결제 성공 비즈니스 로직
        console.log(json);
      } catch (error) {
        console.error('Error confirming payment:', error);
        // 결제 실패 비즈니스 로직
        window.location.href = `/fail?message=${error.message}&code=error`;
      }
    };

    confirmPayment();
  }, []);

  //UI 렌더링임
  return (
    <div className={styles.result}> {/* 수정->클래스명 변경 */}
      <div className={styles.box_section}> {/* 수정-> 클래스명 변경 */}
        <h2 style={{ padding: '20px 0px 10px 0px' }}>
          <img width="35px" src="https://static.toss.im/3d-emojis/u1F389_apng.png" alt="Success" />
          결제 성공
        </h2>
        <p>주문번호: {orderId}</p>
        <p>결제 금액: {amount}</p>
        <p>paymentKey: {paymentKey}</p>
      </div>
    </div>
  );
};

export default Success;