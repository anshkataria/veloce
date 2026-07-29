package com.veloce.api.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;

/**
 * {@code @EnableCaching} lives on {@code ApiApplication}, so every
 * {@code @WebMvcTest} slice picks it up as its {@code @SpringBootConfiguration}
 * source and needs a CacheManager bean to satisfy the caching AOP
 * infrastructure, even though the mocked services never actually hit the cache.
 */
@TestConfiguration
public class TestCacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager();
    }
}
