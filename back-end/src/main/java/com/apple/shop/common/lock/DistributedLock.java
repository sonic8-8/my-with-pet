package com.apple.shop.common.lock;

// Redis 분산락 어노테이션 (성능 최적화 시 활성화 - Plan-21)
// 현재 로컬 개발 환경에서는 비활성화

/*
 * import java.lang.annotation.ElementType;
 * import java.lang.annotation.Retention;
 * import java.lang.annotation.RetentionPolicy;
 * import java.lang.annotation.Target;
 * import java.util.concurrent.TimeUnit;
 * 
 * @Target(ElementType.METHOD)
 * 
 * @Retention(RetentionPolicy.RUNTIME)
 * public @interface DistributedLock {
 * String key();
 * TimeUnit timeUnit() default TimeUnit.SECONDS;
 * long waitTime() default 5L;
 * long leaseTime() default 3L;
 * }
 */
