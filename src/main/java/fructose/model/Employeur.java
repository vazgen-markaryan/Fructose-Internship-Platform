package fructose.model;

import fructose.model.auth.Role;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Setter
@Getter
@ToString
@DiscriminatorValue("RECORD_EMPLOYEUR")
public class Employeur extends Utilisateur {
	public Employeur() {
		super();
	}
	
	public Employeur(String fullName, String email, String password, String matricule, Role role, String departement, String companyName) {
		super(fullName, email, password, matricule, role, departement, companyName);
	}
}