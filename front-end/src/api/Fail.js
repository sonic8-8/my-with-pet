import React from 'react';
import styles from './Payment.module.css'; // 수정-> Tosspay.module.css 가져오기(스타일 전역으로 번짐 방지)

const Fail = () => { //Fail이라는 이름의 함수형 컴포넌트를 정의
  const urlParams = new URLSearchParams(window.location.search);
//현재 URL의 쿼리 문자열을 파싱하여 urlParams라는 변수에 저장-> URL 쿠ㅓ리 파리미터 접근 가능
//
//(파싱)프로그램에서 사용할 수 있는 데이터 구조로 변환하는 과정
// window.location.search는 JavaScript에서 현재 페이지의 URL에서 쿼리 문자열 부분을 나타내는 프로퍼티(property)속성 -> (ex)?keyword=apple&page=1
//URLSearchParams는 JavaScript에서 URL의 쿼리 문자열을 쉽게 다룰 수 있는 인터페이스를 제공하는 객체-> 주로 현재 페이지의 URL에서 쿼리 매개변수를 읽거나 수정할 때 사용

  return (
    <div className={styles.result}> {/* 수정-> 클래스명 변경 */} {/* module.css쓸 때 styles.적용이름 */}
      <div className={styles.box_section}> {/* 수정-> 클래스명 변경 */}
        <h2 style={{ padding: '20px 0px 10px 0px' }}>
          {/* 인라인 스타일을 사용하여 패딩을 설정-> 인라인 스타일(Inline Style)은 HTML 요소에 직접 스타일을 적용하는 방법-> style 속성을 사용하여 스타일 규칙을 지정
          장점 (간편함) HTML 요소에 직접 스타일을 적용하므로 CSS 파일을 생성하거나 관리할 필요가 없음, 
          단점 (유지보수 어려움) HTML과 CSS가 분리되지 않기 때문에 스타일을 변경할 경우 모든 인라인 스타일을 일일이 수정해야 함 */}
          {/* 참고 패딩은 요소의 내부 여백을 지정하여 내용과 테두리(border) 사이의 공간을 조절하는 데 사용을 말함 */}
          <img width="25px" src="https://static.toss.im/3d-emojis/u1F6A8-apng.png" alt="Fail" /> 
          {/* img 요소를 렌더링 함, 이미지의 너비는 25픽셀, 이미지 소스는 주어진 URL, alt 텍스트는 Fail 입니다. */}
          {/* alt 텍스트(Alternative Text)는 HTML에서 <img> 요소에 사용되는 속성, 이미지가 로드되지 않았을 때나 이미지가 표시되지 못할 경우 대체할 수 있는 텍스트를 제공하는 역할 */}
          결제 실패
        </h2>
        <p>에러코드: {urlParams.get('code')}</p>
        {/* p 요소를 렌더링하고, 쿼리 파라미터에서 가져온 code 값을 표시 */}
        <p>실패 사유: {urlParams.get('message')}</p>
        {/*p 요소를 렌더링하고, 쿼리 파라미터에서 가져온 message 값을 표시  */}
      </div>
    </div>
  );
};

export default Fail;
//Fail 컴포넌트를 기본 내보내기로 설정