import React, { useEffect, useState } from 'react';
import styles from './Cart.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateItemQuantity } from '../Redux/store';
import axios from 'axios';

function Cart() {

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
  
  const handleOrder =  async () => {
    const orderData = {
        cartItems,
        status : status,
        orderMemo : orderMemo,
        deliveryAddr : deliveryAddr,
        recipientPhone : phone,
        orderMemo : orderMemo
      };

      console.log(orderData);
      console.log(cartItems);

    try {
      const response = await axios.post('http://localhost:8085/api/order', 
        JSON.stringify(orderData), {
          headers: {
          'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) { // 성공하면 관례적으로
          alert('주문이 완료되었습니다.');
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

  const [status, setStatus] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [deliveryAddr, setDeliveryAddr] = useState("");
  const [phone, setPhone] = useState("");
  const [orderMemo, setOrderMemo] = useState("");

 //--------------------------------------------------------------------------


  return (
    <div className={styles.container}>
            <div className={styles.cart_container}>
        <h2>장바구니</h2>
        <div className={styles.order_info}>
          <p>주문상태 : <input value={status} 
          onChange={(e) => setStatus(e.target.value)}/></p>
          <p>주문자 : <input value={recipientName} 
          onChange={(e) => setRecipientName(e.target.value)}/></p>
          <p>배달 주소 : <input value={deliveryAddr} 
          onChange={(e) => setDeliveryAddr(e.target.value)}/></p>
          <p>휴대전화번호 : <input value={phone} 
          onChange={(e) => setPhone(e.target.value)}/></p>
          <p>가게요청사항 : <input value={orderMemo}
            onChange={(e) => setOrderMemo(e.target.value)}/></p>
        </div>

        {
        cartItems.length === 0 ? (
          <p>장바구니가 비어있습니다.</p>
        ) : (
        <ul>
          {
          cartItems.map(item => (
            <li key={item.id}>
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
            </li>
            ))}
        </ul>
        )
      }
      
      </div>
      <p>총 가격: {totalPrice}원</p>
      
      <button onClick={handleOrder}>주문하기</button>
    </div>
  );
}

export default Cart;