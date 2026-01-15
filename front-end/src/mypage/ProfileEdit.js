import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfileEdit() {
  const [userInfo, setUserInfo] = useState({
    id: '',
    name: '',
    pw: '',
    address: '',
    phone: ''
  });

  const userid = 'MemberTest';
  const [error, setError] = useState('');

  useEffect(() => {
    // 사용자 정보를 불러오는 함수
    const fetchUserInfo = async () => {
      try {

        const response = await axios.post('/api/memberinfo', {
          userid
          // 실제 사용자 ID를 여기에 넣으세요
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('There was an error fetching the user info!', error);
        setError('사용자 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // try {
    //   const response = await axios.put('/api/edit-profile', userInfo);
    //   console.log('Profile updated successfully:', response.data);
    // } catch (error) {
    //   console.error('There was an error updating the profile!', error);
    //   setError('프로필을 업데이트하는 데 실패했습니다.');
    // }
  };



  return (

    <div>

      <h1>개인정보 수정 페이지</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          아이디:
          <input
            type="text"
            name="id"
            value={userInfo.id}
            onChange={handleChange}
            disabled
          />
        </label>
        <br />
        <label>
          이름:
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          비밀번호:
          <input
            type="password"
            name="pw"
            value={userInfo.pw}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          주소:
          <input
            type="text"
            name="address"
            value={userInfo.address}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          전화번호:
          <input
            type="text"
            name="phone"
            value={userInfo.phone}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">저장</button>
      </form>


    </div>

  )
}

export default ProfileEdit;
