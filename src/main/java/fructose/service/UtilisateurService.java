package fructose.service;

import fructose.model.Employeur;
import fructose.model.Etudiant;
import fructose.model.Professeur;
import fructose.model.Utilisateur;
import fructose.repository.vides.EmployeurRepository;
import fructose.repository.vides.EtudiantRepository;
import fructose.repository.vides.ProfesseurRepository;
import fructose.repository.UtilisateurRepository;
import fructose.service.dto.EmployeurDTO;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.ProfesseurDTO;
import fructose.service.dto.UtilisateurDTO;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UtilisateurService {

    private final EtudiantRepository etudiantRepository;
    private final ProfesseurRepository professeurRepository;
    private final EmployeurRepository employeurRepository;
    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(EtudiantRepository etudiantRepository, ProfesseurRepository professeurRepository, EmployeurRepository employeurRepository, PasswordEncoder passwordEncoder, @Qualifier("utilisateurRepository") UtilisateurRepository utilisateurRepository) {
        this.etudiantRepository = etudiantRepository;
        this.professeurRepository = professeurRepository;
        this.employeurRepository = employeurRepository;
        this.passwordEncoder = passwordEncoder;
        this.utilisateurRepository = utilisateurRepository;
    }

    private static final List<String> VALID_ROLES = Arrays.asList("Etudiant", "Professeur", "Employeur", "Gestionnaire de Stage");

    public UtilisateurDTO getUtilisateurById(Long id, String userType) {
        switch (userType) {
            case "Etudiant":
                Etudiant etudiant = etudiantRepository.findById(id).orElse(null);
                if (etudiant == null) {
                    throw new IllegalArgumentException("Etudiant avec ID: " + id + " n'existe pas");
                }
                return EtudiantDTO.toDTO(etudiant);
            case "Professeur":
                Professeur professeur = professeurRepository.findById(id).orElse(null);
                if (professeur == null) {
                    throw new IllegalArgumentException("Professeur avec ID: " + id + " n'existe pas");
                }
                return ProfesseurDTO.toDTO(professeur);
            case "Employeur":
                Employeur employeur = employeurRepository.findById(id).orElse(null);
                if (employeur == null) {
                    throw new IllegalArgumentException("Employeur avec ID: " + id + " n'existe pas");
                }
                return EmployeurDTO.toDTO(employeur);
            default:
                throw new IllegalArgumentException("Type d'utilisateur : " + userType + " n'est pas valide");
        }
    }

    public void addUtilisateur(UtilisateurDTO utilisateurDTO, String userType) {
        Utilisateur utilisateur = UtilisateurDTO.toEntity(utilisateurDTO);
        utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        saveUtilisateur(utilisateur, userType);
    }

    public void updateUtilisateur(UtilisateurDTO utilisateurDTO, String userType) {
        Utilisateur utilisateur = UtilisateurDTO.toEntity(utilisateurDTO);
        utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        saveUtilisateur(utilisateur, userType);
    }

    private void saveUtilisateur(Utilisateur utilisateur, String userType) {
        switch (userType) {
            case "Etudiant":
                if (utilisateur instanceof Etudiant) {
                    etudiantRepository.save((Etudiant) utilisateur);
                } else {
                    throw new IllegalArgumentException("L'utilisateur n'est pas de type Etudiant");
                }
                break;
            case "Professeur":
                if (utilisateur instanceof Professeur) {
                    professeurRepository.save((Professeur) utilisateur);
                } else {
                    throw new IllegalArgumentException("L'utilisateur n'est pas de type Professeur");
                }
                break;
            case "Employeur":
                if (utilisateur instanceof Employeur) {
                    employeurRepository.save((Employeur) utilisateur);
                } else {
                    throw new IllegalArgumentException("L'utilisateur n'est pas de type Employeur");
                }
                break;
            default:
                throw new IllegalArgumentException("Type d'utilisateur : " + userType + " n'est pas valide");
        }
    }

    public void deleteUtilisateur(Long id, String userType) {
        UtilisateurDTO utilisateur = getUtilisateurById(id, userType);

        if (utilisateur == null) {
            System.out.println("L'utilisateur de type " + userType + " n'existe pas.");
            return;
        }

        switch (userType) {
            case "Etudiant":
                etudiantRepository.deleteById(id);
                break;
            case "Professeur":
                professeurRepository.deleteById(id);
                break;
            case "Employeur":
                employeurRepository.deleteById(id);
                break;
            default:
                throw new IllegalArgumentException("Type d'utilisateur : " + userType + " n'est pas valide");
        }
        System.out.println(userType + " avec id " + id + " a été supprimé avec succès.");
    }

    public List<UtilisateurDTO> getUtilisateurs(String userType) {
        return switch (userType) {
            case "Etudiant" -> etudiantRepository.findAll()
                    .stream()
                    .map(EtudiantDTO::toDTO)
                    .collect(Collectors.toList());
            case "Professeur" -> professeurRepository.findAll()
                    .stream()
                    .map(ProfesseurDTO::toDTO)
                    .collect(Collectors.toList());
            case "Employeur" -> employeurRepository.findAll()
                    .stream()
                    .map(EmployeurDTO::toDTO)
                    .collect(Collectors.toList());
            default -> throw new IllegalArgumentException("Type d'utilisateur : " + userType + " n'est pas valide");
        };
    }

    public boolean isValidRole(String role) {
        return VALID_ROLES.contains(role);
    }

    public boolean isEmailTaken(String email) {
        return utilisateurRepository.findByEmail(email) != null;
    }

    public boolean isMatriculeTaken(String matricule) {
        return utilisateurRepository.findByMatricule(matricule) != null;
    }

    public UtilisateurDTO login(String email, String password) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email);
        if (utilisateur == null) {
            throw new IllegalArgumentException("L'utilisateur avec mail " + email + " n'existe pas");
        }
        if (passwordEncoder.matches(password, utilisateur.getPassword())) {
            return UtilisateurDTO.toDTO(utilisateur);
        } else {
            throw new IllegalArgumentException("Mot de passe incorrect");
        }
    }
}