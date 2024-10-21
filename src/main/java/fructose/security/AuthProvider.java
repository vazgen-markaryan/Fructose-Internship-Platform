package fructose.security;

import fructose.security.exception.AuthenticationException;
import fructose.model.Utilisateur;
import fructose.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthProvider implements AuthenticationProvider {
    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository userAppRepository;

    @Override
    public Authentication authenticate(Authentication authentication) {
        try {
            Utilisateur user = loadUserByEmail(authentication.getPrincipal().toString());

            validateAuthentication(authentication, user);
            return new UsernamePasswordAuthenticationToken(
                    user.getEmail(),
                    user.getPassword(),
                    user.getAuthorities()
            );
        } catch (Exception e) {
            throw new AuthenticationException(HttpStatus.FORBIDDEN, "Courriel ou mot de passe invalide");
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }

    private Utilisateur loadUserByEmail(String email) throws UsernameNotFoundException {
        return userAppRepository.findByEmail(email);
    }

    private void validateAuthentication(Authentication authentication, Utilisateur user) {
        if (!passwordEncoder.matches(authentication.getCredentials().toString(), user.getPassword())) {
            throw new AuthenticationException(HttpStatus.FORBIDDEN, "Incorrect username or password");
        }
    }
}