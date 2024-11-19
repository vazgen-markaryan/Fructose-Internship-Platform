package fructose.service;

import fructose.model.Admin;
import fructose.model.Contrat;
import fructose.model.ContratPdf;
import fructose.model.Utilisateur;
import fructose.model.enumerator.Role;
import fructose.repository.AdminRepository;
import fructose.repository.ContratRepository;
import fructose.service.dto.AdminDTO;
import fructose.service.dto.CandidatureDTO;
import fructose.service.dto.ContratDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.itextpdf.layout.Document;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ContratService {

    private final ContratRepository contratRepository;
    private final AdminRepository adminRepository;
    
    private Admin getUtilisateurEnCours() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Admin admin = adminRepository.findByEmail(authentication.getName());
            if (admin != null) {
                return admin;
            }
        }
        throw new IllegalArgumentException("Aucun utilisateur n'est connecté");
    }


    public Document generateContrat(CandidatureDTO candidatureDTO) {
        ContratDTO contratDTO = new ContratDTO();
        Admin admin = getUtilisateurEnCours();
        System.out.println("Voici l'admin fetch de utilisateurEnCours : " + admin);
        AdminDTO adminDTO = AdminDTO.toDTO(admin);
        System.out.println("Voici comment on l'a transformer : " + adminDTO);
        contratDTO.setCandidatureDTO(candidatureDTO);
        contratDTO.setGestionnaire(adminDTO);
        Contrat contrat = ContratDTO.toEntity(contratDTO);
        System.out.println(contrat);
        ContratPdf contratPdf = new ContratPdf(contrat);
        return contratPdf.returnPdf();
    }

    public void saveContrat(ContratDTO contratDTO) {
        Contrat contrat = ContratDTO.toEntity(contratDTO);
        contratRepository.save(contrat);
    }

    public void deleteContrat(Long id) {
        if (!contratRepository.existsById(id)) {
            throw new IllegalArgumentException("Contrat with ID: " + id + " does not exist");
        }
        contratRepository.deleteById(id);
    }

    public ContratDTO getContratById(Long id) {
        Contrat contrat = contratRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contrat with ID: " + id + " does not exist"));
        return ContratDTO.toDTO(contrat);
    }

    public List<ContratDTO> getContrats() {
        Utilisateur utilisateur = getUtilisateurEnCours();
        Role role = utilisateur.getRole();

        return switch (role) {
            case EMPLOYEUR -> contratRepository.findAllByCandidature_OffreStage_Owner(utilisateur)
                    .stream()
                    .map(ContratDTO::toDTO)
                    .collect(Collectors.toList());
            case ETUDIANT -> contratRepository.findAllByCandidature_Etudiant(utilisateur)
                    .stream()
                    .map(ContratDTO::toDTO)
                    .collect(Collectors.toList());
            case ADMIN -> contratRepository.findAll()
                    .stream()
                    .map(ContratDTO::toDTO)
                    .collect(Collectors.toList());
            default -> throw new IllegalArgumentException("Role not supported");
        };
    }

    public ContratDTO signContrat(Long id, String signature) {
        Contrat contrat = contratRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contrat with ID: " + id + " does not exist"));

        Utilisateur utilisateur = getUtilisateurEnCours();
        Role role = utilisateur.getRole();
        switch (role) {
            case EMPLOYEUR:
                contrat.setSignatureEmployeur(signature);
                break;
            case ETUDIANT:
                contrat.setSignatureEtudiant(signature);
                break;
            case ADMIN:
                contrat.setSignatureGestionnaire(signature);
                break;
            default:
                throw new IllegalArgumentException("Role not supported");
        }
        contrat = contratRepository.save(contrat);
        return ContratDTO.toDTO(contrat);
    }

    public Document getContratPDFById(Long id) {
        Contrat contrat = contratRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contrat with ID: " + id + " does not exist"));
        ContratPdf contratPdf = new ContratPdf(contrat);
        return contratPdf.returnPdf();
    }
}