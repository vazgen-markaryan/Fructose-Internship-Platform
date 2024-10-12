package fructose.model;

import fructose.model.auth.Credentials;
import fructose.model.auth.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

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
    @Size(min = 5, max = 50, message = "Le nom complet doit contenir entre 5 et 50 caractères")
    @Pattern(regexp = "^[\\p{L}\\s]+$", message = "Le nom complet doit contenir uniquement des lettres et des espaces")
    private String fullName;

    @Column(unique = true)
    @Pattern(regexp = "^\\d{7}$", message = "Le Matricule doit contenir 7 chiffres")
    private String matricule;

    @Size(max = 100, message = "Le nom du département doit contenir au maximum 100 caractères")
    @Pattern(regexp = "^[\\p{L}\\s_]+$", message = "Le nom du département doit contenir uniquement des lettres et des espaces")
    private String departement;

    @Size(min = 3, max = 100, message = "Le nom de l'entreprise doit contenir de 3 à 100 caractères")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ\\s]+$", message = "Le nom de l'entreprise doit contenir uniquement des lettres et des espaces")
    private String companyName;

    @Embedded
    private Credentials credentials;

    public String getEmail() {
        return credentials.getEmail();
    }

    public String getPassword() {
        return credentials.getPassword();
    }

    public Role getRole() {
        return credentials.getRole();
    }

    public void setPassword(String password) {
        credentials.setPassword(password);
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return credentials.getAuthorities();
    }

    public Utilisateur(String fullName, String email, String password, String matricule, Role role, String departement, String companyName) {
        this.fullName = fullName;
        this.matricule = matricule;
        this.departement = departement;
        this.companyName = companyName;
        this.credentials = Credentials.builder().email(email).password(password).role(role).build();
    }

    public static Utilisateur createUtilisateur(String type, String fullName, String email, String password, String matricule, String departement, String companyName) {
        return switch (type.toLowerCase()) {
            case "etudiant" -> new Etudiant(fullName, email, password, matricule, Role.ETUDIANT, departement, companyName);
            case "employeur" -> new Employeur(fullName, email, password, matricule, Role.EMPLOYEUR, departement, companyName);
            case "professeur" -> new Professeur(fullName, email, password, matricule, Role.PROFESSEUR, departement, companyName);
            default -> throw new IllegalArgumentException("Type d'utilisateur: " + type + " n'est pas supporté");
        };
    }
}