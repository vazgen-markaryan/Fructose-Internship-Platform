package fructose.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Setter
@Getter
@ToString
@DiscriminatorValue("RECORD_ETUDIANT")
public class Etudiant extends Utilisateur {
	public Etudiant() {
		super();
	}
	
	public Etudiant(String fullName, String email, String password, String matricule, String role, String departement, String companyName) {
		super(fullName, email, password, matricule, role, departement, companyName);
	}
}