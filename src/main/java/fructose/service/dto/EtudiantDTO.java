package fructose.service.dto;

import fructose.model.Etudiant;
import fructose.model.auth.Role;
import lombok.*;

@Getter
@Setter
@ToString
public class EtudiantDTO extends UtilisateurDTO {

    public static EtudiantDTO toDTO(Etudiant etudiant) {
        EtudiantDTO etudiant_dto = new EtudiantDTO();
        etudiant_dto.setId(etudiant.getId());
        etudiant_dto.setFullName(etudiant.getFullName());
        etudiant_dto.setEmail(etudiant.getEmail());
        etudiant_dto.setPassword(etudiant.getPassword());
        etudiant_dto.setMatricule(etudiant.getMatricule());
        etudiant_dto.setRole(Role.ETUDIANT);
        etudiant_dto.setDepartementDTO(DepartementDTO.toDTO(etudiant.getDepartement()));
        return etudiant_dto;
    }
}
