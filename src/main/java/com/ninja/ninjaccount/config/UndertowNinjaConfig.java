package com.ninja.ninjaccount.config;

import io.github.jhipster.config.JHipsterProperties;
import io.undertow.UndertowOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.embedded.undertow.UndertowBuilderCustomizer;
import org.springframework.boot.web.embedded.undertow.UndertowServletWebServerFactory;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnClass({UndertowServletWebServerFactory.class})
@ConditionalOnProperty({"server.ssl.ciphers", "server.ssl.key-store"})
public class UndertowNinjaConfig {

    private final UndertowServletWebServerFactory factory;
    private final Logger log = LoggerFactory.getLogger(UndertowNinjaConfig.class);

    public UndertowNinjaConfig(UndertowServletWebServerFactory undertowServletWebServerFactory) {
        this.factory = undertowServletWebServerFactory;
        this.listenToPortHTTP();
    }

    private void listenToPortHTTP() {
        this.log.info("Opening http port");
        this.factory.addBuilderCustomizers((builder) -> {
            builder.addHttpListener(80, "0.0.0.0");
        });
    }
}
