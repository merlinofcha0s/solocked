package com.ninja.ninjaccount.service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class SrpCacheService {

    private final Logger log = LoggerFactory.getLogger(SrpCacheService.class);

    @Cacheable(cacheNames = "b", key = "#login")
    public String putbInCache(String b, String login) {
        log.info("Caching b : " + b);
        return b;
    }

    @Cacheable(cacheNames = "B", key = "#login")
    public String putBInCache(String B, String login) {
        log.info("Caching B : " + B);
        return B;
    }

}
