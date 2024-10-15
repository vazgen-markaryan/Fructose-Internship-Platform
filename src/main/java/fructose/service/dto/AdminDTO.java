package fructose.service.dto;

import fructose.model.Admin;
import fructose.model.auth.Role;
import lombok.*;

@Getter
@Setter
@ToString
public class AdminDTO extends UtilisateurDTO {

    public static AdminDTO toDTO(Admin admin) {
        AdminDTO admin_dto = new AdminDTO();
        admin_dto.setId(admin.getId());
        admin_dto.setFullName(admin.getFullName());
        admin_dto.setEmail(admin.getEmail());
        admin_dto.setPassword(admin.getPassword());
        admin_dto.setMatricule(admin.getMatricule());
        admin_dto.setRole(Role.ADMIN);
        admin_dto.setDepartement(admin.getDepartement());
        admin_dto.setCompanyName(admin.getCompanyName());
        return admin_dto;
    }
}