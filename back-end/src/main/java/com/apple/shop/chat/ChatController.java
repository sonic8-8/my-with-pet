package com.apple.shop.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * OpenAI API Proxy Controller
 * ADR-003: API Key가 클라이언트에 노출되지 않도록 Backend에서 처리
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {

    @Value("${openai.api-key:}")
    private String openaiApiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String MODEL = "ft:gpt-3.5-turbo-1106:personal::9eHqzY3y";

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "OpenAI API key is not configured"));
        }

        try {
            // OpenAI API 요청 구성
            Map<String, Object> openaiRequest = new HashMap<>();
            openaiRequest.put("model", MODEL);
            openaiRequest.put("messages", List.of(
                    Map.of("role", "system", "content", request.getSystemPrompt()),
                    Map.of("role", "user", "content", request.getUserMessage())));
            openaiRequest.put("max_tokens", 100);
            openaiRequest.put("temperature", 0.5);

            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(openaiRequest, headers);

            // OpenAI API 호출
            ResponseEntity<Map> response = restTemplate.exchange(
                    OPENAI_API_URL,
                    HttpMethod.POST,
                    entity,
                    Map.class);

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to call OpenAI API: " + e.getMessage()));
        }
    }
}
