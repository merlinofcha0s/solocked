package com.ninja.ninjaccount.config;

import io.github.jhipster.config.JHipsterProperties;
import io.undertow.Undertow;
import io.undertow.UndertowOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.embedded.undertow.UndertowBuilderCustomizer;
import org.springframework.boot.web.embedded.undertow.UndertowServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnClass({UndertowServletWebServerFactory.class})
@ConditionalOnProperty("server.ssl.ciphers")
public class UndertowNinjaConfig {

    private final Logger log = LoggerFactory.getLogger(UndertowNinjaConfig.class);

//    @Bean
//    public UndertowServletWebServerFactory servletWebServerFactory() {
//        UndertowServletWebServerFactory factory = new UndertowServletWebServerFactory();
//        factory.addBuilderCustomizers((UndertowBuilderCustomizer) builder -> {
//            log.info("listening to http port");
//            builder.addHttpListener(80, "0.0.0.0");
//            log.info("Forcing cipher order");
//            builder.setSocketOption(UndertowOptions.SSL_USER_CIPHER_SUITES_ORDER, Boolean.TRUE);
//        });
//        return factory;
//    }
}
