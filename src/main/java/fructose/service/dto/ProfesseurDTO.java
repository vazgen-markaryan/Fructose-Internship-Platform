package fructose.service.dto;

import fructose.model.Professeur;
import lombok.*;

@Getter
@Setter
@ToString
public class ProfesseurDTO extends UtilisateurDTO {
	
	public static ProfesseurDTO toDTO(Professeur professeur) {
		ProfesseurDTO professeur_dto = new ProfesseurDTO();
		professeur_dto.setId(professeur.getId());
		professeur_dto.setFullName(professeur.getFullName());
		professeur_dto.setEmail(professeur.getEmail());
		professeur_dto.setPassword(professeur.getPassword());
		professeur_dto.setMatricule(professeur.getMatricule());
		professeur_dto.setRole("Professeur");
		professeur_dto.setDepartement(professeur.getDepartement());
		professeur_dto.setCompanyName(professeur.getCompanyName());
		return professeur_dto;
	}

	// Commenté car n'est pas utilisé pour le moment
	// Affecte le % de Test Coverage

//	public static Professeur toEntity(ProfesseurDTO professeur_dto) {
//		Professeur professeur = new Professeur();
//		professeur.setId(professeur_dto.getId());
//		professeur.setFullName(professeur_dto.getFullName());
//		professeur.setEmail(professeur_dto.getEmail());
//		professeur.setPassword(professeur_dto.getPassword());
//		professeur.setMatricule(professeur_dto.getMatricule());
//		professeur.setRole("Professeur");
//		professeur.setDepartement(professeur_dto.getDepartement());
//		professeur.setCompanyName(professeur_dto.getCompanyName());
//		return professeur;
//	}
}
