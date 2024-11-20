package fructose.controller;

import fructose.model.enumerator.Role;
import fructose.service.CandidatureService;
import fructose.service.ContratService;
import fructose.service.UtilisateurService;
import fructose.service.dto.CandidatureDTO;
import fructose.service.dto.ContratDTO;
import fructose.service.dto.OffreStageDTO;
import fructose.service.dto.UtilisateurDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ContratControllerTest {
	
	@Mock
	private ContratService contratService;
	
	@Mock
	private UtilisateurService utilisateurService;
	
	@Mock
	private CandidatureService candidatureService;
	
	@InjectMocks
	private ContratController contratController;
	
	private CandidatureDTO candidatureDTO;
	
	private UtilisateurDTO admin;
	
	private OffreStageDTO offreStageDTO;
	
	
	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
	}
	
	@Test
	public void testSaveContrat_Success() {
		String token = "validToken";
		CandidatureDTO candidatureDTO = new CandidatureDTO();
		UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
		
		when(utilisateurService.validationToken(token)).thenReturn(true);
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(utilisateurDTO);
		
		assertDoesNotThrow(() -> {
			contratController.saveContrat(token, candidatureDTO);
		});
		
		verify(contratService).saveContrat(any(ContratDTO.class));
	}
	
	@Test
	public void testGenerateContrat_Unauthorized() {
		String token = "invalidToken";
		Long id = 1L;
		
		when(utilisateurService.validationToken(token)).thenReturn(false);
		
		ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
			contratController.generateContrat(token, id);
		});
		
		assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
	}
	
	@Test
	public void testSaveContrat_Unauthorized() {
		String token = "invalidToken";
		CandidatureDTO candidatureDTO = new CandidatureDTO();
		
		when(utilisateurService.validationToken(token)).thenReturn(false);
		
		ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
			contratController.saveContrat(token, candidatureDTO);
		});
		
		assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
	}
}