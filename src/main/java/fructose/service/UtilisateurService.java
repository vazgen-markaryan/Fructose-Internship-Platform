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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public UtilisateurService(EtudiantRepository etudiantRepository,
                              ProfesseurRepository professeurRepository,
                              EmployeurRepository employeurRepository,
                              PasswordEncoder passwordEncoder,
                              @Qualifier("utilisateurRepository") UtilisateurRepository utilisateurRepository,
                              AuthenticationManager authenticationManager,
                              JwtTokenProvider jwtTokenProvider) {
        this.etudiantRepository = etudiantRepository;
        this.professeurRepository = professeurRepository;
        this.employeurRepository = employeurRepository;
        this.passwordEncoder = passwordEncoder;
        this.utilisateurRepository = utilisateurRepository;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }
    
    private static final List<String> VALID_ROLES = Arrays.asList("Etudiant", "Professeur", "Employeur", "Gestionnaire de Stage");

    public boolean isValidRole(String role) {
        return VALID_ROLES.contains(role);
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
                if (utilisateur instanceof Etudiant) {
                    etudiantRepository.save((Etudiant) utilisateur);
                } else {
                    throw new IllegalArgumentException("L'utilisateur n'est pas de type Etudiant");
                }
                break;
            case PROFESSEUR:
                if (utilisateur instanceof Professeur) {
                    professeurRepository.save((Professeur) utilisateur);
                } else {
                    throw new IllegalArgumentException("L'utilisateur n'est pas de type Professeur");
                }
                break;
            case EMPLOYEUR:
                if (utilisateur instanceof Employeur) {
                    employeurRepository.save((Employeur) utilisateur);
                } else {
                    throw new IllegalArgumentException("L'utilisateur n'est pas de type Employeur");
                }
                break;
            default:
                throw new IllegalArgumentException("Type d'utilisateur : " + utilisateur.getRole().toString() + " n'est pas valide");
        }
    }
    
    public void deleteUtilisateur(Long id, Role role) {
        UtilisateurDTO utilisateur = getUtilisateurById(id, role);
        
        if (utilisateur == null) {
            System.out.println("L'utilisateur de type " + role + " n'existe pas.");
            return;
        }
        
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
            default:
                throw new IllegalArgumentException("Type d'utilisateur : " + role.toString() + " n'est pas valide");
        }
        System.out.println(role.toString() + " avec id " + id + " a été supprimé avec succès.");
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
            default -> throw new IllegalArgumentException("Type d'utilisateur : " + role.toString() + " n'est pas valide");
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

    /*
        Authentication JWT
     */
    public String authenticateUser(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        return jwtTokenProvider.generateToken(authentication);
    }

    public UtilisateurDTO getUtilisateurByToken(String token) {
        token = token.startsWith("Bearer") ? token.substring(7) : token;
        String email = jwtTokenProvider.getEmailFromJWT(token);
        Utilisateur user = utilisateurRepository.findByEmail(email);//.orElseThrow(UserNotFoundException::new);
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

    public boolean validationToken(String token){
        try {
            jwtTokenProvider.validateToken(token);
            return true;
        } catch (InvalidJwtTokenException ex) {
            return false;
        }
    }
}