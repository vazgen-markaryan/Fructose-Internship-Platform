package fructose.service;

import fructose.model.Contrat;
import fructose.model.ContratPdf;
import fructose.model.enumerator.Role;
import fructose.repository.ContratRepository;
import fructose.service.dto.CandidatureDTO;
import fructose.service.dto.ContratDTO;
import fructose.service.dto.ContratSansCvDTO;
import fructose.service.dto.UtilisateurDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class ContratService {
	
	private final ContratRepository contratRepository;
	private final CandidatureService candidatureService;
	private final UtilisateurService utilisateurService;

	public String generateContrat(CandidatureDTO candidatureDTO, UtilisateurDTO admin) {
		if (candidatureDTO == null || admin == null) {
			throw new IllegalArgumentException("CandidatureDTO et UtilisateurDTO ne peuvent pas être nuls");
		}
		try {
			ContratDTO contratDTO = new ContratDTO();
			contratDTO.setCandidatureDTO(candidatureDTO);
			contratDTO.setGestionnaire(admin);
			Contrat contrat = ContratDTO.toEntity(contratDTO);
			ContratPdf contratPdf = new ContratPdf(contrat);
			return contratPdf.returnPdf();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Error generating contract PDF", e);
		}
	}

	public String generateContrat(ContratDTO contratDTO) {
		if (contratDTO == null) {
			throw new IllegalArgumentException("ContratDTO ne peut pas être nul");
		}
		try {
			Contrat contrat = ContratDTO.toEntity(contratDTO);
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

	public ContratSansCvDTO getContratByCandidatureId(Long id) {
		if (id == null) {
			throw new IllegalArgumentException("ID de candidature ne peut pas être nul");
		}
		System.out.println("ID de candidature: " + id);
		ContratSansCvDTO contrat = contratRepository.findByCandidatureIdWithoutCv(id);
		if (contrat == null) {
			throw new IllegalArgumentException("Contrat avec ID de candidature: " + id + " n'existe pas");
		}
		return contrat;
	}

	public ContratDTO getContratById(Long contratId) {
		if (contratId == null) {
			throw new IllegalArgumentException("ID de contrat ne peut pas être nul");
		}
		return ContratDTO.toDTO(contratRepository.findById(contratId).orElseThrow(() -> new IllegalArgumentException("Contrat avec ID: " + contratId + " n'existe pas")));
	}

	public void signContrat(Long contratId, UtilisateurDTO utilisateurDTO) {
		if (contratId == null || utilisateurDTO == null) {
			throw new IllegalArgumentException("ID de contrat et UtilisateurDTO ne peuvent pas être nuls");
		}
		Contrat contrat = contratRepository.findById(contratId).orElseThrow(() -> new IllegalArgumentException("Contrat avec ID: " + contratId + " n'existe pas"));
		switch (utilisateurDTO.getRole()) {
			case EMPLOYEUR:
				contrat.setSignatureEmployeur(utilisateurDTO.getFullName());
				contrat.setDateSignatureEmployeur(LocalDate.now());
				break;
			case ETUDIANT:
				contrat.setSignatureEtudiant(utilisateurDTO.getFullName());
				contrat.setDateSignatureEtudiant(LocalDate.now());
				break;
			default:
				throw new IllegalArgumentException("Utilisateur n'est pas un employeur ou un étudiant");
		}
		contratRepository.save(contrat);
	}
}