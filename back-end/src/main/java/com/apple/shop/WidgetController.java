package com.apple.shop; // 패키지 경로 확인

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class WidgetController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final WebClient webClient;

    public WidgetController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @PostMapping("/confirm")
    public Mono<ResponseEntity<String>> confirmPayment(@RequestBody Map<String, String> requestData) {
        JSONObject obj = new JSONObject();
        obj.put("orderId", requestData.get("orderId"));
        obj.put("amount", requestData.get("amount"));
        obj.put("paymentKey", requestData.get("paymentKey"));

        String widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6"; // 실제 Secret Key로 변경
        String authHeader = "Basic " + Base64.getEncoder().encodeToString((widgetSecretKey + ":").getBytes(StandardCharsets.UTF_8));

        System.out.println("결제 처리 되는 중임");

        return webClient.post()
                .uri("https://api.tosspayments.com/v1/payments/confirm")
                .header("Authorization", authHeader)
                .header("Content-Type", "application/json")
                .body(BodyInserters.fromValue(obj.toString()))
                .retrieve()
                .toEntity(String.class)
                .map(response -> ResponseEntity.status(response.getStatusCode()).body(response.getBody()))
                .onErrorResume(e -> {
                    logger.error("Error confirming payment: {}", e.getMessage());
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("{\"error\": \"결제 처리 중 오류가 발생했습니다.\"}")); // JSON 형식 오류 응답
                });
    }
}
