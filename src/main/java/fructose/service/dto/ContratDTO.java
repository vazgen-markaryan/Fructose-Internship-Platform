package fructose.service.dto;

import fructose.model.Contrat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;


@Data
public class ContratDTO {
    private Long id;

    @NotNull
    private AdminDTO gestionnaire;

    @NotNull
    private EmployeurDTO employeur;

    @NotNull
    private EtudiantDTO etudiant;

    @NotNull
    private OffreStageDTO offreStage;

    @NotBlank
    private String signatureGestionnaire;

    private LocalDate dateSignatureGestionnaire;

    @NotBlank
    private String signatureEmployeur;

    private LocalDate dateSignatureEmployeur;

    @NotBlank
    private String signatureEtudiant;

    private LocalDate dateSignatureEtudiant;

    public static ContratDTO toDTO(Contrat contrat) {
        ContratDTO contratDTO = new ContratDTO();
        contratDTO.setId(contrat.getId());
        contratDTO.setGestionnaire(AdminDTO.toDTO(contrat.getGestionnaire()));
        contratDTO.setEmployeur(EmployeurDTO.toDTO(contrat.getEmployeur()));
        contratDTO.setEtudiant(EtudiantDTO.toDTO(contrat.getEtudiant()));
        contratDTO.setOffreStage(OffreStageDTO.toDTO(contrat.getOffreStage()));
        contratDTO.setSignatureGestionnaire(contrat.getSignatureGestionnaire());
        contratDTO.setDateSignatureGestionnaire(contrat.getDateSignatureGestionnaire());
        contratDTO.setSignatureEmployeur(contrat.getSignatureEmployeur());
        contratDTO.setDateSignatureEmployeur(contrat.getDateSignatureEmployeur());
        contratDTO.setSignatureEtudiant(contrat.getSignatureEtudiant());
        contratDTO.setDateSignatureEtudiant(contrat.getDateSignatureEtudiant());
        return contratDTO;
    }

    public static Contrat toEntity(ContratDTO contratDTO) {
        Contrat contrat = new Contrat();
        contrat.setId(contratDTO.getId());
        contrat.setGestionnaire(AdminDTO.toEntity(contratDTO.getGestionnaire()));
        contrat.setEmployeur(EmployeurDTO.toEntity(contratDTO.getEmployeur()));
        contrat.setEtudiant(EtudiantDTO.toEntity(contratDTO.getEtudiant()));
        contrat.setOffreStage(OffreStageDTO.toEntity(contratDTO.getOffreStage()));
        contrat.setSignatureGestionnaire(contratDTO.getSignatureGestionnaire());
        contrat.setDateSignatureGestionnaire(contratDTO.getDateSignatureGestionnaire());
        contrat.setSignatureEmployeur(contratDTO.getSignatureEmployeur());
        contrat.setDateSignatureEmployeur(contratDTO.getDateSignatureEmployeur());
        contrat.setSignatureEtudiant(contratDTO.getSignatureEtudiant());
        contrat.setDateSignatureEtudiant(contratDTO.getDateSignatureEtudiant());
        return contrat;
    }
}