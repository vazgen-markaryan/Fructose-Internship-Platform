package fructose.repository;

import fructose.model.evaluation.EvaluationEmployeur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationRepository extends JpaRepository<EvaluationEmployeur, Long> {
}
