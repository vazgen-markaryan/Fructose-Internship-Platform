package fructose.repository;

import fructose.model.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
    @Query("SELECT COUNT(c) FROM Candidature c WHERE c.etudiant.id = ?1 AND c.offreStage.id = ?2")
    Long getCandidatureNumbers(@Param("user_id") Long userId, @Param("offre_id") Long offreId);
}