package fructose.service.dto;

import fructose.model.Utilisateur;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UtilisateurDTO {
    private Long id;
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String adress;
    private String matricule;
    private String role;

    public static Utilisateur toEntity(UtilisateurDTO utilisateur_dto) {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setId(utilisateur_dto.getId());
        utilisateur.setFullName(utilisateur_dto.getFullName());
        utilisateur.setEmail(utilisateur_dto.getEmail());
        utilisateur.setPassword(utilisateur_dto.getPassword());
        utilisateur.setPhoneNumber(utilisateur_dto.getPhoneNumber());
        utilisateur.setAdress(utilisateur_dto.getAdress());
        utilisateur.setMatricule(utilisateur_dto.getMatricule());
        utilisateur.setRole(utilisateur_dto.getRole());
        return utilisateur;
    }

    public static UtilisateurDTO toDTO(Utilisateur utilisateur) {
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setId(utilisateur.getId());
        utilisateurDTO.setFullName(utilisateur.getFullName());
        utilisateurDTO.setEmail(utilisateur.getEmail());
        utilisateurDTO.setPassword(utilisateur.getPassword());
        utilisateurDTO.setPhoneNumber(utilisateur.getPhoneNumber());
        utilisateurDTO.setAdress(utilisateur.getAdress());
        utilisateurDTO.setMatricule(utilisateur.getMatricule());
        utilisateurDTO.setRole(utilisateur.getRole());
        return utilisateurDTO;
    }
}