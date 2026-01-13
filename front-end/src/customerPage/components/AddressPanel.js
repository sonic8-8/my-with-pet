import React from 'react';
import styles from '../Navbar.module.css';

/**
 * 주소 패널 컴포넌트
 */
function AddressPanel({ addresses, addressStatus }) {
    return (
        <div className={styles.panel_content}>
            <div className={styles.address_container}>
                <p>현재 주소</p>
                {addressStatus === '로딩중' && <p>로딩중</p>}
                {addresses.map((data, index) => (
                    <div key={index}>
                        <h4>현재 주소</h4>
                        {data.isCurrent === true && <p>{data.addr}</p>}
                        <h4>주소 목록</h4>
                        {data.isCurrent === false && (
                            <p>
                                {data.addr}
                                <button>주소 삭제</button>
                            </p>
                        )}
                    </div>
                ))}
                <button>주소 추가</button>
                <input
                    type="text"
                    placeholder="주소를 입력하세요"
                    className={styles.address_input}
                />
            </div>
        </div>
    );
}

export default AddressPanel;
