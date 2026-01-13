import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import styles from '../Navbar.module.css';

/**
 * 검색 패널 컴포넌트
 */
function SearchPanel() {
    return (
        <div className={styles.panel_content}>
            <input placeholder="검색" />
            <button>
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </div>
    );
}

export default SearchPanel;
