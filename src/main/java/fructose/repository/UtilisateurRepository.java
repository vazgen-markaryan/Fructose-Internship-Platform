package fructose.repository;

import fructose.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilisateurRepository<T extends Utilisateur, ID> extends JpaRepository<T, ID> {
}
