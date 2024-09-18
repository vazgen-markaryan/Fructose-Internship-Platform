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
@DiscriminatorValue("RECORD_PROFESSEUR")
public class Professeur extends Utilisateur {
	public Professeur() {
		super();
	}
	
	public Professeur(String fullName, String email, String password, String matricule, String role, String departament) {
		super(fullName, email, password, matricule, role, departament);
	}
}