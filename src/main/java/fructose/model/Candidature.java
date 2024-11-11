package fructose.model;

import fructose.model.enumerator.EtatCandidature;
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
@Table (name = "candidature")
public class Candidature {
	
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	@Column (name = "id", nullable = false)
	private Long id;
	
	@ManyToOne
	@JoinColumn (name = "etudiant_id", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Utilisateur etudiant;
	
	@ManyToOne
	@JoinColumn (name = "offre_stage_id", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private OffreStage offreStage;

	@ManyToOne
	@JoinColumn (name = "cv_id", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Cv cv;
	
	@Enumerated (EnumType.STRING)
	private EtatCandidature etat;
	
	@Column (name = "commentaire")
	private String commentaireRefus;
	
	public Candidature(Long id, Utilisateur etudiant, OffreStage offreStage, EtatCandidature etat, String commentaireRefus) {
		this.id = id;
		this.etudiant = etudiant;
		this.offreStage = offreStage;
		this.etat = etat;
		this.commentaireRefus = commentaireRefus;
	}
}