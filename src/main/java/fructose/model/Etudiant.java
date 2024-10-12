package fructose.model;

import fructose.model.auth.Role;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

@Entity
@Setter
@Getter
@ToString
@DiscriminatorValue("RECORD_ETUDIANT")
public class Etudiant extends Utilisateur {
    @ManyToMany(mappedBy = "etudiants")
    private Set<OffreStage> offresStage;

    public Etudiant() {
        super();
    }

    public Etudiant(String fullName, String email, String password, String matricule, Role role, String departement, String companyName) {
        super(fullName, email, password, matricule, role, departement, companyName);
    }
}