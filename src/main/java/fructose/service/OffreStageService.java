package fructose.service;

import fructose.model.OffreStage;
import fructose.repository.OffreStageRepository;
import fructose.service.dto.OffreStageDTO;
import jakarta.validation.*;
import org.springframework.stereotype.Service;

import org.springframework.validation.annotation.Validated;

import java.util.Set;

@Validated
@Service
public class OffreStageService {
    private final OffreStageRepository offreStageRepository;
    private final Validator validator;


    public OffreStageService(OffreStageRepository offreStageRepository) {
        this.offreStageRepository = offreStageRepository;
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    public void addOffreStage(OffreStageDTO offreStageDTO) {
        if (offreStageDTO == null) {
            throw new IllegalArgumentException("OffreStageDTO ne peut pas être nul");
        }
        // Vérifier que la date de fin est au moins 1 jour après la date de début
        Set<ConstraintViolation<OffreStageDTO>> violations = validator.validate(offreStageDTO);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        if (offreStageDTO.getDateFin().isBefore(offreStageDTO.getDateDebut().plusDays(1))) {
            throw new IllegalArgumentException("La date de fin doit être au moins 1 jour après la date de début");
        }
        OffreStage offreStage = OffreStageDTO.toEntity(offreStageDTO);
        offreStageRepository.save(offreStage);
    }

    public void deleteOffreStage(Long id) {
        offreStageRepository.deleteById(id);
    }

    public OffreStageDTO getOffreStage(Long id) {
        OffreStage offreStage = offreStageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("OffreStage not found"));
        return OffreStageDTO.toDTO(offreStage);
    }
}