package fructose.repository;

import fructose.model.OffreStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OffreStageRepository extends JpaRepository<OffreStage, Long> {

}