package com.apple.shop.common.lock;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.concurrent.TimeUnit;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface DistributedLock {
    String key(); // Lock key name

    long waitTime() default 5000; // Max wait time for lock (ms)

    long leaseTime() default 3000; // Lock expiration time (ms)

    TimeUnit timeUnit() default TimeUnit.MILLISECONDS;
}
