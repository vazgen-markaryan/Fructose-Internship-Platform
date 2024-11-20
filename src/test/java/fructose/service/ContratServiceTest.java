package fructose.service;

import fructose.model.Contrat;
import static org.mockito.ArgumentMatchers.argThat;
import fructose.model.enumerator.Role;
import fructose.repository.ContratRepository;
import fructose.service.dto.CandidatureDTO;
import fructose.service.dto.ContratDTO;
import fructose.service.dto.OffreStageDTO;
import fructose.service.dto.UtilisateurDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContratServiceTest {
	
	@Mock
	private ContratRepository contratRepository;
	
	@InjectMocks
	private ContratService contratService;
	
	private CandidatureDTO candidatureDTO;
	private UtilisateurDTO admin;
	private OffreStageDTO offreStageDTO;
	
	@BeforeEach
	void setUp() {
		admin = new UtilisateurDTO();
		admin.setId(1L);
		admin.setFullName("Test User");
		admin.setEmail("test@example.com");
		admin.setPassword("password");
		admin.setMatricule("12345");
		admin.setRole(Role.ETUDIANT);
		admin.setCompanyName("Test Company");
		admin.setIsApproved(true);
		
		offreStageDTO = new OffreStageDTO();
		offreStageDTO.setId(1L);
		offreStageDTO.setNom("Test Offer");
		offreStageDTO.setDescription("Test Offer Description");
		offreStageDTO.setTauxHoraire(1000.0);
		offreStageDTO.setOwnerDTO(admin);
		offreStageDTO.setAdresse("Test Address");
		offreStageDTO.setDateFin(LocalDate.now());
		offreStageDTO.setDateDebut(LocalDate.now());
		offreStageDTO.setTypeEmploi("presentiel");
		offreStageDTO.setModaliteTravail("temps_plein");
		
		
		
		candidatureDTO = new CandidatureDTO();
		candidatureDTO.setId(1L);
		candidatureDTO.setEtudiantDTO(admin);
		candidatureDTO.setOffreStageDTO(offreStageDTO);
	}
	
	
	
	@Test
	public void testGenerateContrat_Success() {
		String result = contratService.generateContrat(candidatureDTO, admin);
		
		assertEquals("contract_stage1.pdf", result);
	}
	
	@Test
	public void testGenerateContrat_ExceptionCandidatureNull() {
		assertThrows(RuntimeException.class, () -> {
			contratService.generateContrat(null, admin);
		});
	}
	
	@Test
	public void testGenerateContrat_ExceptionAdminNull() {
		assertThrows(RuntimeException.class, () -> {
			contratService.generateContrat(candidatureDTO, null);
		});
	}
	
	@Test
	public void testSaveContrat() {
		ContratDTO contratDTO = new ContratDTO();
		contratDTO.setCandidatureDTO(candidatureDTO);
		contratDTO.setGestionnaire(admin);
		
		Contrat expectedContrat = ContratDTO.toEntity(contratDTO);
		
		contratService.saveContrat(contratDTO);
		
		verify(contratRepository, times(1)).save(argThat(contrat ->
			contrat.getCandidature().getId().equals(expectedContrat.getCandidature().getId()) &&
				contrat.getCandidature().getEtudiant().getId().equals(expectedContrat.getCandidature().getEtudiant().getId()) &&
				contrat.getCandidature().getOffreStage().getId().equals(expectedContrat.getCandidature().getOffreStage().getId()) &&
				contrat.getGestionnaire().getId().equals(expectedContrat.getGestionnaire().getId())
		));
	}
}