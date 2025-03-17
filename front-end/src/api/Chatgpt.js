import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatgpt.module.css'; // 수정: CSS 모듈 가져오기
import axios from 'axios'; //HTTP 요청을 보내기 위해 axios를 가져옴
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 컴포넌트를 가져옴
import { faDog, faTimes } from '@fortawesome/free-solid-svg-icons'; // 사용할 아이콘들을 가져dha

const ChatComponent = ({ onClose }) => {   // ChatComponent 컴포넌트를 정의. onClose는 prop으로 받아옴(property)
  const [keywords, setKeywords] = useState(''); // 사용자가 입력한 키워드를 상태로 관리
  const [messages, setMessages] = useState([]); //채팅 메시지들을 상태로 관리함
  const [loading, setLoading] = useState(false); //로딩 상태를 관리
  const chatRef = useRef(null); //chatRef는 DOM 요소를 참조하기 위해 사용

  useEffect(() => {
    const handleClickOutside = (event) => { //컴포넌트 외부를 클릭했을 때 닫히게 함
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        //!chatRef.current.contains(event.target): chatRef.current가 참조하는 DOM 요소에 event.target이 포함되어 있지 않은 경우, 여기서 event.target은 이벤트가 발생한 요소를 가리킴
        onClose();  // 외부 클릭 시 onClose 함수를 호출
      }
    };

    document.addEventListener('mousedown', handleClickOutside);  // 마우스 클릭 이벤트를 추가합니다.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // 컴포넌트가 언마운트 될 때 이벤트를 제거
    };
  }, [onClose]); // onClose prop이 변경될 때마다 effect를 재실행

  const chatGPT = async () => { //chatGPT 함수는 사용자의 입력을 GPT-3 API로 보내고 응답을 받음
    const api_key = process.env.REACT_APP_OPENAI_API_KEY; // <- API KEY 입력
    const prompt = 
      '지금부터 앞의 질문에 어떻게 대답해야할지 말씀드릴게요. 아래 사항을 모두 읽고 따라주세요.\n' +
      '1. 50자 이내로 대답하세요.\n' +
      '2. 친절하게 대답하세요.\n\n';

    const userMessage = { role: 'user', content: keywords }; //사용자의 메시지를 생성
    const data = {
      model: 'ft:gpt-3.5-turbo-1106:personal::9eHqzY3y',
      messages: [{ role: 'system', content: prompt }, userMessage],
      max_tokens: 100, // 응답받을 메시지 최대 토큰(단어) 수 설정
      top_p: 1, // 토큰 샘플링 확률을 설정
      frequency_penalty: 0.5, // 일반적으로 나오지 않는 단어를 억제하는 정도
      presence_penalty: 0.5, // 동일한 단어나 구문이 반복되는 것을 억제하는 정도
      temperature: 0.5,//응답 창의성 조절하는값
    };

    setMessages([...messages, { role: 'user', content: keywords }]); // 사용자의 메시지를 메시지 목록에 추
    setKeywords(''); //키워드 상태를 초기화

    try {
      setLoading(true); // 로딩 상태를 true로 설정
      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
          Authorization: `Bearer ${api_key}`, // API 키를 Authorization 헤더에 추가
          'Content-Type': 'application/json', // 요청의 Content-Type을 설정
        },
      });
      setLoading(false); // 로딩 상태를 false로 설정
      setMessages((prevMessages) => [
        ...prevMessages,  // JavaScript에서 spread 문법을 사용하여 배열이나 객체를 확장(복사)하는 방법
        { role: 'assistant', content: response.data.choices[0].message.content }, // API 응답 메시지를 추가
      ]);
    } catch (error) {
      setLoading(false);  // 로딩 상태를 false로 설정
      console.error('Error:', error); // 에러를 콘솔에 출력
    }
  };

  return (
    <div className={styles.chatComponent} ref={chatRef}>
      <div className={styles.chatHeader}>
        <h1 className={styles.chatHeader_text}>펫과함께 AI</h1>
        <FontAwesomeIcon icon={faTimes} className={styles.closeButton} onClick={onClose} />
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.messageBox} ${message.role === 'user' ? styles.messageBoxUser : styles.messageBoxAssistant}`}
            >
              {message.content}
            </div>
          ))}
          {loading && <div className={styles.messageBoxAssistant}>Loading...</div>}
        </div>
        <div className={styles.userMessage}>
          <input
            type="text"
            id="keywords"
            name="keywords"
            required
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)} //이벤트 객체(e): 이벤트가 발생했을 때 이벤트 핸들러에 전달되는 객체 //target 속성: 이벤트가 발생한 요소를 나타내는 속성 
                                                          //, value 속성: target 속성을 통해 접근할 수 있는 속성 중 하나로, 사용자 입력 요소에서 입력된 값(텍스트 입력, 선택된 옵션 등)을 나타냅
            className={styles.userMessageInput}
          />
          <button onClick={chatGPT} className={styles.userMessageButton}>입력</button>
        </div>
      </div>
    </div>
  );
};

const Chatgpt = () => { //Chatgpt 컴포넌트를 정의
  const [showChat, setShowChat] = useState(false); // 채팅 컴포넌트의 표시 상태를 관리

  const handleIconClick = () => {  // 아이콘 클릭 시 호출되는 함수
    setShowChat(!showChat); //showChat 상태를 토글
  };

  return (
    <div className={styles.App}>
      <div
        className={styles.chatIcon}
        onClick={handleIconClick}
      ></div>
      {showChat && <ChatComponent onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default Chatgpt; //Chatgpt 컴포넌트를 기본 내보내기로 설정