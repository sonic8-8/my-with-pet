import React, { useState, useEffect } from 'react';
import axios from 'axios';


function OrderList() {

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = 'sr2907'; // 실제 사용자 ID를 여기에 넣으세요

    const fetchOrderHistory = async () => {
      try {
        const response = await axios.post('http://localhost:8085/api/orders/orderhistory', {
          userId: userId
        });
        setOrders(response.data);
      } catch (error) {
        console.error('There was an error fetching the order history!', error);
        setError('주문 내역을 불러오는 데 실패했습니다.');
      }
    };

    fetchOrderHistory();
  }, []);


  return (

  <div>
     <h1>주문 내역</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>주문 번호</th>
            <th>주문 일시</th>
            <th>결제 방법</th>
            <th>결제 금액</th>
            <th>주문 상태</th>
            <th>수령자 이름</th>
            <th>배송 주소</th>
            <th>수령자 전화번호</th>
            <th>주문 메모</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.idx}>
              <td>{order.idx}</td>
              <td>{new Date(order.orderedAt).toLocaleString()}</td>
              <td>{order.payMethod}</td>
              <td>{order.payAmount}</td>
              <td>{order.orderStatus}</td>
              <td>{order.recipientName}</td>
              <td>{order.deliveryAddr}</td>
              <td>{order.recipientPhone}</td>
              <td>{order.orderMemo}</td>
            </tr>
          ))}
        </tbody>
      </table>

  </div>

  )

}

export default OrderList;
