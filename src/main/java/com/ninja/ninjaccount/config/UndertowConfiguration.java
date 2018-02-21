package com.ninja.ninjaccount.config;

import io.github.jhipster.config.JHipsterConstants;
import io.undertow.UndertowOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.embedded.undertow.UndertowEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;
import java.util.Collection;

@Configuration
public class UndertowConfiguration {

    private final Environment env;

    private final Logger log = LoggerFactory.getLogger(UndertowConfiguration.class);

    public UndertowConfiguration(Environment env) {
        this.env = env;
    }

    @Bean
    public UndertowEmbeddedServletContainerFactory embeddedServletContainerFactory() {
        UndertowEmbeddedServletContainerFactory factory = new UndertowEmbeddedServletContainerFactory();
        log.info("Configuring Undertow");
        Collection<String> activeProfiles = Arrays.asList(env.getActiveProfiles());
        boolean isHttpsActive = env.getProperty("server.ssl.key-store") != null;
        boolean userCipherPresent = env.getProperty("server.ssl.ciphers") != null;
        boolean isProdLikeProfileActive = activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_PRODUCTION)
            || activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_TEST);

        if (isHttpsActive && isProdLikeProfileActive) {
            log.info("Adding listener to port 80");
            factory.addBuilderCustomizers(builder -> builder.addHttpListener(80, "0.0.0.0"));
            if(userCipherPresent){
                log.info("Setting user cipher suite order to true");
                factory.addBuilderCustomizers(builder -> builder.setSocketOption(UndertowOptions.SSL_USER_CIPHER_SUITES_ORDER, Boolean.TRUE));
            }
        }

        return factory;
    }
}
