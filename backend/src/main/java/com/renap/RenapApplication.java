package com.renap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import com.renap.shared.integration.icd.IcdApiProperties;
import com.renap.shared.integration.keycloak.KeycloakProperties;
import com.renap.shared.integration.rh.RhApiProperties;

@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties({KeycloakProperties.class, RhApiProperties.class, IcdApiProperties.class})
public class RenapApplication {
    public static void main(String[] args) {
        SpringApplication.run(RenapApplication.class, args);
    }
}
