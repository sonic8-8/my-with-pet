import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateItemQuantity } from "../Redux/store";
import './Checkout.css';
import api from '../api/axiosConfig';

const widgetClientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
const customerKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6"; // This should also be in env if possible, but keeping logic minimal
// const paymentWidget = PaymentWidget(widgetClientKey, PaymentWidget.ANONYMOUS) // 비회원 결제

function Checkout() {

  const [paymentWidget, setPaymentWidget] = useState(null);
  const paymentMethodsWidgetRef = useRef(null);
  const [price, setPrice] = useState(50_000);

  useEffect(() => {
    const fetchPaymentWidget = async () => {
      try {
        const loadedWidget = await loadPaymentWidget(widgetClientKey, customerKey);
        setPaymentWidget(loadedWidget);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    };

    fetchPaymentWidget();
  }, []);

  useEffect(() => {
    if (paymentWidget == null) {
      return;
    }

    const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
      "#payment-widget",
      { value: price },
      { variantKey: "DEFAULT" }
    );

    paymentWidget.renderAgreement(
      "#agreement",
      { variantKey: "AGREEMENT" }
    );

    paymentMethodsWidgetRef.current = paymentMethodsWidget;
  }, [paymentWidget, price]);

  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null) {
      return;
    }

    paymentMethodsWidget.updateAmount(price);
  }, [price]);

  const handlePaymentRequest = async () => {

    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.

    try {
      await paymentWidget?.requestPayment({
        orderId: nanoid(),
        orderName: "토스 티셔츠 외 2건",
        customerName: "김토스",
        customerEmail: "customer123@gmail.com",
        customerMobilePhone: "01012341234",
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (error) {
      console.error("Error requesting payment:", error);
    }
  };

  //---------------------------------------------------------------
  // Redux store에서 cartSlice의 state 가져오기

  const cartItems = useSelector(state => state.cart.items); // items는 배열임
  const dispatch = useDispatch();

  const handleRemoveItem = (itemIdx) => {
    dispatch(removeItem(itemIdx));
  };

  const handleQuantityChange = (itemIdx, newQuantity) => {
    dispatch(updateItemQuantity({ idx: itemIdx, quantity: newQuantity }));
  };

  //--------------------------------------------------------------------------
  // 계산 관련

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const newTotalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);


  //-------------------------------------------------------------------------
  // 주문 정보 서버 전송 관련

  const handleOrder = async () => {
    const orderData = {
      cartItems,
      status: status,
      orderMemo: orderMemo,
      deliveryAddr: deliveryAddr,
      recipientPhone: phone,
      orderMemo: orderMemo
    };

    try {
      const response = await api.post('/api/order',
        JSON.stringify(orderData));

      if (response.status === 200) { // 성공하면 관례적으로
        // alert('주문이 완료되었습니다.');
        // 주문 완료 후 처리 (예: 페이지 이동, 장바구니 비우기 등)
      } else {
        alert('주문에 실패하였습니다.');
        console.error('주문 실패:', response.data);
      }
    } catch (error) {
      alert('주문에 실패하였습니다.');
      console.error('주문 실패:', error);
    }
  };


  //--------------------------------------------------------------------------
  // 주문 정보 관련 state

  const [order, setOrder] = useState([]);
  const [status, setStatus] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [deliveryAddr, setDeliveryAddr] = useState("");
  const [phone, setPhone] = useState("");
  const [orderMemo, setOrderMemo] = useState("");

  //--------------------------------------------------------------------------


  return (
    <div className="container">

      <div className="box"></div>

      <div className="info_container">

        <h2>장바구니</h2>

        <p className="hidden">주문상태
          <input value={status}
            onChange={(e) => setStatus(e.target.value)} />
        </p>

        <p>주문자</p>
        <input value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)} />
        <p>배달 주소</p>
        <input value={deliveryAddr}
          onChange={(e) => setDeliveryAddr(e.target.value)} />
        <p>휴대전화번호</p>
        <input value={phone}
          onChange={(e) => setPhone(e.target.value)} />
        <p>가게요청사항</p>
        <input value={orderMemo}
          onChange={(e) => setOrderMemo(e.target.value)} />
      </div>

      <div className="box2" />

      <div className="item_container">
        {
          cartItems.length === 0 ? (
            <p>장바구니가 비어있습니다.</p>
          ) : (
            <ul>
              {
                cartItems.map(item => (
                  <div key={item.id} className="item">
                    <img src={item.img} alt={item.name} style={{ width: '100px' }} />
                    <p>{item.name}</p>
                    <p>{item.price}원</p>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.idx, parseInt(e.target.value, 10))}
                    />
                    <button onClick={() => handleRemoveItem(item.idx)}>삭제</button>
                  </div>
                ))}
            </ul>
          )
        }

        <div className="box2" />

        <h5>총 주문금액 : {totalPrice}원</h5>

      </div>

      <div className="pay_container">


        {/* 할인 쿠폰 */}
        <label htmlFor="coupon-box">
          {/* <input
            id="coupon-box"
            type="checkbox"
            onChange={(event) => {
              setPrice(event.target.checked ? price - 5_000 : price + 5_000);
            }}
          />
          <span>5,000원 쿠폰 적용</span> */}
        </label>

        {/* 결제 UI, 이용약관 UI 영역 */}
        <div id="payment-widget" />
        <div id="agreement" />

        <div className="foot_container">


          {/* 결제하기 버튼 */}
          <button onClick={() => {
            handlePaymentRequest();
            handleOrder();
          }}>결제하기</button>
        </div>

      </div>
    </div>

  );
}

export default Checkout;