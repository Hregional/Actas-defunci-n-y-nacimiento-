package com.renap.modules.fhir.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Configuración de caché para consultas FHIR.
 * Reduce la carga en el servidor FHIR cacheando consultas por CUI e ID.
 */
@Configuration
@EnableCaching
public class FhirCacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                "fhirPatientById",
                "fhirPatientByCui"
        );
        
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(500)                        // Máximo 500 pacientes en caché
                .expireAfterWrite(30, TimeUnit.MINUTES)  // Expirar después de 30 minutos
                .recordStats());                         // Habilitar estadísticas de caché
        
        return cacheManager;
    }
}
