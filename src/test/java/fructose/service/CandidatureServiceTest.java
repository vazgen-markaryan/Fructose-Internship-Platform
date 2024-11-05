package fructose.service;

import fructose.model.Candidature;
import fructose.model.Etudiant;
import fructose.model.OffreStage;
import fructose.model.auth.Credentials;
import fructose.model.enumerator.EtatCandidature;
import fructose.repository.CandidatureRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CandidatureServiceTest {
	
	@InjectMocks
	private CandidatureService candidatureService;
	
	@Mock
	private CandidatureRepository candidatureRepository;
	
	private Etudiant etudiant;
	private OffreStage offreStage;
	private Candidature candidature;
	
	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		
		Credentials credentials = Credentials.builder()
			.email("etudiant@example.com")
			.build();
		etudiant = new Etudiant();
		etudiant.setCredentials(credentials);
		
		offreStage = new OffreStage();
		offreStage.setNom("Stage en Développement");
		offreStage.setCompagnie("TechCorp");
		
		candidature = new Candidature();
		candidature.setId(1L);
		candidature.setEtudiant(etudiant);
		candidature.setOffreStage(offreStage);
		candidature.setEtat(EtatCandidature.EN_ATTENTE);
	}
	
	@Test
	void testPostulerSuccess() {
		when(candidatureRepository.save(any(Candidature.class))).thenReturn(candidature);
		
		candidatureService.postuler(etudiant, offreStage);
		
		verify(candidatureRepository, times(1)).save(any(Candidature.class));
	}
	
	@Test
	void testPostulerException() {
		when(candidatureRepository.save(any(Candidature.class))).thenThrow(new RuntimeException("Database error"));
		
		assertThrows(RuntimeException.class, () -> candidatureService.postuler(etudiant, offreStage));
		
		verify(candidatureRepository, times(1)).save(any(Candidature.class));
	}
	
	@Test
	void testRefuserCandidatureSuccess() {
		when(candidatureRepository.findById(1L)).thenReturn(Optional.of(candidature));
		
		candidatureService.refuserCandidature(1L, "Manque de compétences");
		
		verify(candidatureRepository, times(1)).findById(1L);
		verify(candidatureRepository, times(1)).save(candidature);
	}
	
	@Test
	void testRefuserCandidatureNotFound() {
		when(candidatureRepository.findById(1L)).thenReturn(Optional.empty());
		
		assertThrows(RuntimeException.class, () -> candidatureService.refuserCandidature(1L, "Commentaire"));
		
		verify(candidatureRepository, times(1)).findById(1L);
		verify(candidatureRepository, never()).save(any(Candidature.class));
	}
	
	@Test
	void testApprouverCandidatureSuccess() {
		when(candidatureRepository.findById(1L)).thenReturn(Optional.of(candidature));
		
		candidatureService.approuverCandidature(1L);
		
		verify(candidatureRepository, times(1)).findById(1L);
		verify(candidatureRepository, times(1)).save(candidature);
	}
	
	@Test
	void testApprouverCandidatureNotFound() {
		when(candidatureRepository.findById(1L)).thenReturn(Optional.empty());
		
		assertThrows(RuntimeException.class, () -> candidatureService.approuverCandidature(1L));
		
		verify(candidatureRepository, times(1)).findById(1L);
		verify(candidatureRepository, never()).save(any(Candidature.class));
	}
}