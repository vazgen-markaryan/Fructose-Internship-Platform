package fructose.repository;

import fructose.model.evaluation.EvaluationMilieuStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EvaluationMilieuStageRepository extends JpaRepository<EvaluationMilieuStage, Long> {
    @Query("SELECT e.candidature.id FROM EvaluationMilieuStage e WHERE e.id = :id")
    Long findCandidatureId(@Param("id") Long id);

    @Query("SELECT e FROM EvaluationMilieuStage e LEFT JOIN FETCH e.sections WHERE e.id = :id AND (e.candidature IS NULL OR e.candidature.id IS NULL)")
    EvaluationMilieuStage getEvaluationByIdWithoutCandidature(@Param("id") Long id);
}
