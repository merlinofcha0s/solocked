package com.ninja.ninjaccount.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Ninjaccount.
 * <p>
 * Properties are configured in the application.yml file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final ApplicationProperties.Paypal paypal = new ApplicationProperties.Paypal();
    private final ApplicationProperties.Base base = new ApplicationProperties.Base();

    public ApplicationProperties() {
    }

    public static class Paypal {
        private String clientId;
        private String clientSecret;
        private String mode;

        public Paypal() {
        }

        public String getMode() {
            return mode;
        }

        public void setMode(String mode) {
            this.mode = mode;
        }

        public String getClientId() {
            return clientId;
        }

        public void setClientId(String clientId) {
            this.clientId = clientId;
        }

        public String getClientSecret() {
            return clientSecret;
        }

        public void setClientSecret(String clientSecret) {
            this.clientSecret = clientSecret;
        }
    }

    public static class Base {
        private String url;

        public Base() {
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }

    public Paypal getPaypal() {
        return paypal;
    }

    public Base getBase() {
        return base;
    }
}
