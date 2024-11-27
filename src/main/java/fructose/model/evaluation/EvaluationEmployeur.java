package fructose.model.evaluation;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EvaluationEmployeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom_eleve", nullable = false)
    private String nomEleve;

    @Column(name = "programme", nullable = false)
    private String programme;

    @Column(name = "entreprise", nullable = false)
    private String entreprise;

    @Column(name = "superviseur", nullable = false)
    private String superviseur;

    @Column(name = "fonction", nullable = false)
    private String fonction;

    @Column(name = "telephone", nullable = false)
    private String telephone;

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SectionEvaluation> sections;

    @Column(name = "appreciation_globale", nullable = false)
    private String appreciationGlobale;
    @Column(name = "commentaire_appreciation_globale", nullable = false)
    private String commentaireAppreciationGlobale;
    @Column(name = "discuter_avec_etudiant", nullable = false)
    private String discuterAvecEtudiant;
    @Column(name = "nombre_heure_encadrement", nullable = false)
    private float nombreHeureEncadrement;
    @Column(name = "acceuille_eleve_prochain_stage", nullable = false)
    private String acceuilleEleveProchainStage;
    @Column(name = "commentaires_accomplissement_mandat", nullable = false)
    private String commentairesAccomplissementMandat;
    @Column(name = "signature", nullable = false)
    private String signature;
}
