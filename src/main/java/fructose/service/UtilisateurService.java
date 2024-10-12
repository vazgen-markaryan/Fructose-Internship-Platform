
package fructose.service;

import fructose.model.Employeur;
import fructose.model.Etudiant;
import fructose.model.Professeur;
import fructose.model.Utilisateur;
import fructose.model.auth.Role;
import fructose.repository.vides.EmployeurRepository;
import fructose.repository.vides.EtudiantRepository;
import fructose.repository.vides.ProfesseurRepository;
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

import javax.swing.text.html.Option;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final EtudiantRepository etudiantRepository;
    private final ProfesseurRepository professeurRepository;
    private final EmployeurRepository employeurRepository;
    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository utilisateurRepository;
<<<<<<< Updated upstream
=======
    private final AuthenticationManager authenticationManager;
>>>>>>> Stashed changes
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;


    public boolean isValidRole(String role) {
        return Arrays.stream(Role.values()).anyMatch((t) -> t.name().equals(role));
    }
<<<<<<< Updated upstream

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
=======
    
    private static final List<String> VALID_ROLES = Arrays.asList("Etudiant", "Professeur", "Employeur", "Gestionnaire de Stage");
    
    public UtilisateurDTO getUtilisateurById(Long id, String userType) {
        switch (userType) {
            case "Etudiant":
                EtudiantDTO etudiantDTO = getEtudiantDtoById(id);
                if (etudiantDTO == null) {
                    throw new IllegalArgumentException("Etudiant avec ID: " + id + " n'existe pas");
                }
                return etudiantDTO;
            case "Professeur":
                ProfesseurDTO professeurDTO = getProfesseurDtoById(id);
                if (professeurDTO == null) {
                    throw new IllegalArgumentException("Professeur avec ID: " + id + " n'existe pas");
                }
                return professeurDTO;
            case "Employeur":
                EmployeurDTO employeurDTO = getEmployeurDtoById(id);
                if (employeurDTO == null) {
>>>>>>> Stashed changes
                    throw new IllegalArgumentException("Employeur avec ID: " + id + " n'existe pas");
                }
                return employeurDTO;
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

<<<<<<< Updated upstream
    /*
        Authentication JWT
     */
=======
    // Authentication JWT
>>>>>>> Stashed changes
    public String authenticateUser(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        return jwtTokenProvider.generateToken(authentication);
    }

    public UtilisateurDTO getUtilisateurByToken(String token) {
        token = token.startsWith("Bearer") ? token.substring(7) : token;
        String email = jwtTokenProvider.getEmailFromJWT(token);
        Utilisateur user = utilisateurRepository.findByEmail(email);//.orElseThrow(UserNotFoundException::new);
<<<<<<< Updated upstream
        return switch (user.getRole()) {
            case ETUDIANT -> etudiantRepository.findById(user.getId()).map(EtudiantDTO::toDTO).orElse(null);
            case EMPLOYEUR -> employeurRepository.findById(user.getId()).map(EmployeurDTO::toDTO).orElse(null);
            case PROFESSEUR -> professeurRepository.findById(user.getId()).map(ProfesseurDTO::toDTO).orElse(null);
            default -> throw new IllegalArgumentException("Type d'utilisateur : " + user.getRole().toString() + " n'est pas valide");
        };
    }

    public boolean validationToken(String token){
        try {
            jwtTokenProvider.validateToken(token);
            return true;
        } catch (InvalidJwtTokenException ex) {
            return false;
        }
    }
=======
        UtilisateurDTO utilisateurDTO = switch(user.getRole()){
            case ETUDIANT -> getEtudiantDtoById(user.getId());
            case EMPLOYEUR -> getEmployeurDtoById(user.getId());
            case PROFESSEUR -> getProfesseurDtoById(user.getId());
            case ADMIN -> null; // TODO: Ajout Admin
        };
        if(utilisateurDTO != null){
            return utilisateurDTO;
        } else {
            throw new IllegalArgumentException("L'utilisateur avec le token JWT '" + token + "' n'existe pas");
        }
    }

    private EtudiantDTO getEtudiantDtoById(Long id) {
        final Optional<Etudiant> etudiantOptional = etudiantRepository.findById(id);
        return etudiantOptional.map(EtudiantDTO::toDTO).orElse(null);
    }

    private EmployeurDTO getEmployeurDtoById(Long id) {
        final Optional<Employeur> employeurOptional = employeurRepository.findById(id);
        return employeurOptional.map(EmployeurDTO::toDTO).orElse(null);
    }

    private ProfesseurDTO getProfesseurDtoById(Long id) {
        final Optional<Professeur> professeurOptional = professeurRepository.findById(id);
        return professeurOptional.map(ProfesseurDTO::toDTO).orElse(null);
    }

>>>>>>> Stashed changes
}