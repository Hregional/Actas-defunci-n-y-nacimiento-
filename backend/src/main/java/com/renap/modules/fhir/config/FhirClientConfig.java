package com.renap.modules.fhir.config;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.client.interceptor.BasicAuthInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración del cliente FHIR para conectarse al servidor OpenHIM.
 * Utiliza HAPI FHIR para consumir recursos Patient según estándar HL7 FHIR R4.
 */
@Configuration
public class FhirClientConfig {

    @Value("${fhir.server.url:https://openhim-qa-router.hro.gob.gt/fhir}")
    private String fhirServerUrl;

    @Value("${fhir.server.username:postman}")
    private String fhirUsername;

    @Value("${fhir.server.password:}")
    private String fhirPassword;

    @Bean
    public FhirContext fhirContext() {
        FhirContext context = FhirContext.forR4();
        // Configurar timeouts más largos para desarrollo
        context.getRestfulClientFactory().setConnectTimeout(60000);
        context.getRestfulClientFactory().setSocketTimeout(60000);
        return context;
    }

    @Bean
    public IGenericClient fhirClient(FhirContext fhirContext) {
        // Log de configuración para debug
        System.out.println("=== FHIR CLIENT CONFIGURATION ===");
        System.out.println("Server URL: " + fhirServerUrl);
        System.out.println("Username: " + fhirUsername);
        System.out.println("Password: " + (fhirPassword != null && !fhirPassword.isEmpty() ? "***SET***" : "NOT SET"));
        
        try {
            // Crear cliente FHIR genérico
            IGenericClient client = fhirContext.newRestfulGenericClient(fhirServerUrl);
            
            // Agregar autenticación básica
            BasicAuthInterceptor authInterceptor = new BasicAuthInterceptor(fhirUsername, fhirPassword);
            client.registerInterceptor(authInterceptor);
            
            System.out.println("FHIR Client created successfully!");
            return client;
            
        } catch (Exception e) {
            System.err.println("ERROR creating FHIR client: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
