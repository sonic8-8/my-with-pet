package com.apple.shop.integration;

// GCP Storage 서비스 (prod 배포 시 활성화 - Plan-21)
// 현재 로컬 개발 환경에서는 비활성화

/*
 * import com.google.cloud.storage.BlobId;
 * import com.google.cloud.storage.BlobInfo;
 * import com.google.cloud.storage.Storage;
 * import lombok.RequiredArgsConstructor;
 * import org.springframework.beans.factory.annotation.Value;
 * import org.springframework.stereotype.Service;
 * 
 * import java.net.URL;
 * import java.util.HashMap;
 * import java.util.Map;
 * import java.util.concurrent.TimeUnit;
 * 
 * @Service
 * 
 * @RequiredArgsConstructor
 * public class StorageService {
 * 
 * @Value("${spring.cloud.gcp.storage.bucket}")
 * private String bucketName;
 * 
 * private final Storage storage;
 * 
 * public String createSignedUrl(String objectName) {
 * BlobInfo blobInfo = BlobInfo.newBuilder(BlobId.of(bucketName,
 * objectName)).build();
 * 
 * Map<String, String> extensionHeaders = new HashMap<>();
 * extensionHeaders.put("Content-Type", "application/octet-stream");
 * 
 * URL url = storage.signUrl(
 * blobInfo,
 * 15,
 * TimeUnit.MINUTES,
 * Storage.SignUrlOption.httpMethod(com.google.cloud.storage.HttpMethod.PUT),
 * Storage.SignUrlOption.withExtHeaders(extensionHeaders),
 * Storage.SignUrlOption.withV4Signature());
 * 
 * return url.toString();
 * }
 * }
 */
