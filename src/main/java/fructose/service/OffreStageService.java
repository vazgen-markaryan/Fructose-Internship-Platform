package fructose.service;

import fructose.model.OffreStage;
import fructose.repository.OffreStageRepository;
import fructose.service.dto.OffreStageDTO;
import jakarta.validation.*;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import java.time.LocalDate;
import java.util.List;
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
        validateOffreStage(offreStageDTO);
        OffreStage offreStage = OffreStageDTO.toEntity(offreStageDTO);
        offreStageRepository.save(offreStage);
    }

    public void updateOffreStage(Long id, OffreStageDTO offreStageDTO) {
        if (id == null) {
            throw new IllegalArgumentException("ID ne peut pas être nul");
        }
        validateOffreStage(offreStageDTO);
        offreStageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("L'offre stage avec l'ID: " + id + " n'existe pas, alors il ne peut pas être mis à jour"));
        OffreStage offreStage = OffreStageDTO.toEntity(offreStageDTO);
        offreStageRepository.save(offreStage);
    }

    private void validateOffreStage(OffreStageDTO offreStageDTO) {
        if (offreStageDTO == null) {
            throw new IllegalArgumentException("OffreStageDTO ne peut pas être nul");
        }
        Set<ConstraintViolation<OffreStageDTO>> violations = validator.validate(offreStageDTO);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        if (offreStageDTO.getDateLimiteCandidature().isBefore(LocalDate.now().plusDays(7))) {
            throw new IllegalArgumentException("La date limite de candidature doit être au moins 7 jours après aujourd'hui");
        }
        if (offreStageDTO.getDateDebut().isBefore(offreStageDTO.getDateLimiteCandidature().plusDays(1))) {
            throw new IllegalArgumentException("La date de début doit être au moins 1 jour après la date limite de candidature");
        }
        if (offreStageDTO.getDateFin().isBefore(offreStageDTO.getDateDebut().plusDays(1))) {
            throw new IllegalArgumentException("La date de fin doit être au moins 1 jour après la date de début");
        }
    }

    public void deleteOffreStage(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID ne peut pas être nul");
        }
        if (!offreStageRepository.existsById(id)) {
            throw new IllegalArgumentException("L'offre stage avec l'ID: " + id + " n'existe pas, alors il ne peut pas être supprimé");
        }
        offreStageRepository.deleteById(id);
    }

    public OffreStageDTO getOffreStage(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID ne peut pas être nul");
        }
        OffreStage offreStage = offreStageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("L'offre stage avec l'ID: " + id + " n'existe pas, alors il ne peut pas être récupéré"));
        return OffreStageDTO.toDTO(offreStage);
    }

    public List<OffreStageDTO> getOffresStage() {
        List<OffreStage> offresStage = offreStageRepository.findAll();
        return OffreStageDTO.toDTOs(offresStage);
    }
}