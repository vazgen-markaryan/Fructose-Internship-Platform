package fructose.service;

import fructose.model.Contrat;
import fructose.model.ContratPdf;
import fructose.repository.ContratRepository;
import fructose.service.dto.CandidatureDTO;
import fructose.service.dto.ContratDTO;
import fructose.service.dto.UtilisateurDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ContratService {
	
	private final ContratRepository contratRepository;
 
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
	
	public void saveContrat(ContratDTO contratDTO) {
		Contrat contrat = ContratDTO.toEntity(contratDTO);
		contratRepository.save(contrat);
	}

	public ContratDTO getContratByCandidatureId(Long id) {
		if (id == null) {
			throw new IllegalArgumentException("ID de candidature ne peut pas être nul");
		}
		Contrat contrat = contratRepository.findByCandidatureId(id);
		if (contrat == null) {
			throw new IllegalArgumentException("Contrat avec ID de candidature: " + id + " n'existe pas");
		}
		return ContratDTO.toDTO(contrat);
	}
}