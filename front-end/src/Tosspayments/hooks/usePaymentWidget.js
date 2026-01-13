import { useState, useEffect, useRef } from 'react';
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";

const widgetClientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
const customerKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

/**
 * Toss 결제 위젯 관리 Custom Hook
 * @param {number} price - 결제 금액
 * @returns {Object} { paymentWidget, handlePaymentRequest }
 */
export function usePaymentWidget(price) {
    const [paymentWidget, setPaymentWidget] = useState(null);
    const paymentMethodsWidgetRef = useRef(null);

    // 결제 위젯 로딩
    useEffect(() => {
        const fetchPaymentWidget = async () => {
            try {
                const loadedWidget = await loadPaymentWidget(widgetClientKey, customerKey);
                setPaymentWidget(loadedWidget);
            } catch (error) {
                console.error("Error fetching payment widget:", error);
            }
        };

        fetchPaymentWidget();
    }, []);

    // 결제 UI 렌더링
    useEffect(() => {
        if (paymentWidget == null) return;

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
            "#payment-widget",
            { value: price },
            { variantKey: "DEFAULT" }
        );

        paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });
        paymentMethodsWidgetRef.current = paymentMethodsWidget;
    }, [paymentWidget, price]);

    // 금액 업데이트
    useEffect(() => {
        const paymentMethodsWidget = paymentMethodsWidgetRef.current;
        if (paymentMethodsWidget == null) return;
        paymentMethodsWidget.updateAmount(price);
    }, [price]);

    // 결제 요청
    const handlePaymentRequest = async () => {
        try {
            await paymentWidget?.requestPayment({
                orderId: nanoid(),
                orderName: "토스 티셔츠 외 2건",
                customerName: "김토스",
                customerEmail: "customer123@gmail.com",
                customerMobilePhone: "01012341234",
                successUrl: `${window.location.origin}/success`,
                failUrl: `${window.location.origin}/fail`,
            });
        } catch (error) {
            console.error("Error requesting payment:", error);
        }
    };

    return { paymentWidget, handlePaymentRequest };
}

export default usePaymentWidget;
