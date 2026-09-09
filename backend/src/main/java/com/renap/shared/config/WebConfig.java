package com.renap.shared.config;

import com.renap.shared.integration.rh.RhApiProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * Configuración web: CORS y RestTemplate.
 *
 * <p>Se usa {@link SimpleClientHttpRequestFactory} en lugar de HttpClient 5
 * para evitar advertencias de null-safety del IDE con {@code CloseableHttpClient}.
 * {@code SimpleClientHttpRequestFactory} es parte del core de Spring, no requiere
 * dependencias adicionales y soporta timeouts de conexión y lectura.
 */
@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setExposedHeaders(List.of("Authorization", "Content-Disposition"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    /**
     * RestTemplate con timeouts leídos desde {@code rh-api.*} en application.yml.
     * Usado por {@code KeycloakTokenService} y {@code RhApiClient}.
     */
    @Bean
    public RestTemplate restTemplate(RhApiProperties rhApiProperties) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(rhApiProperties.getConnectTimeoutMs());
        factory.setReadTimeout(rhApiProperties.getReadTimeoutMs());
        return new RestTemplate(factory);
    }
}
