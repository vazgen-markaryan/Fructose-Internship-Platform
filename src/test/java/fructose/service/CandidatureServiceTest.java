package fructose.service;

import fructose.model.*;
import fructose.model.auth.Credentials;
import fructose.model.enumerator.EtatCandidature;
import fructose.model.enumerator.Role;
import fructose.repository.CandidatureRepository;
import fructose.repository.OffreStageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CandidatureServiceTest {
	
	@InjectMocks
	private CandidatureService candidatureService;
	
	@Mock
	private CandidatureRepository candidatureRepository;
	
	@Mock
	private OffreStageRepository offreStageRepository;
	
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

	@Test
	void testGetOffreStageDetailsByEtudiantId() {
		Long etudiantId = 1L;

		List<Candidature> candidatures = Collections.singletonList(candidature);
		when(candidatureRepository.findByEtudiantIdWithoutCv(etudiantId)).thenReturn(candidatures);

		when(offreStageRepository.findById(offreStage.getId())).thenReturn(Optional.of(offreStage));

		List<Map<String, Object>> result = candidatureService.getOffreStageDetailsByEtudiantId(etudiantId);

		verify(candidatureRepository, times(1)).findByEtudiantIdWithoutCv(etudiantId);
		verify(offreStageRepository, times(1)).findById(offreStage.getId());

		Map<String, Object> expectedData = new HashMap<>();
		expectedData.put("id", candidature.getId());
		expectedData.put("etat", candidature.getEtat());
		expectedData.put("commentaireRefus", candidature.getCommentaireRefus());
		expectedData.put("nomOffre", offreStage.getNom());
		expectedData.put("compagnie", offreStage.getCompagnie());

		List<Map<String, Object>> expected = Collections.singletonList(expectedData);

		assertEquals(expected, result);
	}
	@Test
	void testGetCandidaturesByOffreStageIdSuccess() {
		Long offreStageId = 1L;

		List<Candidature> candidatures = new ArrayList<>();
		Candidature candidature = new Candidature();
		candidature.setId(1L);
		candidature.setEtat(EtatCandidature.EN_ATTENTE);
		candidature.setCommentaireRefus("N/A");

		Utilisateur etudiant = new Utilisateur();
		etudiant.setFullName("John Doe");
		etudiant.setCredentials(Credentials.builder().email("Mike@gmail.com").password("GG").role(Role.EMPLOYEUR).build());
		candidature.setEtudiant(etudiant);

		Cv cv = new Cv();
		cv.setId(1L);
		candidature.setCv(cv);

		candidatures.add(candidature);

		when(candidatureRepository.findByOffreStageId(offreStageId)).thenReturn(candidatures);

		List<Map<String, Object>> result = candidatureService.getCandidaturesByOffreStageId(offreStageId);

		verify(candidatureRepository, times(1)).findByOffreStageId(offreStageId);

		Map<String, Object> expectedData = new HashMap<>();
		expectedData.put("id", candidature.getId());
		expectedData.put("etat", candidature.getEtat());
		expectedData.put("commentaireRefus", candidature.getCommentaireRefus());
		expectedData.put("etudiantNom", etudiant.getFullName());
		expectedData.put("etudiantEmail", etudiant.getEmail());
		expectedData.put("cvId", cv.getId());

		List<Map<String, Object>> expected = Collections.singletonList(expectedData);

		assertEquals(expected, result);
	}

	@Test
	void testGetCandidaturesByOffreStageIdNoCandidatures() {
		Long offreStageId = 1L;

		// Mock an empty list
		when(candidatureRepository.findByOffreStageId(offreStageId)).thenReturn(Collections.emptyList());

		// Execute service method
		List<Map<String, Object>> result = candidatureService.getCandidaturesByOffreStageId(offreStageId);

		// Verify repository interaction
		verify(candidatureRepository, times(1)).findByOffreStageId(offreStageId);

		// Assert the result is an empty list
		assertTrue(result.isEmpty());
	}
}