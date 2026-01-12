import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './Redux/store';

/**
 * Provider들을 포함한 커스텀 render 함수
 * @param {React.ReactElement} ui - 렌더할 컴포넌트
 * @param {Object} options - 옵션
 */
export function renderWithProviders(ui, renderOptions = {}) {
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </Provider>
        );
    }

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

// re-export everything
export * from '@testing-library/react';
