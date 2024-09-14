package fructose.service;

import fructose.model.Etudiant;
import fructose.repository.EtudiantRepository;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.UtilisateurDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UtilisateurService {

    private final EtudiantRepository etudiantRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(EtudiantRepository etudiantRepository, PasswordEncoder passwordEncoder) {
        this.etudiantRepository = etudiantRepository;
        this.passwordEncoder = passwordEncoder;
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
            default:
                throw new IllegalArgumentException("Type d'utilisateur : " + userType + " n'est pas valide");
        }
    }

//    public void addUtilisateur(UtilisateurDTO utilisateurDTO, String userType) {
//        switch (userType) {
//            case "Etudiant":
//                Etudiant etudiant = EtudiantDTO.toEntity((EtudiantDTO) utilisateurDTO);
//                etudiant.setPassword(passwordEncoder.encode(etudiant.getPassword()));
//                etudiantRepository.save(etudiant);
//                break;
//            default:
//                throw new IllegalArgumentException("Type d'utilisateur : " + userType + " n'est pas valide");
//        }
//    }
    public void addUtilisateur(UtilisateurDTO utilisateurDTO, String userType) {
        switch (userType) {
            case "Etudiant":
                Etudiant etudiant = new Etudiant();
                etudiant.setFullName(utilisateurDTO.getFullName());
                etudiant.setEmail(utilisateurDTO.getEmail());
                etudiant.setPassword(passwordEncoder.encode(utilisateurDTO.getPassword()));
                etudiant.setPhoneNumber(utilisateurDTO.getPhoneNumber());
                etudiant.setAdress(utilisateurDTO.getAdress());
                etudiant.setMatricule(utilisateurDTO.getMatricule());
                etudiant.setRole(utilisateurDTO.getRole());
                etudiantRepository.save(etudiant);
                break;
            default:
                throw new IllegalArgumentException("Type d'utilisateur : " + userType + " n'est pas valide");
        }
    }

    public void updateUtilisateur(UtilisateurDTO utilisateurDTO, String userType) {
        switch (userType) {
            case "Etudiant":
                Etudiant etudiant = EtudiantDTO.toEntity((EtudiantDTO) utilisateurDTO);
                if (etudiantRepository.existsById(etudiant.getId())) {
                    etudiantRepository.save(etudiant);
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
                etudiantRepository.findById(id).ifPresent(etudiantRepository::delete);
                break;
            default:
                throw new IllegalArgumentException("Type d'utilisateur : " + userType + " n'est pas valide");
        }
        System.out.println( userType + " avec id " + id + " a été supprimé avec succès.");
    }

    public List<UtilisateurDTO> getUtilisateurs(String userType) {
        return switch (userType) {
            case "Etudiant" -> etudiantRepository.findAll()
                    .stream()
                    .map(EtudiantDTO::toDTO)
                    .collect(Collectors.toList());
            default -> throw new IllegalArgumentException("Type d'utilisateur : " + userType + " n'est pas valide");
        };
    }

    public boolean isValidRole(String role) {
        return VALID_ROLES.contains(role);
    }
}
