package fructose.service;

import fructose.model.Candidature;
import fructose.model.Cv;
import fructose.model.OffreStage;
import fructose.model.Utilisateur;
import fructose.model.enumerator.EtatCandidature;
import fructose.repository.CandidatureRepository;
import fructose.repository.CvRepository;
import fructose.repository.OffreStageRepository;
import fructose.service.dto.UtilisateurDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CandidatureService {
	
	private static final Logger logger = LoggerFactory.getLogger(CandidatureService.class);
	private final CandidatureRepository candidatureRepository;
	private final OffreStageRepository offreStageRepository;
	private final CvRepository cvRepository;
	
	public void postuler(UtilisateurDTO etudiantDTO, Long offreStageId, Long cvDTOId) {
		OffreStage offreStage = offreStageRepository.getReferenceById(offreStageId);
		Utilisateur etudiant = UtilisateurDTO.toEntity(etudiantDTO);
		Cv cv = cvRepository.getReferenceById(cvDTOId);
		
		// Verifier si la condidature n'est pas dupliquée
		Long candidatureCount = candidatureRepository.getCandidatureNumbers(etudiant.getId(), offreStageId);
		
		if (candidatureCount == 0) {
			Candidature candidature = new Candidature();
			candidature.setEtudiant(etudiant);
			candidature.setOffreStage(offreStage);
			candidature.setCv(cv);
			candidature.setEtat(EtatCandidature.EN_ATTENTE);
			candidatureRepository.save(candidature);
		} else {
			throw new IllegalArgumentException("L'utilisateur a déjà soumis une candidature pour ce poste");
		}
	}
	
	public void refuserCandidature(Long candidatureId, String commentaireRefus) {
		try {
			Candidature candidature = candidatureRepository.findById(candidatureId).orElseThrow(() -> new IllegalArgumentException("Candidature avec ID: " + candidatureId + " n'existe pas"));
			candidature.setEtat(EtatCandidature.REFUSEE);
			candidature.setCommentaireRefus(commentaireRefus);
			candidatureRepository.save(candidature);
			System.out.println("ETUDIANT avec email " + candidature.getEtudiant().getEmail() + " a été refusé pour l'offre de stage " + candidature.getOffreStage().getNom() + " chez " + candidature.getOffreStage().getCompagnie() + " avec le commentaire \"" + candidature.getCommentaireRefus() + "\"");
		} catch (Exception e) {
			logger.error("Erreur lors du refus de la candidature avec ID: {}", candidatureId, e);
			throw new RuntimeException("Une erreur est survenue lors du refus de la candidature.", e);
		}
	}
	
	public void approuverCandidature(Long candidatureId) {
		try {
			Candidature candidature = candidatureRepository.findById(candidatureId).orElseThrow(() -> new IllegalArgumentException("Candidature avec ID: " + candidatureId + " n'existe pas"));
			candidature.setEtat(EtatCandidature.APPROUVEE);
			candidatureRepository.save(candidature);
			System.out.println("ETUDIANT: avec email " + candidature.getEtudiant().getEmail() + " a été approuvé pour l'offre de stage " + candidature.getOffreStage().getNom() + " chez " + candidature.getOffreStage().getCompagnie());
		} catch (Exception e) {
			logger.error("Erreur lors de l'approbation de la candidature avec ID: {}", candidatureId, e);
			throw new RuntimeException("Une erreur est survenue lors de l'approbation de la candidature.", e);
		}
	}
	
	public List<Map<String, Object>> getOffreStageDetailsByEtudiantId(Long etudiantId) {
		List<Map<String, Object>> result = new ArrayList<>();
		
		List<Candidature> candidatures = candidatureRepository.findByEtudiantIdWithoutCv(etudiantId);
		
		for (Candidature candidature : candidatures) {
			Map<String, Object> candidatureData = new HashMap<>();
			
			// Ajouter les informations de la candidature
			candidatureData.put("id", candidature.getId());
			candidatureData.put("etat", candidature.getEtat());
			candidatureData.put("commentaireRefus", candidature.getCommentaireRefus());
			
			// Ajouter les informations de l'offre de stage
			OffreStage offreStage = offreStageRepository.findById(candidature.getOffreStage().getId()).orElse(null);
			if (offreStage != null) {
				candidatureData.put("nomOffre", offreStage.getNom());
				candidatureData.put("compagnie", offreStage.getCompagnie());
			}
			
			result.add(candidatureData);
		}
		
		return result;
	}
}