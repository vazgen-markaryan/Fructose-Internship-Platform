package fructose.service;

import fructose.model.Departement;
import fructose.repository.DepartementRepository;
import fructose.service.dto.DepartementDTO;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Validated
@Service
public class DepartementService {
    private final DepartementRepository departementRepository;

    public DepartementService(DepartementRepository departementRepository) {
        this.departementRepository = departementRepository;
    }

    public void addDepartement(DepartementDTO departementDTO) {
        if (departementDTO == null) {
            throw new IllegalArgumentException("DepartementDTO ne peut pas être nul");
        }
        Departement departement = DepartementDTO.toEntity(departementDTO);
        departementRepository.save(departement);
    }
    
    public void deleteDepartement(Long id) {
        departementRepository.deleteById(id);
    }

}
