import { useState, useEffect, useRef } from 'react';

/**
 * 패널 상태 관리 Custom Hook
 * @returns {Object} { activePanel, panelRef, handleMouseEnter, handlePanelMouseLeave }
 */
export function usePanelState() {
    const [activePanel, setActivePanel] = useState(null);
    const panelRef = useRef(null);

    const handleMouseEnter = (panelName) => {
        setActivePanel(panelName);
    };

    const handlePanelMouseLeave = () => {
        setActivePanel(null);
    };

    // 패널 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setActivePanel(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return { activePanel, panelRef, handleMouseEnter, handlePanelMouseLeave };
}

export default usePanelState;
