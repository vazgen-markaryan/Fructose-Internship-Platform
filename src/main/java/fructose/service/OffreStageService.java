package fructose.service;

import fructose.model.OffreStage;
import fructose.model.Utilisateur;
import fructose.repository.EmployeurRepository;
import fructose.repository.OffreStageRepository;
import fructose.service.dto.OffreStageDTO;
import fructose.service.dto.UtilisateurDTO;
import jakarta.validation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Validated
@Service
public class OffreStageService {
    private final OffreStageRepository offreStageRepository;
    private final EmployeurRepository employeurRepository;
    private final Validator validator;


    public OffreStageService(OffreStageRepository offreStageRepository, EmployeurRepository utilisateurRepository) {
        this.offreStageRepository = offreStageRepository;
        this.employeurRepository = utilisateurRepository;
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
    }

    public Utilisateur getUtilisateurEnCours() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return employeurRepository.findByEmail(authentication.getName());
        }
        throw new IllegalArgumentException("Aucun utilisateur n'est connecté");
    }

    public void addOffreStage(OffreStageDTO offreStageDTO) {
        UtilisateurDTO utilisateurDTO = UtilisateurDTO.toDTO(getUtilisateurEnCours());
        validateAddOffreStage(offreStageDTO, utilisateurDTO);
    }

    public void addOffreStage(OffreStageDTO offreStageDTO, UtilisateurDTO utilisateurDTO) {
        validateAddOffreStage(offreStageDTO, utilisateurDTO);
    }

    private void validateAddOffreStage(OffreStageDTO offreStageDTO, UtilisateurDTO utilisateurDTO) {
        if (offreStageDTO == null) {
            throw new IllegalArgumentException("OffreStageDTO ne peut pas être nul");
        }
        offreStageDTO.setOwnerDTO(utilisateurDTO);
        validateOffreStage(offreStageDTO);
        OffreStage offreStage = OffreStageDTO.toEntity(offreStageDTO);
        offreStageRepository.save(offreStage);
    }

    public void updateOffreStage(Long id, OffreStageDTO offreStageDTO) {
        if (id == null) {
            throw new IllegalArgumentException("ID ne peut pas être nul");
        }
        offreStageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("L'offre stage avec l'ID: " + id + " n'existe pas, alors il ne peut pas être mis à jour"));
        validateOffreStage(offreStageDTO);
        offreStageRepository.save(OffreStageDTO.toEntity(offreStageDTO));
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

    private void validateOffreStage(OffreStageDTO offreStageDTO) {
        if (offreStageDTO == null) {
            throw new IllegalArgumentException("OffreStageDTO ne peut pas être nul");
        }
        Set<ConstraintViolation<OffreStageDTO>> violations = validator.validate(offreStageDTO);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        if (offreStageDTO.getDepartementDTO() == null) {
            throw new IllegalArgumentException("Le département ne peut pas être nul");
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


    public OffreStageDTO getOffreStageById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID ne peut pas être nul");
        }
        OffreStage offreStage = offreStageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("L'offre stage avec l'ID: " + id + " n'existe pas, alors il ne peut pas être récupéré"));
        return OffreStageDTO.toDTO(offreStage);
    }

    public List<OffreStageDTO> getOffresStage() {
        Utilisateur utilisateur = getUtilisateurEnCours();
        List<OffreStageDTO> offresStage;
        switch (utilisateur.getRole()) {
            case ADMIN -> {
                offresStage = OffreStageDTO.toDTOs(offreStageRepository.findAll());
                if (offresStage.isEmpty()) {
                    throw new IllegalArgumentException("Aucune offre stage a été créer pour l'instant");
                }
            }
            case EMPLOYEUR -> {
                offresStage = OffreStageDTO.toDTOs(offreStageRepository.findByEmployeurEmail(utilisateur.getEmail()));
                if (offresStage.isEmpty()) {
                    throw new IllegalArgumentException("Aucune offre de stage trouvée pour l'employeur avec l'email: " + utilisateur.getEmail());
                }
            }
            case ETUDIANT -> {
                offresStage = OffreStageDTO.toDTOs(offreStageRepository.findByUserDepartement(utilisateur.getDepartement()));
                if (offresStage.isEmpty()) {
                    throw new IllegalArgumentException("Aucune offre de stage trouvée pour l'étudiant dans le département: " + utilisateur.getDepartement());
                }
            }
            default -> throw new IllegalArgumentException("Aucune offre de stage n'a été trouvée pour le role inconnue");
        }
        return offresStage;
    }
}