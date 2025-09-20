package com.taskmanager.taskmanagerbackend.config;

import com.taskmanager.taskmanagerbackend.auth.JwtAuthFilter;
import com.taskmanager.taskmanagerbackend.user.User;
import com.taskmanager.taskmanagerbackend.user.UserRepository;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    // ❌ NOTE: Do NOT constructor-inject JwtAuthFilter here.
    // We will accept it as a parameter in filterChain(...) instead to avoid a bean cycle.

    @Bean
    public UserDetailsService userDetailsService(UserRepository repo) {
        return username -> {
            User u = repo.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            return org.springframework.security.core.userdetails.User
                .withUsername(u.getEmail())
                .password(u.getPasswordHash())
                .authorities("USER")
                .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    /** CORS for local dev + your deployed frontend */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "http://127.0.0.1:*",
            // Allow your Azure Container Apps frontend FQDN pattern
            "https://taskmate-frontend.*.canadacentral.azurecontainerapps.io"
        ));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setExposedHeaders(List.of("Authorization"));
        cfg.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    /**
     * IMPORTANT: Accept JwtAuthFilter as a method parameter instead of constructor injection.
     * This breaks the circular dependency reported by Spring.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                // Preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Public API endpoints
                .requestMatchers("/api/auth/**", "/api/health").permitAll()
                // Everything else under /api requires auth
                .requestMatchers("/api/**").authenticated()
                // Non-API resources (if any) are public
                .anyRequest().permitAll()
            )
            // Disable browser Basic-Auth popup (we use JWT)
            .httpBasic(httpBasic -> httpBasic.disable());

        // Register JWT filter before username/password filter
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
