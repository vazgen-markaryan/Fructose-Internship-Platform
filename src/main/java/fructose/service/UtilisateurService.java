
package fructose.service;

import fructose.model.Employeur;
import fructose.model.Etudiant;
import fructose.model.Professeur;
import fructose.model.Utilisateur;
import fructose.model.auth.Role;
import fructose.repository.EmployeurRepository;
import fructose.repository.EtudiantRepository;
import fructose.repository.ProfesseurRepository;
import fructose.repository.UtilisateurRepository;
import fructose.security.JwtTokenProvider;
import fructose.security.exception.InvalidJwtTokenException;
import fructose.service.dto.EmployeurDTO;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.ProfesseurDTO;
import fructose.service.dto.UtilisateurDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final EtudiantRepository etudiantRepository;
    private final ProfesseurRepository professeurRepository;
    private final EmployeurRepository employeurRepository;
    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public boolean isValidRole(String role) {
        return Arrays.stream(Role.values()).anyMatch((t) -> t.name().equals(role));
    }

    public UtilisateurDTO getUtilisateurById(Long id, Role role) {
        switch (role) {
            case ETUDIANT:
                Etudiant etudiant = etudiantRepository.findById(id).orElse(null);
                if (etudiant == null) {
                    throw new IllegalArgumentException("Etudiant avec ID: " + id + " n'existe pas");
                }
                return EtudiantDTO.toDTO(etudiant);
            case PROFESSEUR:
                Professeur professeur = professeurRepository.findById(id).orElse(null);
                if (professeur == null) {
                    throw new IllegalArgumentException("Professeur avec ID: " + id + " n'existe pas");
                }
                return ProfesseurDTO.toDTO(professeur);
            case EMPLOYEUR:
                Employeur employeur = employeurRepository.findById(id).orElse(null);
                if (employeur == null) {
                    throw new IllegalArgumentException("Employeur avec ID: " + id + " n'existe pas");
                }
                return EmployeurDTO.toDTO(employeur);
            default:
                throw new IllegalArgumentException("Type d'utilisateur : " + role.toString() + " n'est pas valide");
        }
    }

    public void addUtilisateur(UtilisateurDTO utilisateurDTO) {
        Utilisateur utilisateur = UtilisateurDTO.toEntity(utilisateurDTO);
        utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        saveUtilisateur(utilisateur);
    }

    public void updateUtilisateur(UtilisateurDTO utilisateurDTO, Role role) {
        Utilisateur utilisateur = UtilisateurDTO.toEntity(utilisateurDTO);
        utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword()));
        saveUtilisateur(utilisateur);
    }

    private void saveUtilisateur(Utilisateur utilisateur) {
        switch (utilisateur.getRole()) {
            case ETUDIANT:
                etudiantRepository.save((Etudiant) utilisateur);
                break;
            case PROFESSEUR:
                professeurRepository.save((Professeur) utilisateur);
                break;
            case EMPLOYEUR:
                employeurRepository.save((Employeur) utilisateur);
                break;
        }
    }

    public void deleteUtilisateur(Long id, Role role) {
        getUtilisateurById(id, role);

        switch (role) {
            case ETUDIANT:
                etudiantRepository.deleteById(id);
                break;
            case PROFESSEUR:
                professeurRepository.deleteById(id);
                break;
            case EMPLOYEUR:
                employeurRepository.deleteById(id);
                break;
        }
        System.out.println(role + " avec id " + id + " a été supprimé avec succès.");
    }

    public List<UtilisateurDTO> getUtilisateurs(Role role) {
        return switch (role) {
            case ETUDIANT -> etudiantRepository.findAll()
                    .stream()
                    .map(EtudiantDTO::toDTO)
                    .collect(Collectors.toList());
            case PROFESSEUR -> professeurRepository.findAll()
                    .stream()
                    .map(ProfesseurDTO::toDTO)
                    .collect(Collectors.toList());
            case EMPLOYEUR -> employeurRepository.findAll()
                    .stream()
                    .map(EmployeurDTO::toDTO)
                    .collect(Collectors.toList());
            case ADMIN -> null;
        };
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

    public String authenticateUser(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        return jwtTokenProvider.generateToken(authentication);
    }

    public UtilisateurDTO getUtilisateurByToken(String token) {
        token = token.startsWith("Bearer") ? token.substring(7) : token;
        String email = jwtTokenProvider.getEmailFromJWT(token);
        Utilisateur user = utilisateurRepository.findByEmail(email);//.orElseThrow(UserNotFoundException::new);
        return switch (user.getRole()) {
            case ETUDIANT -> etudiantRepository.findById(user.getId()).map(EtudiantDTO::toDTO).orElse(null);
            case EMPLOYEUR -> employeurRepository.findById(user.getId()).map(EmployeurDTO::toDTO).orElse(null);
            case PROFESSEUR -> professeurRepository.findById(user.getId()).map(ProfesseurDTO::toDTO).orElse(null);
            default ->
                    throw new IllegalArgumentException("Type d'utilisateur : " + user.getRole().toString() + " n'est pas valide");
        };
    }

    public boolean validationToken(String token) {
        try {
            jwtTokenProvider.validateToken(token);
            return true;
        } catch (InvalidJwtTokenException ex) {
            return false;
        }
    }
}