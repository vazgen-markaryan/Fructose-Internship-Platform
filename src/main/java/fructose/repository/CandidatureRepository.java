package fructose.repository;

import fructose.model.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
	@Query ("SELECT COUNT(c) FROM Candidature c WHERE c.etudiant.id = ?1 AND c.offreStage.id = ?2")
	Long getCandidatureNumbers(@Param ("user_id") Long userId, @Param ("offre_id") Long offreId);
	
	@Query ("SELECT new fructose.model.Candidature(c.id, c.etudiant, c.offreStage, c.etat, c.commentaireRefus) " +
		"FROM Candidature c WHERE c.etudiant.id = :etudiantId")
	List<Candidature> findByEtudiantIdWithoutCv(@Param ("etudiantId") Long etudiantId);
	
	@Query ("SELECT c FROM Candidature c WHERE c.etudiant.id = :etudiantId")
	List<Candidature> findByEtudiantId(@Param ("etudiantId") Long etudiantId);

	@Query ("SELECT c FROM Candidature c WHERE c.offreStage.id = :offreStageId")
	List<Candidature> findByOffreStageId(Long offreStageId);
}