package fructose.service;

import fructose.model.OffreStage;
import fructose.model.Utilisateur;
import fructose.model.auth.Role;
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
import java.util.Objects;
import java.util.Set;

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
        return null;
    }

    public void addOffreStage(OffreStageDTO offreStageDTO) {
        Utilisateur utilisateur = getUtilisateurEnCours();
        if (utilisateur.getRole() != Role.EMPLOYEUR && utilisateur.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Seuls les employeurs peuvent ajouter des offres de stage");
        }
        UtilisateurDTO utilisateurDTO = UtilisateurDTO.toDTO(utilisateur);
        if (offreStageDTO == null) {
            throw new IllegalArgumentException("OffreStageDTO ne peut pas être nul");
        }
        offreStageDTO.setUtilisateur(utilisateurDTO);
        validateOffreStage(offreStageDTO);
        if (utilisateur.getRole() != Role.ADMIN && utilisateur.getRole() != Role.EMPLOYEUR) {
            throw new IllegalArgumentException("Seul l'administrateur peut créer une offre de stage pour un employeur");
        }
        OffreStage offreStage = OffreStageDTO.toEntity(offreStageDTO);
        offreStageRepository.save(offreStage);
    }

    public void updateOffreStage(Long id, OffreStageDTO offreStageDTO) {
        if (id == null) {
            throw new IllegalArgumentException("ID ne peut pas être nul");
        }
        offreStageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("L'offre stage avec l'ID: " + id + " n'existe pas, alors il ne peut pas être mis à jour"));
        validateOffreStage(offreStageDTO);
        Utilisateur utilisateur = getUtilisateurEnCours();
        if (!Objects.equals(offreStageDTO.getUtilisateur().getEmail(), utilisateur.getEmail()) && utilisateur.getRole() != Role.ADMIN || utilisateur.getRole() != Role.EMPLOYEUR) {
            throw new IllegalArgumentException("Seul l'employeur qui a créé l'offre de stage ou l'administrateur peuvent la mettre à jour");
        }
        offreStageRepository.save(OffreStageDTO.toEntity(offreStageDTO));
    }


        public void deleteOffreStage (Long id){
            if (id == null) {
                throw new IllegalArgumentException("ID ne peut pas être nul");
            }
            if (!offreStageRepository.existsById(id)) {
                throw new IllegalArgumentException("L'offre stage avec l'ID: " + id + " n'existe pas, alors il ne peut pas être supprimé");
            }
            if (getUtilisateurEnCours().getRole() != Role.ADMIN && getUtilisateurEnCours().getRole() != Role.EMPLOYEUR) {
                throw new IllegalArgumentException("Seul l'administrateur peut spprimer une offre de stage pour un employeur");
            }
            offreStageRepository.deleteById(id);
        }

        private void validateOffreStage (OffreStageDTO offreStageDTO){
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


        public OffreStageDTO getOffreStageById (Long id){
            if (id == null) {
                throw new IllegalArgumentException("ID ne peut pas être nul");
            }
            OffreStage offreStage = offreStageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("L'offre stage avec l'ID: " + id + " n'existe pas, alors il ne peut pas être récupéré"));
            return OffreStageDTO.toDTO(offreStage);
        }

        public List<OffreStageDTO> getOffresStage () {
            List<OffreStage> offresStage = offreStageRepository.findAll();
            return OffreStageDTO.toDTOs(offresStage);
        }
    }