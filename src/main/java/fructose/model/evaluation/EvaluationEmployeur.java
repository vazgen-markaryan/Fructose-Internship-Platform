package fructose.model.evaluation;

import fructose.model.Candidature;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

    @ManyToOne
    @JoinColumn(name = "candidature_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Candidature candidature;

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SectionEvaluation> sections;

    @Column(name = "appreciation_globale", nullable = false)
    private String appreciationGlobale;
    @Column(name = "commentaire_appreciation_globale", nullable = false)
    private String commentaireAppreciationGlobale;
    @Column(name = "appreciation_stage", nullable = false)
    private float nombreHeureEncadrement;
    @Column(name = "commentaire_appreciation_stage", nullable = false)
    private String acceuilleEleveProchainStage;
    @Column(name = "appreciation_formation", nullable = false)
    private String commentairesAccomplissementMandat;
}
