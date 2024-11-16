package fructose.service.dto;

import fructose.model.Contrat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;



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

    @NotBlank
    private String signatureEmployeur;

    @NotBlank
    private String signatureEtudiant;

    public static ContratDTO toDTO(Contrat contrat) {
        ContratDTO contratDTO = new ContratDTO();
        contratDTO.setId(contrat.getId());
        contratDTO.setGestionnaire(AdminDTO.toDTO(contrat.getGestionnaire()));
        contratDTO.setEmployeur(EmployeurDTO.toDTO(contrat.getEmployeur()));
        contratDTO.setEtudiant(EtudiantDTO.toDTO(contrat.getEtudiant()));
        contratDTO.setOffreStage(OffreStageDTO.toDTO(contrat.getOffreStage()));
        contratDTO.setSignatureGestionnaire(contrat.getSignatureGestionnaire());
        contratDTO.setSignatureEmployeur(contrat.getSignatureEmployeur());
        contratDTO.setSignatureEtudiant(contrat.getSignatureEtudiant());
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
        contrat.setSignatureEmployeur(contratDTO.getSignatureEmployeur());
        contrat.setSignatureEtudiant(contratDTO.getSignatureEtudiant());
        return contrat;
    }
}
