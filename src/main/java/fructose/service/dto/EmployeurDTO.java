package fructose.service.dto;

import fructose.model.Employeur;
import lombok.*;

@Getter
@Setter
@ToString
public class EmployeurDTO extends UtilisateurDTO {
	
	public static EmployeurDTO toDTO(Employeur employeur) {
		EmployeurDTO employeur_dto = new EmployeurDTO();
		employeur_dto.setId(employeur.getId());
		employeur_dto.setFullName(employeur.getFullName());
		employeur_dto.setEmail(employeur.getEmail());
		employeur_dto.setPassword(employeur.getPassword());
		employeur_dto.setMatricule(employeur.getMatricule());
		employeur_dto.setRole("Employeur");
		employeur_dto.setDepartament(employeur.getDepartament());
		return employeur_dto;
	}
	
	public static Employeur toEntity(EmployeurDTO employeur_dto) {
		Employeur employeur = new Employeur();
		employeur.setId(employeur_dto.getId());
		employeur.setFullName(employeur_dto.getFullName());
		employeur.setEmail(employeur_dto.getEmail());
		employeur.setPassword(employeur_dto.getPassword());
		employeur.setMatricule(employeur_dto.getMatricule());
		employeur.setRole("Employeur");
		employeur.setDepartament(employeur_dto.getDepartament());
		return employeur;
	}
}
