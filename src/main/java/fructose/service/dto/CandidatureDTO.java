package fructose.service.dto;

import fructose.model.Candidature;
import fructose.model.enumerator.EtatCandidature;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidatureDTO {
	private Long id;
	private UtilisateurDTO etudiantDTO;
	private OffreStageDTO offreStageDTO;
	private EtatCandidature etat;
	private String commentaireRefus;
	private LocalDateTime dateEtrevue;
	private boolean acceptedByEtudiant = false;
	
	public static CandidatureDTO toDTO(Candidature candidature) {
		CandidatureDTO candidatureDTO = new CandidatureDTO();
		candidatureDTO.setId(candidature.getId());
		candidatureDTO.setEtudiantDTO(EtudiantDTO.toDTO(candidature.getEtudiant()));
		candidatureDTO.setOffreStageDTO(OffreStageDTO.toDTO(candidature.getOffreStage()));
		candidatureDTO.setEtat(candidature.getEtat());
		candidatureDTO.setCommentaireRefus(candidature.getCommentaireRefus());
		candidatureDTO.setDateEtrevue(candidature.getDateEtrevue());
		candidatureDTO.setAcceptedByEtudiant(candidature.isAcceptedByEtudiant());
		return candidatureDTO;
	}
	
	public static Candidature toEntity(CandidatureDTO candidatureDTO) {
		Candidature candidature = new Candidature();
		candidature.setId(candidatureDTO.getId());
		candidature.setEtudiant(EtudiantDTO.toEntity(candidatureDTO.getEtudiantDTO()));
		candidature.setOffreStage(OffreStageDTO.toEntity(candidatureDTO.getOffreStageDTO()));
		candidature.setEtat(candidatureDTO.getEtat());
		candidature.setCommentaireRefus(candidatureDTO.getCommentaireRefus());
		candidature.setDateEtrevue(candidatureDTO.getDateEtrevue());
		candidature.setAcceptedByEtudiant(candidatureDTO.isAcceptedByEtudiant());
		return candidature;
	}
}