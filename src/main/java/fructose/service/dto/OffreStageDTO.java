package fructose.service.dto;

import fructose.model.OffreStage;
import jakarta.validation.constraints.*;
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

    @NotNull(message = "L'identifiant ne peut pas être null")
    private Long id;

    @NotEmpty(message = "Le nom ne peut pas être vide")
    @Size(min = 3, max = 100, message = "Le nom doit contenir au moins 3 caractères et au plus 100 caractères")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Le nom doit contenir uniquement des lettres et des espaces")
    private String nom;

    @NotEmpty(message = "Le poste ne peut pas être vide")
    @Size(min = 3, max = 100, message = "Le poste doit contenir au moins 3 caractères et au plus 100 caractères")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Le poste doit contenir uniquement des lettres et des espaces")
    private String poste;

    @NotEmpty(message = "La description ne peut pas être vide")
    @Size(min = 10, max = 500)
    private String description;

    @NotEmpty(message = "La compagnie ne peut pas être vide")
    @Size(min = 3, max = 100)
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "La compagnie doit contenir uniquement des lettres et des espaces")
    private String compagnie;

    @NotEmpty(message = "Le programme d'étude ne peut pas être vide")
    @Pattern(regexp = "^(Technique de l'informatique|Genie physique|Soin infirmiers)$", message = "Le programme d'étude doit être l'un des suivants : Technique de l'informatique, Génie physique, Soin infirmiers")
    private String programmeEtude;

    @NotEmpty(message = "Le taux horaire ne peut pas être vide")
    @Size(min = 1, max = 10)
    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "Le taux horaire doit être un nombre valide")
    private String tauxHoraire;

    @NotNull(message = "Le type d'emploi ne peut pas être null")
    @Pattern(regexp = "^(Presentiel|Virtuel|Hybride)$", message = "Le type d'emploi doit être l'un des suivants : Presentiel, Virtuel, Hybride")
    private String typeEmploi;

    @NotEmpty(message = "L'adresse ne peut pas être vide")
    @Size(min = 3, max = 100)
    private String adresse;

    @NotEmpty(message = "La modalité de travail ne peut pas être vide")
    @Pattern(regexp = "^(Temps plein|Temps partiel)$", message = "La modalité de travail doit être l'une des suivantes : Temps plein, Temps partiel")
    private String modaliteTravail;

    @NotNull(message = "La date de début ne peut pas être null")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin ne peut pas être null")
    private LocalDate dateFin;

    @NotEmpty(message = "Le nombre d'heures par semaine ne peut pas être vide")
    @Size(min = 1, max = 50)
    private String nombreHeuresSemaine;

    @Min(value = 1, message = "Le nombre de postes ne peut pas être inferieur a 1")
    private int nombrePostes;

    @NotNull
    private LocalDate dateLimiteCandidature;

    public static OffreStageDTO toDTO(OffreStage offreStage) {
        OffreStageDTO offreStageDTO = new OffreStageDTO();
        offreStageDTO.setId(offreStage.getId());
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
        offreStageDTO.setNombreHeuresSemaine(offreStage.getNombreHeuresSemaine());
        offreStageDTO.setNombrePostes(offreStage.getNombrePostes());
        offreStageDTO.setDateLimiteCandidature(offreStage.getDateLimiteCandidature());
        return offreStageDTO;
    }

    public static OffreStage toEntity(OffreStageDTO offreStageDTO) {
        OffreStage offreStage = new OffreStage();
        offreStage.setId(offreStageDTO.getId());
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
        offreStage.setNombreHeuresSemaine(offreStageDTO.getNombreHeuresSemaine());
        offreStage.setNombrePostes(offreStageDTO.getNombrePostes());
        offreStage.setDateLimiteCandidature(offreStageDTO.getDateLimiteCandidature());
        return offreStage;
    }
}