package fructose.controller;

import fructose.model.Etudiant;
import fructose.model.OffreStage;
import fructose.service.CandidatureService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CandidatureControllerTest {
	
	@InjectMocks
	private CandidatureController candidatureController;
	
	@Mock
	private CandidatureService candidatureService;
	
	private Etudiant etudiant;
	private OffreStage offreStage;
	
	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		
		etudiant = new Etudiant();
		offreStage = new OffreStage();
	}
	
	@Test
	void testPostulerSuccess() {
		
		candidatureController.postuler(etudiant, offreStage);
		verify(candidatureService).postuler(etudiant, offreStage);
	}
	
	@Test
	void testPostulerException() {
		// Configurer le service pour lancer une exception
		doThrow(new RuntimeException("Erreur de base de données")).when(candidatureService).postuler(any(Etudiant.class), any(OffreStage.class));
		
		try {
			candidatureController.postuler(etudiant, offreStage);
		} catch (RuntimeException e) {
			assert e.getMessage().equals("Une erreur est survenue lors de la soumission de la candidature.");
		}
		
		verify(candidatureService).postuler(etudiant, offreStage);
	}
	
	@Test
	void testApprouverCandidatureSuccess() {
		Long candidatureId = 1L;
		
		candidatureController.approuverCandidature(candidatureId);
		
		verify(candidatureService).approuverCandidature(candidatureId);
	}
	
	@Test
	void testApprouverCandidatureException() {
		Long candidatureId = 1L;
		
		doThrow(new RuntimeException("Erreur lors de l'approbation")).when(candidatureService).approuverCandidature(candidatureId);
		
		try {
			candidatureController.approuverCandidature(candidatureId);
		} catch (RuntimeException e) {
			assert e.getMessage().equals("Une erreur est survenue lors de l'approbation de la candidature.");
		}
		
		verify(candidatureService).approuverCandidature(candidatureId);
	}
	
	@Test
	void testRefuserCandidatureSuccess() {
		Long candidatureId = 1L;
		String commentaireRefus = "Pas de compétences requises";
		
		candidatureController.refuserCandidature(candidatureId, commentaireRefus);
		
		verify(candidatureService).refuserCandidature(candidatureId, commentaireRefus);
	}
	
	@Test
	void testRefuserCandidatureException() {
		Long candidatureId = 1L;
		String commentaireRefus = "Commentaire";
		
		doThrow(new RuntimeException("Erreur lors du refus")).when(candidatureService).refuserCandidature(candidatureId, commentaireRefus);
		
		try {
			candidatureController.refuserCandidature(candidatureId, commentaireRefus);
		} catch (RuntimeException e) {
			assert e.getMessage().equals("Une erreur est survenue lors du refus de la candidature.");
		}
		
		verify(candidatureService).refuserCandidature(candidatureId, commentaireRefus);
	}
	
	@Test
	void testGetOffreStageDetailsByEtudiantId() {
		Long etudiantId = 1L;
		
		List<Map<String, Object>> mockOffreStageDetails = new ArrayList<>();
		Map<String, Object> offreStageDetail = new HashMap<>();
		offreStageDetail.put("id", 1L);
		offreStageDetail.put("titre", "Développeur Java");
		offreStageDetail.put("description", "Stage de développement Java pour étudiant.");
		mockOffreStageDetails.add(offreStageDetail);
		
		when(candidatureService.getOffreStageDetailsByEtudiantId(etudiantId)).thenReturn(mockOffreStageDetails);
		
		List<Map<String, Object>> result = candidatureController.getOffreStageDetailsByEtudiantId(etudiantId);
		
		verify(candidatureService).getOffreStageDetailsByEtudiantId(etudiantId);
		
		Assertions.assertEquals(mockOffreStageDetails, result);
	}
}