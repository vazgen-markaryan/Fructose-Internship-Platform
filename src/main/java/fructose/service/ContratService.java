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
import fructose.service.dto.UtilisateurDTO;
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
    
    
    public String generateContrat(CandidatureDTO candidatureDTO, UtilisateurDTO admin) {
        try {
            ContratDTO contratDTO = new ContratDTO();
            contratDTO.setCandidatureDTO(candidatureDTO);
            contratDTO.setGestionnaire(admin);
            Contrat contrat = ContratDTO.toEntity(contratDTO);
            System.out.println(contrat);
            ContratPdf contratPdf = new ContratPdf(contrat);
            return contratPdf.returnPdf();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error generating contract PDF", e);
        }
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

//    public List<ContratDTO> getContrats() {
//        Utilisateur utilisateur = getUtilisateurEnCours();
//        Role role = utilisateur.getRole();
//
//        return switch (role) {
//            case EMPLOYEUR -> contratRepository.findAllByCandidature_OffreStage_Owner(utilisateur)
//                    .stream()
//                    .map(ContratDTO::toDTO)
//                    .collect(Collectors.toList());
//            case ETUDIANT -> contratRepository.findAllByCandidature_Etudiant(utilisateur)
//                    .stream()
//                    .map(ContratDTO::toDTO)
//                    .collect(Collectors.toList());
//            case ADMIN -> contratRepository.findAll()
//                    .stream()
//                    .map(ContratDTO::toDTO)
//                    .collect(Collectors.toList());
//            default -> throw new IllegalArgumentException("Role not supported");
//        };
//    }

    //public ContratDTO signContrat(Long id, String signature) {
        //Contrat contrat = contratRepository.findById(id)
       //         .orElseThrow(() -> new IllegalArgumentException("Contrat with ID: " + id + " does not exist"));

        //Utilisateur utilisateur = getUtilisateurEnCours();
        //Role role = utilisateur.getRole();
        //switch (role) {
            //case EMPLOYEUR:
                //contrat.setSignatureEmployeur(signature);
                //break;
            //case ETUDIANT:
                //contrat.setSignatureEtudiant(signature);
                //break;
            //case ADMIN:
                //contrat.setSignatureGestionnaire(signature);
             //   break;
         //   default:
       //         throw new IllegalArgumentException("Role not supported");
     //   }
     //   contrat = contratRepository.save(contrat);
     //   return ContratDTO.toDTO(contrat);
    //}

//    public Document getContratPDFById(Long id) {
//        Contrat contrat = contratRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Contrat with ID: " + id + " does not exist"));
//        ContratPdf contratPdf = new ContratPdf(contrat);
//        return contratPdf.returnPdf();
//    }
}