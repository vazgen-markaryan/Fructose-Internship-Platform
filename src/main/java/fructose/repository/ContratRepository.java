package fructose.repository;

import fructose.model.Contrat;
import fructose.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContratRepository extends JpaRepository<Contrat, Long> {

    List<Contrat> findAllByCandidature_OffreStage_Owner(Utilisateur employeur);

    List<Contrat> findAllByCandidature_Etudiant(Utilisateur etudiant);
}