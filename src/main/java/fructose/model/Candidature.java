package fructose.model;

import fructose.model.enumerator.EtatCandidature;
import jakarta.persistence.*;
import lombok.*;

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
	private Etudiant etudiant;
	
	@ManyToOne
	@JoinColumn (name = "offre_stage_id", nullable = false)
	private OffreStage offreStage;
	
	@Enumerated (EnumType.STRING)
	private EtatCandidature etat;
	
	@Column (name = "commentaire")
	private String commentaireRefus;
}