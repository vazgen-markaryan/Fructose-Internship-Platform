package fructose.repository;

import fructose.model.Contrat;
import fructose.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContratRepository extends JpaRepository<Contrat, Long> {

    Contrat findByCandidatureId(Long id);
}