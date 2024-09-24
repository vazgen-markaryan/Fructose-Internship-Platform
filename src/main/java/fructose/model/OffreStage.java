package fructose.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "offre_stage")
public class OffreStage {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @Size(min = 3, max = 100)
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Le nom doit contenir uniquement des lettres et des espaces")
    private String nom;

    @NotNull
    @NotEmpty
    @Size(min = 3, max = 100)
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Le poste doit contenir uniquement des lettres et des espaces")
    private String poste;

    @NotNull
    @NotEmpty
    @Size(min = 10, max = 500)
    private String description;

    @NotNull
    @NotEmpty
    @Size(min = 3, max = 100)
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "La compagnie doit contenir uniquement des lettres et des espaces")
    private String compagnie;

    @NotNull
    @NotEmpty
    @Pattern(regexp = "^(Technique de l'informatique|Genie physique|Soin infirmiers)$", message = "Le programme d'étude doit être l'un des suivants : Technique de l'informatique, Génie physique, Soin infirmiers")
    private String programmeEtude;

    @NotNull
    @NotEmpty
    @Size(min = 1, max = 10)
    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "Le taux horaire doit être un nombre valide")
    private Double tauxHoraire;

    @NotNull
    @NotEmpty
    @Pattern(regexp = "^(Presentiel|Virtuel|Hybride)$", message = "Le type d'emploi doit être l'un des suivants : Présentiel, Virtuel, Hybride")
    private String typeEmploi;

    @NotNull
    @NotEmpty
    @Size(min = 3, max = 100)
    private String adresse;

    @NotNull
    @NotEmpty
    @Pattern(regexp = "^(Temps plein|Temps partiel)$", message = "La modalité de travail doit être l'une des suivantes : Temps plein, Temps partiel")
    private String modaliteTravail;

    @NotNull
    private LocalDate dateDebut;

    @NotNull
    private LocalDate dateFin;

    @NotNull
    @NotEmpty
    @Size(min = 1, max = 50)
    private String nombreHeuresSemaine;

    @NotNull
    @NotEmpty
    @Size(min = 1, max = 50)
    private int nombrePostes;

    @NotNull
    private LocalDate dateLimiteCandidature;

    @ManyToMany
    @JoinTable(
            name = "offre_stage_etudiant",
            joinColumns = @JoinColumn(name = "offre_stage_id"),
            inverseJoinColumns = @JoinColumn(name = "etudiant_id")
    )
    private Set<Etudiant> etudiants;

    public static OffreStage createOffreStage(String nom,
                                              String poste,
                                              String description,
                                              String compagnie,
                                              String programmeEtude,
                                              Double tauxHoraire,
                                              String typeEmploi,
                                              String adresse,
                                              String modaliteTravail,
                                              LocalDate dateDebut,
                                              LocalDate dateFin,
                                              String nombreHeuresSemaine,
                                              int nombrePostes,
                                              LocalDate dateLimiteCandidature
    ) {
        OffreStage offreStage = new OffreStage();
        offreStage.setNom(nom);
        offreStage.setPoste(poste);
        offreStage.setDescription(description);
        offreStage.setCompagnie(compagnie);
        offreStage.setProgrammeEtude(programmeEtude);
        offreStage.setTauxHoraire(tauxHoraire);
        offreStage.setTypeEmploi(typeEmploi);
        offreStage.setAdresse(adresse);
        offreStage.setModaliteTravail(modaliteTravail);
        offreStage.setDateDebut(dateDebut);
        offreStage.setDateFin(dateFin);
        offreStage.setNombreHeuresSemaine(nombreHeuresSemaine);
        offreStage.setNombrePostes(nombrePostes);
        offreStage.setDateLimiteCandidature(dateLimiteCandidature);
        return offreStage;
    }

    public void addEtudiant(Etudiant etudiant) {
        this.etudiants.add(etudiant);
    }

    public void removeEtudiant(Etudiant etudiant) {
        this.etudiants.remove(etudiant);
    }

    public void removeAllEtudiants() {
        this.etudiants.clear();
    }

}