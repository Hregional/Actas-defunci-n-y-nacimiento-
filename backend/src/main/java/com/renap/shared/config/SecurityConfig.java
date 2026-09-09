package com.renap.shared.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.*;
import java.util.Collections;
import org.springframework.lang.NonNull;

/**
 * Configuración de seguridad: valida tokens JWT emitidos por Keycloak.
 *
 * - Todos los endpoints /api/** requieren JWT válido
 * - /api/admin/** adicionalmente requiere client role "actas-admin"
 * - Los client roles de "sistema-actas-frontend" se extraen de
 *   resource_access.sistema-actas-frontend.roles y se registran con prefijo ROLE_
 *
 * En application.yml debe existir:
 *   spring.security.oauth2.resourceserver.jwt.jwk-set-uri: https://sso.hro.gob.gt/realms/Hospital-O/protocol/openid-connect/certs
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String CLIENT_ID = "sistema-actas-frontend";

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Actuator health libre
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                // Admin solo para actas-admin
                .requestMatchers("/admin/**").hasRole("actas-admin")
                // Todo lo demás requiere autenticación
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter()))
            );

        return http.build();
    }

    /**
     * Extrae los roles del token JWT de Keycloak.
     * Lee tanto realm_access.roles como resource_access.{clientId}.roles
     * y los registra con prefijo ROLE_ para que funcione hasRole().
     * 
     * IMPORTANTE: Solo acepta tokens emitidos específicamente para este cliente
     * validando el claim 'azp' (authorized party) o 'aud' (audience).
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRolesConverter());
        return converter;
    }

    static class KeycloakRolesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

        @Override
        @NonNull
        @SuppressWarnings({"unchecked", "null"})
        public Collection<GrantedAuthority> convert(@NonNull Jwt jwt) {
            List<GrantedAuthority> authorities = new ArrayList<>();

            // VALIDACIÓN CRÍTICA: Verificar que el token es para este cliente
            String azp = jwt.getClaimAsString("azp");  // authorized party
            List<String> aud = jwt.getClaimAsStringList("aud");  // audience
            
            boolean tokenParaEsteCliente = CLIENT_ID.equals(azp) || 
                                          (aud != null && aud.contains(CLIENT_ID));
            
            if (!tokenParaEsteCliente) {
                // Token de otro sistema - NO otorgar roles
                return Collections.emptyList();
            }

            // 1. Realm roles
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess != null && realmAccess.get("roles") instanceof List<?> realmRoles) {
                realmRoles.stream()
                    .map(Object::toString)
                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                    .forEach(authorities::add);
            }

            // 2. Client roles de sistema-actas-frontend
            Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
            if (resourceAccess != null && resourceAccess.get(CLIENT_ID) instanceof Map<?, ?> clientAccess) {
                Object roles = ((Map<String, Object>) clientAccess).get("roles");
                if (roles instanceof List<?> clientRoles) {
                    clientRoles.stream()
                        .map(Object::toString)
                        .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                        .forEach(authorities::add);
                }
            }

            return authorities;
        }
    }
}
