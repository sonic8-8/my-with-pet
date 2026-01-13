import React from 'react';
import styles from '../StoreDetail.module.css';

/**
 * 리뷰 목록 컴포넌트
 */
function StoreReviews({ reviews, isLoading }) {
    if (isLoading) {
        return <p>리뷰를 불러오는 중입니다...</p>;
    }

    if (!reviews || reviews.length === 0) {
        return <p>리뷰가 없습니다.</p>;
    }

    return (
        <div className={styles.review_container}>
            {reviews.map((review) => (
                <div key={review.idx} className={styles.review}>
                    <div>
                        <p>{review.title}</p>
                        <p>ID : {review.memberId}</p>
                        <p>별점 : {review.ratings}점</p>
                        <p>리뷰</p>
                        <p>{review.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StoreReviews;
