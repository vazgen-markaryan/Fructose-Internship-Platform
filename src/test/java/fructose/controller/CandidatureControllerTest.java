package fructose.controller;

import fructose.model.Etudiant;
import fructose.model.OffreStage;
import fructose.service.CandidatureService;
import fructose.service.UtilisateurService;
import fructose.service.dto.ApplicationStageDTO;
import fructose.service.dto.UtilisateurDTO;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CandidatureControllerTest {
	
	@InjectMocks
	private CandidatureController candidatureController;
	
	@Mock
	private CandidatureService candidatureService;

	@Mock
	private UtilisateurService utilisateurService;
	
	private Etudiant etudiant;
	private OffreStage offreStage;
	
	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
		
		etudiant = new Etudiant();
		offreStage = new OffreStage();
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
		
		assertEquals(mockOffreStageDetails, result);
	}

	@Test
	void testPostulerSuccess() {
		String token = "valid-token";
		ApplicationStageDTO applicationStageDTO = new ApplicationStageDTO();
		applicationStageDTO.setOffreStageId(1L);
		applicationStageDTO.setCvId(1L);

		UtilisateurDTO mockUtilisateur = new UtilisateurDTO();
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(mockUtilisateur);

		ResponseEntity<?> response = candidatureController.postuler(token, applicationStageDTO);

		verify(candidatureService).postuler(mockUtilisateur, applicationStageDTO.getOffreStageId(), applicationStageDTO.getCvId());
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals("Success", response.getBody());
	}

	@Test
	void testPostulerDuplicateCandidature() {
		String token = "valid-token";
		ApplicationStageDTO applicationStageDTO = new ApplicationStageDTO();
		applicationStageDTO.setOffreStageId(1L);
		applicationStageDTO.setCvId(1L);

		UtilisateurDTO mockUtilisateur = new UtilisateurDTO();
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(mockUtilisateur);

		doThrow(new IllegalArgumentException("L'utilisateur a déjà soumis une candidature pour ce poste"))
				.when(candidatureService).postuler(mockUtilisateur, applicationStageDTO.getOffreStageId(), applicationStageDTO.getCvId());

		ResponseEntity<?> response = candidatureController.postuler(token, applicationStageDTO);

		verify(candidatureService).postuler(mockUtilisateur, applicationStageDTO.getOffreStageId(), applicationStageDTO.getCvId());
		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertEquals("L'utilisateur a déjà soumis une candidature pour ce poste", response.getBody());
	}

	@Test
	void testPostulerRuntimeException() {
		String token = "valid-token";
		ApplicationStageDTO applicationStageDTO = new ApplicationStageDTO();
		applicationStageDTO.setOffreStageId(1L);
		applicationStageDTO.setCvId(1L);

		UtilisateurDTO mockUtilisateur = new UtilisateurDTO();
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(mockUtilisateur);

		doThrow(new RuntimeException("Erreur lors de la soumission de la candidature"))
				.when(candidatureService).postuler(mockUtilisateur, applicationStageDTO.getOffreStageId(), applicationStageDTO.getCvId());

		ResponseEntity<?> response = candidatureController.postuler(token, applicationStageDTO);

		verify(candidatureService).postuler(mockUtilisateur, applicationStageDTO.getOffreStageId(), applicationStageDTO.getCvId());
		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertEquals("Erreur lors de la soumission de la candidature", response.getBody());
	}

	@Test
	void testGetCandidaturesByOffreStageIdSuccess() {
		String token = "valid-token";

		List<Map<String, Object>> mockCandidatures = new ArrayList<>();
		Map<String, Object> candidatureData = new HashMap<>();
		candidatureData.put("id", 1L);
		candidatureData.put("etat", "Approuvé");
		candidatureData.put("commentaireRefus", "Pas de compétences requises");
		mockCandidatures.add(candidatureData);

		when(utilisateurService.validationToken(token)).thenReturn(true);
		UtilisateurDTO mockUtilisateur = new UtilisateurDTO();
		mockUtilisateur.setId(1L);
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(mockUtilisateur);
		when(candidatureService.findByCandidatureByOwner(mockUtilisateur.getId())).thenReturn(mockCandidatures);

		ResponseEntity<List<Map<String, Object>>> response = candidatureController.findByCandidatureByOwner(token);

		verify(utilisateurService, times(1)).validationToken(token);
		verify(utilisateurService, times(1)).getUtilisateurByToken(token);
		verify(candidatureService, times(1)).findByCandidatureByOwner(mockUtilisateur.getId());

		Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
		Assertions.assertEquals(mockCandidatures, response.getBody());
	}

	@Test
	void testGetCandidaturesByOffreStageIdException() {
		String token = "valid-token";

		when(utilisateurService.validationToken(token)).thenReturn(true);
		UtilisateurDTO mockUtilisateur = new UtilisateurDTO();
		mockUtilisateur.setId(1L);
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(mockUtilisateur);
		when(candidatureService.findByCandidatureByOwner(mockUtilisateur.getId()))
				.thenThrow(new RuntimeException("Database error"));

		ResponseEntity<List<Map<String, Object>>> response = candidatureController.findByCandidatureByOwner(token);

		verify(utilisateurService, times(1)).validationToken(token);
		verify(utilisateurService, times(1)).getUtilisateurByToken(token);
		verify(candidatureService, times(1)).findByCandidatureByOwner(mockUtilisateur.getId());

		Assertions.assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
		Assertions.assertNull(response.getBody());
	}
}