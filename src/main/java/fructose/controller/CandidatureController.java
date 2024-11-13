package fructose.controller;

import fructose.service.CandidatureService;
import fructose.service.UtilisateurService;
import fructose.service.dto.ApplicationStageDTO;
import fructose.service.dto.UtilisateurDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping ("/candidatures")
@RequiredArgsConstructor
public class CandidatureController {

	private static final Logger logger = LoggerFactory.getLogger(CandidatureController.class);
	private final CandidatureService candidatureService;
	private final UtilisateurService utilisateurService;

	@PostMapping ("/postuler")
	@ResponseStatus (HttpStatus.CREATED)
	public ResponseEntity<?> postuler(@RequestHeader ("Authorization") String token, @RequestBody ApplicationStageDTO applicationStageDTO) {
		UtilisateurDTO utilisateurDTO = utilisateurService.getUtilisateurByToken(token);
		try {
			candidatureService.postuler(utilisateurDTO, applicationStageDTO.getOffreStageId(), applicationStageDTO.getCvId());
			return new ResponseEntity<>("Success", HttpStatus.OK);
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		} catch (RuntimeException e) {
			logger.error("Erreur lors de la soumission de la candidature", e);
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@PutMapping ("/approuver/{candidatureId}")
	@ResponseStatus (HttpStatus.OK)
	public void approuverCandidature(@PathVariable Long candidatureId) {
		try {
			candidatureService.approuverCandidature(candidatureId);
		} catch (RuntimeException e) {
			logger.error("Erreur lors de l'approbation de la candidature avec ID: {}", candidatureId, e);
			throw new RuntimeException("Une erreur est survenue lors de l'approbation de la candidature.");
		}
	}

	@PutMapping ("/refuser/{candidatureId}")
	@ResponseStatus (HttpStatus.OK)
	public void refuserCandidature(@PathVariable Long candidatureId, @RequestParam String commentaireRefus) {
		try {
			candidatureService.refuserCandidature(candidatureId, commentaireRefus);
		} catch (RuntimeException e) {
			logger.error("Erreur lors du refus de la candidature avec ID: {}", candidatureId, e);
			throw new RuntimeException("Une erreur est survenue lors du refus de la candidature.");
		}
	}
	
	@GetMapping ("/etudiant/{etudiantId}")
	public List<Map<String, Object>> getOffreStageDetailsByEtudiantId(@PathVariable Long etudiantId) {
		return candidatureService.getOffreStageDetailsByEtudiantId(etudiantId);
	}

	@GetMapping("/candiatruesEmployeur")
	public ResponseEntity<List<Map<String, Object>>> findByCandidatureByOwner(@RequestHeader("Authorization") String token) {
		if (!utilisateurService.validationToken(token)) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		UtilisateurDTO utilisateurDTO = utilisateurService.getUtilisateurByToken(token);

		try {
			List<Map<String, Object>> candidatures = candidatureService.findByCandidatureByOwner(utilisateurDTO.getId());
			return new ResponseEntity<>(candidatures, HttpStatus.OK);
		} catch (RuntimeException e) {
			logger.error("Erreur lors de la récupération des candidatures pour l'offre de stage ID: {}", utilisateurDTO.getId(), e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}