package fructose.service;

import fructose.model.OffreStage;
import fructose.repository.OffreStageRepository;
import fructose.repository.UtilisateurRepository;
import fructose.service.dto.OffreStageDTO;
import jakarta.validation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Validated
@Service
public class OffreStageService {
    private final OffreStageRepository offreStageRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final Validator validator;


    public OffreStageService(OffreStageRepository offreStageRepository, UtilisateurRepository utilisateurRepository) {
        this.offreStageRepository = offreStageRepository;
        this.utilisateurRepository = utilisateurRepository;
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    @PreAuthorize("hasAnyRole('EMPLOYEUR', 'ADMIN')")
    public void addOffreStage(OffreStageDTO offreStageDTO) {
        validateOffreStage(offreStageDTO);
        OffreStage offreStage = OffreStageDTO.toEntity(offreStageDTO);
        offreStageRepository.save(offreStage);
    }

    @PreAuthorize("hasAnyRole('EMPLOYEUR', 'ADMIN')")
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

    @PreAuthorize("hasAnyRole('EMPLOYEUR', 'ADMIN')")
    public void deleteOffreStage(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID ne peut pas être nul");
        }
        if (!offreStageRepository.existsById(id)) {
            throw new IllegalArgumentException("L'offre stage avec l'ID: " + id + " n'existe pas, alors il ne peut pas être supprimé");
        }
        offreStageRepository.deleteById(id);
    }

    private OffreStageDTO getOffreStage(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID ne peut pas être nul");
        }
        OffreStage offreStage = offreStageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("L'offre stage avec l'ID: " + id + " n'existe pas, alors il ne peut pas être récupéré"));
        return OffreStageDTO.toDTO(offreStage);
    }

    @PreAuthorize("hasAnyRole('EMPLOYEUR', 'ADMIN')")
    public List<OffreStageDTO> getOffresStage() {
        List<OffreStage> offresStage = offreStageRepository.findAll();
        return OffreStageDTO.toDTOs(offresStage);
    }
/*
    @PreAuthorize("hasAnyRole('EMPLOYEUR', 'ADMIN')")
    public List<OffreStageDTO> getOffresStageByCurrentUser() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur currentUser = utilisateurRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec l'email: " + currentUserEmail));

        List<OffreStage> offresStage = offreStageRepository.findAllByEmployeurId(currentUser.getId());
        return OffreStageDTO.toDTOs(offresStage);
    }
 */
}