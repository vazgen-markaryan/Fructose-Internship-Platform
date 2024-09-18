package fructose.service.dto;

import fructose.model.OffreStage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OffreStageDTO {
    private String nom;
    private String poste;
    private String description;
    private String compagnie;
    private String programmeEtude;
    private String tauxHoraire;
    private String typeEmploi;
    private String adresse;
    private String modaliteTravail;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String dureeStage;
    private String nombreHeuresSemaine;
    private int nombrePostes;
    private LocalDate dateLimiteCandidature;

    public static OffreStageDTO toDTO(OffreStage offreStage) {
        OffreStageDTO offreStageDTO = new OffreStageDTO();
        offreStageDTO.setNom(offreStage.getNom());
        offreStageDTO.setPoste(offreStage.getPoste());
        offreStageDTO.setDescription(offreStage.getDescription());
        offreStageDTO.setCompagnie(offreStage.getCompagnie());
        offreStageDTO.setProgrammeEtude(offreStage.getProgrammeEtude());
        offreStageDTO.setTauxHoraire(offreStage.getTauxHoraire());
        offreStageDTO.setTypeEmploi(offreStage.getTypeEmploi());
        offreStageDTO.setAdresse(offreStage.getAdresse());
        offreStageDTO.setModaliteTravail(offreStage.getModaliteTravail());
        offreStageDTO.setDateDebut(offreStage.getDateDebut());
        offreStageDTO.setDateFin(offreStage.getDateFin());
        offreStageDTO.setDureeStage(offreStage.getDureeStage());
        offreStageDTO.setNombreHeuresSemaine(offreStage.getNombreHeuresSemaine());
        offreStageDTO.setNombrePostes(offreStage.getNombrePostes());
        offreStageDTO.setDateLimiteCandidature(offreStage.getDateLimiteCandidature());
        return offreStageDTO;
    }

    public static OffreStage toEntity(OffreStageDTO offreStageDTO) {
        OffreStage offreStage = new OffreStage();
        offreStage.setNom(offreStageDTO.getNom());
        offreStage.setPoste(offreStageDTO.getPoste());
        offreStage.setDescription(offreStageDTO.getDescription());
        offreStage.setCompagnie(offreStageDTO.getCompagnie());
        offreStage.setProgrammeEtude(offreStageDTO.getProgrammeEtude());
        offreStage.setTauxHoraire(offreStageDTO.getTauxHoraire());
        offreStage.setTypeEmploi(offreStageDTO.getTypeEmploi());
        offreStage.setAdresse(offreStageDTO.getAdresse());
        offreStage.setModaliteTravail(offreStageDTO.getModaliteTravail());
        offreStage.setDateDebut(offreStageDTO.getDateDebut());
        offreStage.setDateFin(offreStageDTO.getDateFin());
        offreStage.setDureeStage(offreStageDTO.getDureeStage());
        offreStage.setNombreHeuresSemaine(offreStageDTO.getNombreHeuresSemaine());
        offreStage.setNombrePostes(offreStageDTO.getNombrePostes());
        offreStage.setDateLimiteCandidature(offreStageDTO.getDateLimiteCandidature());
        return offreStage;
    }
}