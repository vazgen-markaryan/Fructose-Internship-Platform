package fructose.repository;

import fructose.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UtilisateurRepository<T extends Utilisateur, ID> extends JpaRepository<T, ID> {
    @Query("SELECT u FROM Utilisateur u WHERE u.email = ?1")
    Utilisateur findByEmail(@Param("email") String email);
}
