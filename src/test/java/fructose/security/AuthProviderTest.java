package fructose.security;

import fructose.model.Departement;
import fructose.model.Utilisateur;
import fructose.repository.UtilisateurRepository;
import fructose.security.exception.AuthenticationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthProviderTest {
	
	@Mock
	private PasswordEncoder passwordEncoder;
	
	@Mock
	private UtilisateurRepository utilisateurRepository;
	
	@InjectMocks
	private AuthProvider authProvider;
	
	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}
	
	@Test
	void testAuthenticate_Failure() {
		String email = "vazgen@gmail.com";
		String password = "Vazgen123!";
		Utilisateur user = new Utilisateur("Vazgen Markaryan", email, password, "1234567", null,new Departement(), "Company");
		
		when(utilisateurRepository.findByEmail(email)).thenReturn(user);
		when(passwordEncoder.matches(password, user.getPassword())).thenReturn(false);
		
		Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
		
		assertThrows(AuthenticationException.class, () -> {
			authProvider.authenticate(authentication);
		});
	}
	
	@Test
	void testSupports() {
		assertTrue(authProvider.supports(UsernamePasswordAuthenticationToken.class));
	}
}