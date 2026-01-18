import styles from './ComingSoon.module.css';

/**
 * 서비스 준비 중 Placeholder 컴포넌트
 * @param {string} title - 페이지 제목 (예: "주문 내역")
 * @param {string} description - 추가 설명 (선택사항)
 */
function ComingSoon({ title, description }) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.icon}>🚧</div>
                <h2 className={styles.title}>서비스 준비 중</h2>
                <p className={styles.subtitle}>{title} 기능을 준비하고 있습니다</p>
                {description && <p className={styles.description}>{description}</p>}
                <p className={styles.notice}>빠른 시일 내에 찾아뵙겠습니다!</p>
            </div>
        </div>
    );
}

export default ComingSoon;
