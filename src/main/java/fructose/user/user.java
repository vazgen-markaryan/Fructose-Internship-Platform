package fructose.user;

import jakarta.persistence.*;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Entity
@Table(name = "users")
public class user {
	// ÉTAIT FAIT JUSTE POUR TESTER DATABASE À MODIFIER!!!!
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	
	private String firstName;
	
	private String lastName;
	
	private LocalDate dateOfBirth;
	
	public user(String firstName, String lastName, LocalDate dateOfBirth) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.dateOfBirth = dateOfBirth;
	}
	
	public user() {
	
	}
}