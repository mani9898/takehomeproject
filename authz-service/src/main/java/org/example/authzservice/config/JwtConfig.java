package org.example.authzservice.config;

import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import java.io.FileInputStream;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Objects;

@Configuration
public class JwtConfig {

    private final Environment env;

    public JwtConfig(Environment env) {
        this.env = env;
    }
    
    @Value("${security.jwt.key-store.location}")
    private String keystorePath;
    
    @Value("${security.jwt.key-store.password}")
    private String keystorePassword;
    
    @Value("${security.jwt.key-store.alias}")
    private String keyAlias;
    
    @Bean
    public RSAKey rsaKey() throws Exception {
        if (Objects.isNull(keystorePath) || Objects.isNull(keystorePassword) || Objects.isNull(keyAlias)) {
            throw new IllegalStateException("Missing JWT keystore configuration: ensure security.jwt.key-store.{location,password,alias} are set");
        }

        KeyStore ks = KeyStore.getInstance("JKS");
        String resourcePath = keystorePath.startsWith("classpath:") ? keystorePath.substring("classpath:".length()) : keystorePath;

        try (InputStream is = keystorePath.startsWith("classpath:")
                ? getClass().getClassLoader().getResourceAsStream(resourcePath)
                : new FileInputStream(resourcePath)) {

            if (is == null) {
                throw new IllegalStateException("Keystore not found at: " + keystorePath);
            }
            ks.load(is, keystorePassword.toCharArray());
        }

        KeyStore.PrivateKeyEntry entry = (KeyStore.PrivateKeyEntry) ks.getEntry(
                keyAlias, new KeyStore.PasswordProtection(keystorePassword.toCharArray()));
        if (entry == null) {
            throw new IllegalStateException("No key entry found for alias: " + keyAlias);
        }

        RSAPublicKey publicKey = (RSAPublicKey) entry.getCertificate().getPublicKey();
        RSAPrivateKey privateKey = (RSAPrivateKey) entry.getPrivateKey();

        return new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(keyAlias)
                .build();
    }

    @Bean
    public JWKSet jwkSet(RSAKey rsaKey) {
        return new JWKSet(rsaKey);
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource(JWKSet jwkSet) {
        return (selector, context) -> selector.select(jwkSet);
    }

    @Bean
    public JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) {
        return new NimbusJwtEncoder(jwkSource);
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
