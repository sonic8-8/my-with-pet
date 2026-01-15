import React, { useState } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';


const AddressEdit = () => {

  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState('1'); // 사용자 ID를 상태로 추가

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/address-add1', {
        userId: userId,
        address: address
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div>
      <h1>Address Management</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AddressEdit;
