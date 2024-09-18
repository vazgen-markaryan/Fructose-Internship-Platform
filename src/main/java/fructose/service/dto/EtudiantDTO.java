package fructose.service.dto;

import fructose.model.Etudiant;
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
        etudiant_dto.setRole("Etudiant");
        etudiant_dto.setDepartement(etudiant.getDepartement());
        return etudiant_dto;
    }

    public static Etudiant toEntity(EtudiantDTO etudiant_dto) {
        Etudiant etudiant = new Etudiant();
        etudiant.setId(etudiant_dto.getId());
        etudiant.setFullName(etudiant_dto.getFullName());
        etudiant.setEmail(etudiant_dto.getEmail());
        etudiant.setPassword(etudiant_dto.getPassword());
        etudiant.setMatricule(etudiant_dto.getMatricule());
        etudiant.setRole("Etudiant");
        etudiant.setDepartement(etudiant_dto.getDepartement());
        return etudiant;
    }
}
