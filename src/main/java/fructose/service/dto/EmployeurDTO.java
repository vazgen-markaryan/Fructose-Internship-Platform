package fructose.service.dto;

import fructose.model.Employeur;
import fructose.model.auth.Role;
import lombok.*;

@Getter
@Setter
@ToString(includeFieldNames = true, callSuper = true)
public class EmployeurDTO extends UtilisateurDTO {

    public static EmployeurDTO toDTO(Employeur employeur) {
        EmployeurDTO employeur_dto = new EmployeurDTO();
        employeur_dto.setId(employeur.getId());
        employeur_dto.setFullName(employeur.getFullName());
        employeur_dto.setEmail(employeur.getEmail());
        employeur_dto.setPassword(employeur.getPassword());
        employeur_dto.setMatricule(employeur.getMatricule());
        employeur_dto.setRole(Role.EMPLOYEUR);
        employeur_dto.setDepartementDTO(DepartementDTO.toDTO(employeur.getDepartement()));
        employeur_dto.setCompanyName(employeur.getCompanyName());
        employeur_dto.setIsApproved(employeur.getIsApproved());
        return employeur_dto;
    }
}
