package fructose.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "contrat")
public class Contrat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "gestionnaire_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Utilisateur gestionnaire;

    @ManyToOne
    @JoinColumn(name = "employeur_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Utilisateur employeur;

    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Utilisateur etudiant;

    @ManyToOne
    @JoinColumn(name = "offre_stage_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private OffreStage offreStage;

    @Column(name = "signature_gestionnaire", nullable = false)
    private String signatureGestionnaire;

    @Column(name = "signature_employeur", nullable = false)
    private String signatureEmployeur;

    @Column(name = "signature_etudiant", nullable = false)
    private String signatureEtudiant;
}