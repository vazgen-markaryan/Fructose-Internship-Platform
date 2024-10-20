package fructose.security;

import fructose.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenProvider tokenProvider;
    private final UtilisateurRepository userRepository;

    // Injection via constructeur
    @Autowired
    public SecurityConfig(JwtTokenProvider tokenProvider, UtilisateurRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/creer-utilisateur").permitAll()
                        .requestMatchers(HttpMethod.POST, "/connexion").permitAll()
                        .requestMatchers(HttpMethod.GET, "/check-email").permitAll()
                        .requestMatchers(HttpMethod.GET, "/check-matricule").permitAll()
                        .requestMatchers(HttpMethod.GET, "/check-departement").permitAll()
                        .requestMatchers(HttpMethod.POST, "/creer-offre-stage").permitAll()
                        .requestMatchers(HttpMethod.POST, "/infos-utilisateur").permitAll()
                        .anyRequest().authenticated()
                ).addFilterBefore(new JwtAuthentificationFilter(tokenProvider, userRepository), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}