package fructose.repository;

import fructose.model.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
	@Query ("SELECT c.id, c.etat, o.nom, o.compagnie " +
		"FROM Candidature c JOIN c.offreStage o " +
		"WHERE c.etudiant.id = :etudiantId")
	List<Object[]> findOffreStageDetailsByEtudiantId(@Param ("etudiantId") Long etudiantId);
	
	@Query ("SELECT c FROM Candidature c WHERE c.etudiant.id = :etudiantId")
	List<Candidature> findByEtudiantId(@Param ("etudiantId") Long etudiantId);
}