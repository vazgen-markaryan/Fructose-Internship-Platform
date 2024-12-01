package fructose.model.evaluation;

import fructose.model.Candidature;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalTime;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EvaluationMilieuStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidature_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Candidature candidature;

    @OneToMany(mappedBy = "evaluationMilieuStage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SectionEvaluation> sections;

    // Stage type (e.g., PREMIER_STAGE, DEUXIEME_STAGE)
    @Enumerated(EnumType.STRING)
    private StageType stageType;

    // Capacite etudiant (e.g., UN_STAGIAIRE, DEUX_STAGIAIRES, etc.)
    @Enumerated(EnumType.STRING)
    private capaciteEtudiant capaciteEtudiant;

    private int nbHeuresParSemPremierMois;
    private int nbHeuresParSemDeuxiemeMois;
    private int nbHeuresParSemTroisiemeMois;

    private int tauxHoraire;

    // Stage type (e.g., PREMIER_STAGE, DEUXIEME_STAGE)
    private StageType milieuStageAPrivilegierPour;

    private boolean memeStagiaireProchainStage;

    private boolean quartTravailVariable;

    private String signatureSuperviseur;

    private LocalTime dateSignatureSuperviseur;

    private String quartTravail1Debut;
    private String quartTravail1Fin;
    private String quartTravail2Debut;
    private String quartTravail2Fin;
    private String quartTravail3Debut;
    private String quartTravail3Fin;

    // Enum for stage type
    public enum StageType {
        PREMIER_STAGE,
        DEUXIEME_STAGE
    }

    // Enum for capacite etudiant
    public enum capaciteEtudiant {
        UN_STAGIAIRE,
        DEUX_STAGIAIRES,
        TROIS_STAGIAIRES,
        PLUS_DE_TROIS
    }
}
