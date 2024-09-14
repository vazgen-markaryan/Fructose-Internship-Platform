package fructose.service.dto;

import fructose.model.Etudiant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class EtudiantDTO extends UtilisateurDTO {

    public static EtudiantDTO toDTO(Etudiant etudiant) {
        EtudiantDTO etudiant_dto = new EtudiantDTO();
        etudiant_dto.setId(etudiant.getId());
        etudiant_dto.setFullName(etudiant.getFullName());
        etudiant_dto.setEmail(etudiant.getEmail());
        etudiant_dto.setPassword(etudiant.getPassword());
        etudiant_dto.setPhoneNumber(etudiant.getPhoneNumber());
        etudiant_dto.setAdress(etudiant.getAdress());
        etudiant_dto.setMatricule(etudiant.getMatricule());
        etudiant_dto.setRole("Etudiant");
        return etudiant_dto;
    }

    public static Etudiant toEntity(EtudiantDTO etudiant_dto) {
        Etudiant etudiant = new Etudiant();
        etudiant.setId(etudiant_dto.getId());
        etudiant.setFullName(etudiant_dto.getFullName());
        etudiant.setEmail(etudiant_dto.getEmail());
        etudiant.setPassword(etudiant_dto.getPassword());
        etudiant.setPhoneNumber(etudiant_dto.getPhoneNumber());
        etudiant.setAdress(etudiant_dto.getAdress());
        etudiant.setMatricule(etudiant_dto.getMatricule());
        etudiant.setRole("Etudiant");
        return etudiant;
    }
}
