package fructose.service.dto;

import fructose.model.Contrat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ContratSansCvDTO {
    private Long id;
    private Long candidatureId;
    private Long gestionnaireId;
    private String signatureGestionnaire;
    private LocalDate dateSignatureGestionnaire;
    private String signatureEmployeur;
    private LocalDate dateSignatureEmployeur;
    private String signatureEtudiant;
    private LocalDate dateSignatureEtudiant;

    // Constructeur, getters et setters
    public ContratSansCvDTO(Long id, Long candidatureId, Long gestionnaireId, String signatureGestionnaire, LocalDate dateSignatureGestionnaire, String signatureEmployeur, LocalDate dateSignatureEmployeur, String signatureEtudiant, LocalDate dateSignatureEtudiant) {
        this.id = id;
        this.candidatureId = candidatureId;
        this.gestionnaireId = gestionnaireId;
        this.signatureGestionnaire = signatureGestionnaire;
        this.dateSignatureGestionnaire = dateSignatureGestionnaire;
        this.signatureEmployeur = signatureEmployeur;
        this.dateSignatureEmployeur = dateSignatureEmployeur;
        this.signatureEtudiant = signatureEtudiant;
        this.dateSignatureEtudiant = dateSignatureEtudiant;
    }

    public static Contrat toEntity(ContratSansCvDTO contratDTO) {
        Contrat contrat = new Contrat();
        contrat.setId(contratDTO.getId());
        contrat.setSignatureGestionnaire(contratDTO.getSignatureGestionnaire());
        contrat.setDateSignatureGestionnaire(contratDTO.getDateSignatureGestionnaire());
        contrat.setSignatureEmployeur(contratDTO.getSignatureEmployeur());
        contrat.setDateSignatureEmployeur(contratDTO.getDateSignatureEmployeur());
        contrat.setSignatureEtudiant(contratDTO.getSignatureEtudiant());
        contrat.setDateSignatureEtudiant(contratDTO.getDateSignatureEtudiant());
        return contrat;
    }
}