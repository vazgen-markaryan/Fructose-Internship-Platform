package fructose.service.dto;

import fructose.model.Employeur;
import fructose.model.Etudiant;
import fructose.model.Professeur;
import fructose.model.Utilisateur;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UtilisateurDTO {
    private Long id;
    private String fullName;
    private String email;
    private String password;
    private String matricule;
    private String role;
    private String departement;
    private String companyName;
    
    public static Utilisateur toEntity(UtilisateurDTO utilisateur_dto) {
        Utilisateur utilisateur;
        switch (utilisateur_dto.getRole()) {
            case "Etudiant":
                utilisateur = new Etudiant();
                break;
            case "Professeur":
                utilisateur = new Professeur();
                break;
            case "Employeur":
                utilisateur = new Employeur();
                break;
            default:
                throw new IllegalArgumentException("Role d'utilisateur : " + utilisateur_dto.getRole() + " n'est pas valide");
        }
        utilisateur.setId(utilisateur_dto.getId());
        utilisateur.setFullName(utilisateur_dto.getFullName());
        utilisateur.setEmail(utilisateur_dto.getEmail());
        utilisateur.setPassword(utilisateur_dto.getPassword());
        utilisateur.setMatricule(utilisateur_dto.getMatricule());
        utilisateur.setRole(utilisateur_dto.getRole());
        utilisateur.setDepartement(utilisateur_dto.getDepartement());
        utilisateur.setCompanyName(utilisateur_dto.getCompanyName());
        return utilisateur;
    }

    public static UtilisateurDTO toDTO(Utilisateur utilisateur) {
        UtilisateurDTO utilisateur_dto;
        switch (utilisateur.getRole()) {
            case "Etudiant":
                utilisateur_dto = new EtudiantDTO();
                break;
            case "Professeur":
                utilisateur_dto = new ProfesseurDTO();
                break;
            case "Employeur":
                utilisateur_dto = new EmployeurDTO();
                break;
            default:
                throw new IllegalArgumentException("Role d'utilisateur : " + utilisateur.getRole() + " n'est pas valide");
        }
        utilisateur_dto.setId(utilisateur.getId());
        utilisateur_dto.setFullName(utilisateur.getFullName());
        utilisateur_dto.setEmail(utilisateur.getEmail());
        utilisateur_dto.setPassword(utilisateur.getPassword());
        utilisateur_dto.setMatricule(utilisateur.getMatricule());
        utilisateur_dto.setRole(utilisateur.getRole());
        utilisateur_dto.setDepartement(utilisateur.getDepartement());
        utilisateur_dto.setCompanyName(utilisateur.getCompanyName());
        return utilisateur_dto;
    }
}