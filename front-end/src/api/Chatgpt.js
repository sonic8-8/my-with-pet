import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatgpt.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * Chat Component - Backend Proxy를 통해 OpenAI API 호출
 * ADR-003: API Key가 클라이언트에 노출되지 않도록 Backend에서 처리
 */
const ChatComponent = ({ onClose }) => {
  const [keywords, setKeywords] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const SYSTEM_PROMPT =
    '지금부터 앞의 질문에 어떻게 대답해야할지 말씀드릴게요. 아래 사항을 모두 읽고 따라주세요.\n' +
    '1. 50자 이내로 대답하세요.\n' +
    '2. 친절하게 대답하세요.\n\n';

  const chatGPT = async () => {
    if (!keywords.trim()) return;

    const userMessage = { role: 'user', content: keywords };
    setMessages([...messages, userMessage]);
    setKeywords('');

    try {
      setLoading(true);
      // ADR-003: Backend Proxy를 통해 OpenAI API 호출
      const response = await axios.post('/api/chat', {
        systemPrompt: SYSTEM_PROMPT,
        userMessage: keywords
      });
      setLoading(false);

      const assistantMessage = response.data.choices?.[0]?.message?.content || '응답을 받지 못했습니다.';
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: assistantMessage }
      ]);
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'API 호출 중 오류가 발생했습니다.' }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      chatGPT();
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
            onChange={(e) => setKeywords(e.target.value)}
            onKeyPress={handleKeyPress}
            className={styles.userMessageInput}
            placeholder="메시지를 입력하세요..."
          />
          <button onClick={chatGPT} className={styles.userMessageButton}>입력</button>
        </div>
      </div>
    </div>
  );
};

const Chatgpt = () => {
  const [showChat, setShowChat] = useState(false);

  const handleIconClick = () => {
    setShowChat(!showChat);
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

export default Chatgpt;