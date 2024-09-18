package fructose.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "RECORD_TYPE", discriminatorType = DiscriminatorType.STRING)
public class Utilisateur {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @Size(min = 6, max = 50)
    @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Le nom complet doit contenir uniquement des lettres et des espaces")
    private String fullName;
    
    @NotNull
    @NotEmpty
    @Size(min = 10, max = 100)
    @Column(unique = true)
    @Email(message = "L'adresse courriel doit être valide")
    private String email;
    
    @NotNull
    @NotEmpty
    @Size(min = 8)
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$", message = "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial")
    private String password;
    
    @Column(unique = true)
    @Pattern(regexp = "^\\d{7}$", message = "Le Matricule doit contenir 7 chiffres")
    private String matricule;

    @NotNull
    @NotEmpty
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Le nom doit contenir uniquement des lettres et des espaces")
    private String role;
    
    @Size(max = 100)
    @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Le nom du département doit contenir uniquement des lettres et des espaces")
    private String departament;
    
    public Utilisateur(String fullName, String email, String password, String matricule, String role, String departament) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.matricule = matricule;
        this.role = role;
        this.departament = departament;
    }
    
    public static Utilisateur createUtilisateur(String type, String fullName, String email, String password, String matricule, String role, String departament) {
	    return switch (type.toLowerCase()) {
		    case "etudiant" -> new Etudiant(fullName, email, password, matricule, role, departament);
		    case "employeur" -> new Employeur(fullName, email, password, matricule, role, departament);
		    case "professeur" -> new Professeur(fullName, email, password, matricule, role, departament);
		        default -> throw new IllegalArgumentException("Type d'utilisateur: " + type + " n'est pas supporté");
	    };
    }
}