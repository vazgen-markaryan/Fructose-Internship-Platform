package fructose.model;

import fructose.service.dto.EtudiantDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "matricule")
})
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_role")
public class Utilisateur {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @Size(min = 6, max = 50)
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Le nom complet doit contenir uniquement des lettres et des espaces")
    private String fullName;

    @Email(message = "L'adresse courriel doit être valide")
    @NotNull
    @NotEmpty
    @Size(min = 10, max = 100)
    @Column(unique = true)
    private String email;

    @NotNull
    @NotEmpty
    @Size(min = 8)
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$", message = "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial")
    private String password;

    @NotNull
    @NotEmpty
    @Pattern(regexp = "^\\(\\d{3}\\) \\d{3}-\\d{4}$", message = "Le numéro de téléphone doit être au format (123) 456-7890")
    private String phoneNumber;

    @NotNull
    @NotEmpty
    @Size(min = 3, max = 100, message = "L'adresse doit contenir entre 3 et 100 caractères")
    @Pattern(regexp = "^[A-Za-z0-9\\s]+$", message = "L'adresse doit contenir uniquement des lettres et des chiffres")
    private String adress;

    @Pattern(regexp = "^\\d{7}$", message = "Le Matricule doit contenir 7 chiffres")
    @Column(name = "matricule", unique = true)
    private String matricule;

    @NotNull
    @NotEmpty
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Le nom doit contenir uniquement des lettres et des espaces")
    private String role;

    public static Utilisateur createUtilisateur(String type,
                                                String fullName,
                                                String email,
                                                String password,
                                                String phoneNumber,
                                                String address,
                                                String matricule,
                                                String role
    ) {
        if (type.equalsIgnoreCase("Etudiant")) {
            Etudiant etudiant = new Etudiant();
            etudiant.setFullName(fullName);
            etudiant.setEmail(email);
            etudiant.setPassword(password);
            etudiant.setPhoneNumber(phoneNumber);
            etudiant.setAdress(address);
            etudiant.setMatricule(matricule);
            etudiant.setRole(role);
            return etudiant;
        } else {
            throw new IllegalArgumentException("Invalid user type: " + type);
        }
    }

    public EtudiantDTO toEtudiantDTO() {
        EtudiantDTO etudiantDTO = new EtudiantDTO();
        etudiantDTO.setFullName(this.fullName);
        etudiantDTO.setEmail(this.email);
        etudiantDTO.setPassword(this.password);
        etudiantDTO.setPhoneNumber(this.phoneNumber);
        etudiantDTO.setAdress(this.adress);
        etudiantDTO.setMatricule(this.matricule);
        etudiantDTO.setRole(this.role);
        return etudiantDTO;
    }
}