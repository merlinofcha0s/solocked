package com.ninja.ninjaccount.config;

import com.ninja.ninjaccount.NinjaccountApp;
import io.github.jhipster.config.JHipsterConstants;
import io.undertow.UndertowOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.embedded.undertow.UndertowEmbeddedServletContainerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Collection;

@Configuration
public class UndertowConfiguration {

    private static final Logger log = LoggerFactory.getLogger(NinjaccountApp.class);

    private final Environment env;

    public UndertowConfiguration(Environment env) {
        this.env = env;
    }

    @Bean
    public UndertowEmbeddedServletContainerFactory embeddedServletContainerFactory() {
        Collection<String> activeProfiles = Arrays.asList(env.getActiveProfiles());
        boolean isHttpsActive = env.getProperty("server.ssl.key-store") != null;

        UndertowEmbeddedServletContainerFactory factory = new UndertowEmbeddedServletContainerFactory();
        if (isHttpsActive && (activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_PRODUCTION)
            || activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_TEST))) {
            factory.addBuilderCustomizers(builder -> {
                try {
                    builder.addHttpListener(80, InetAddress.getLocalHost().getHostAddress());
                } catch (UnknownHostException e) {
                    log.error("Problem to get the ip address when configuring undertow", e);
                }
            });
            factory.addBuilderCustomizers(builder -> builder.setSocketOption(UndertowOptions.SSL_USER_CIPHER_SUITES_ORDER, Boolean.TRUE));
        }

        return factory;
    }

}
