package com.apple.shop.chat;

import lombok.Data;

/**
 * ChatGPT 요청 DTO
 */
@Data
public class ChatRequest {
    private String systemPrompt;
    private String userMessage;
}
