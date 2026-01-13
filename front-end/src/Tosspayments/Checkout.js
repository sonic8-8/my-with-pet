import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateItemQuantity } from "../Redux/store";
import './Checkout.css';

// Custom Hooks
import { usePaymentWidget } from './hooks/usePaymentWidget';
import { useOrderForm } from './hooks/useOrderForm';

// Components
import OrderForm from './components/OrderForm';
import CartItemsList from './components/CartItemsList';
import OrderSummary from './components/OrderSummary';

/**
 * 결제 페이지 컴포넌트
 */
function Checkout() {
  const dispatch = useDispatch();

  // Redux state
  const cartItems = useSelector(state => state.cart.items);

  // 총 금액 계산
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const newTotalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  // Custom Hooks
  const { handlePaymentRequest } = usePaymentWidget(totalPrice);
  const { formState, handleChange, handleOrder } = useOrderForm(cartItems);

  // 장바구니 핸들러
  const handleRemoveItem = (itemIdx) => dispatch(removeItem(itemIdx));
  const handleQuantityChange = (itemIdx, newQuantity) => {
    dispatch(updateItemQuantity({ idx: itemIdx, quantity: newQuantity }));
  };

  // 결제 처리
  const handlePayment = () => {
    handlePaymentRequest();
    handleOrder();
  };

  return (
    <div className="container">
      <div className="box"></div>

      {/* 주문자 정보 */}
      <OrderForm formState={formState} handleChange={handleChange} />

      <div className="box2" />

      {/* 장바구니 */}
      <div className="item_container">
        <CartItemsList
          cartItems={cartItems}
          onRemoveItem={handleRemoveItem}
          onQuantityChange={handleQuantityChange}
        />
        <div className="box2" />
        <OrderSummary totalPrice={totalPrice} />
      </div>

      {/* 결제 UI */}
      <div className="pay_container">
        <label htmlFor="coupon-box"></label>
        <div id="payment-widget" />
        <div id="agreement" />
        <div className="foot_container">
          <button onClick={handlePayment}>결제하기</button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;