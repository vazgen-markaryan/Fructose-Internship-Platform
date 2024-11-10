package fructose.controller;

import fructose.model.Etudiant;
import fructose.model.OffreStage;
import fructose.service.CandidatureService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping ("/candidatures")
@RequiredArgsConstructor
public class CandidatureController {
	
	private static final Logger logger = LoggerFactory.getLogger(CandidatureController.class);
	private final CandidatureService candidatureService;
	
	@PostMapping ("/postuler")
	@ResponseStatus (HttpStatus.CREATED)
	public void postuler(@RequestBody Etudiant etudiant, @RequestBody OffreStage offreStage) {
		try {
			candidatureService.postuler(etudiant, offreStage);
		} catch (RuntimeException e) {
			logger.error("Erreur lors de la soumission de la candidature", e);
			throw new RuntimeException("Une erreur est survenue lors de la soumission de la candidature.");
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
}