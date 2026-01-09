import React, { useState, useEffect } from 'react';
import { requestPayment } from '../api/paymentApi'; // Import API function
import styles from './Payment.module.css'; // Adjust path if needed

const PaymentPage = () => {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState(100);
  const [paymentKey, setPaymentKey] = useState('');
  const [response, setResponse] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    document.body.classList.add(styles.body);

    const script = document.createElement('script');
    script.src = "https://js.tosspayments.com/v1/payment-widget";
    script.async = true;

    script.onload = () => {
      const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY; // Use env var
      const customerKey = btoa(Math.random()).slice(0, 20);
      const paymentWidget = window.PaymentWidget(clientKey, customerKey);

      paymentWidget.renderPaymentMethods("#payment-method", { value: amount });
      paymentWidget.renderAgreement("#agreement");

      const coupon = document.getElementById('coupon-box');
      if (coupon) {
        coupon.addEventListener('change', () => {
          paymentWidget.updateAmount(coupon.checked ? amount - 5000 : amount);
        });
      }

      const button = document.getElementById('payment-button');
      if (button) {
        button.addEventListener('click', () => {
          paymentWidget.requestPayment({
            orderId: btoa(Math.random()).slice(0, 20),
            orderName: "건",
            successUrl: window.location.origin + "/success",
            failUrl: window.location.origin + "/fail",
            customerEmail: "customer123@gmail.com",
            customerName: "김토스",
            customerMobilePhone: "01012341234",
          });
        });
      }
    };

    document.body.appendChild(script);

    return () => { // Cleanup
      document.body.removeChild(script);
      document.body.classList.remove(styles.body);
    }
  }, [amount]); // Removed dependencies that shouldn't trigger commonly

  return (
    <div className={styles.wrapper}>
      <div className={styles.box_section}>
        <div id="payment-method"></div>
        <div id="agreement"></div>
        <div style={{ paddingLeft: '25px' }}>
          <div className="checkable typography--p">
            <label htmlFor="coupon-box" className="checkable__label typography--regular">
              <input
                id="coupon-box"
                className="checkable__input"
                type="checkbox"
                onChange={() => setCouponApplied(!couponApplied)}
              />
              <span className="checkable__label-text">5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div>
        <div className={styles.result}>
          <button className={styles.button} id="payment-button">
            결제하기
          </button>
        </div>
      </div>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
};

export default PaymentPage;