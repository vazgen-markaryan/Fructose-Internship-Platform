package fructose.controller;

import fructose.service.CandidatureService;
import fructose.service.ContratService;
import fructose.service.UtilisateurService;
import fructose.service.dto.CandidatureDTO;
import fructose.service.dto.ContratDTO;
import fructose.service.dto.OffreStageDTO;
import fructose.service.dto.UtilisateurDTO;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

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
	
	@Test
	public void testGenerateContrat_PdfNotFound() {
		String token = "validToken";
		Long id = 1L;
		UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
		CandidatureDTO candidatureDTO = new CandidatureDTO();
		String pdfPath = "path/to/contract.pdf";
		File pdfFile = mock(File.class);
		
		when(utilisateurService.validationToken(token)).thenReturn(true);
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(utilisateurDTO);
		when(candidatureService.getCandidatureById(id)).thenReturn(candidatureDTO);
		when(contratService.generateContrat(candidatureDTO, utilisateurDTO)).thenReturn(pdfPath);
		when(pdfFile.exists()).thenReturn(false);
		
		ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
			contratController.generateContrat(token, id);
		});
		
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
	}
	
	@Test
	public void testGenerateContrat_IOException() throws IOException {
		String token = "validToken";
		Long id = 1L;
		UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
		CandidatureDTO candidatureDTO = new CandidatureDTO();
		String pdfPath = "path/to/contract.pdf";
		File pdfFile = mock(File.class);
		
		when(utilisateurService.validationToken(token)).thenReturn(true);
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(utilisateurDTO);
		when(candidatureService.getCandidatureById(id)).thenReturn(candidatureDTO);
		when(contratService.generateContrat(candidatureDTO, utilisateurDTO)).thenReturn(pdfPath);
		when(pdfFile.exists()).thenReturn(true);
		
		try (MockedStatic<Files> mockedFiles = mockStatic(Files.class)) {
			mockedFiles.when(() -> Files.readAllBytes(pdfFile.toPath())).thenThrow(IOException.class);
			
			ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
				contratController.generateContrat(token, id);
			});
			
			assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
		}
	}
	
	@Test
	public void testGenerateContrat_GeneralException() {
		String token = "validToken";
		Long id = 1L;
		UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
		CandidatureDTO candidatureDTO = new CandidatureDTO();
		
		when(utilisateurService.validationToken(token)).thenReturn(true);
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(utilisateurDTO);
		when(candidatureService.getCandidatureById(id)).thenReturn(candidatureDTO);
		when(contratService.generateContrat(candidatureDTO, utilisateurDTO)).thenThrow(RuntimeException.class);
		
		ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
			contratController.generateContrat(token, id);
		});
		
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
	}
	
	@Test
	public void testSaveContrat_GeneralException() {
		String token = "validToken";
		CandidatureDTO candidatureDTO = new CandidatureDTO();
		UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
		
		when(utilisateurService.validationToken(token)).thenReturn(true);
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(utilisateurDTO);
		doThrow(RuntimeException.class).when(contratService).saveContrat(any(ContratDTO.class));
		
		ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
			contratController.saveContrat(token, candidatureDTO);
		});
		
		assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
	}

	@Test
	public void testGenerateContrat_Success() throws IOException {
		String token = "validToken";
		Long id = 1L;
		UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
		CandidatureDTO candidatureDTO = new CandidatureDTO();
		String pdfPath = "contract_stage1.pdf";
		byte[] pdfBytes = new byte[]{1, 2, 3};

		// Create the file before the test
		Files.write(new File(pdfPath).toPath(), pdfBytes);

		when(utilisateurService.validationToken(token)).thenReturn(true);
		when(utilisateurService.getUtilisateurByToken(token)).thenReturn(utilisateurDTO);
		when(candidatureService.getCandidatureById(id)).thenReturn(candidatureDTO);
		when(contratService.generateContrat(candidatureDTO, utilisateurDTO)).thenReturn(pdfPath);

		try (MockedStatic<Files> mockedFiles = mockStatic(Files.class)) {
			mockedFiles.when(() -> Files.readAllBytes(any())).thenReturn(pdfBytes);
			mockedFiles.when(() -> Files.delete(any())).thenAnswer(invocation -> null);

			ResponseEntity<byte[]> response = contratController.generateContrat(token, id);

			assertEquals(HttpStatus.OK, response.getStatusCode());
			assertArrayEquals(pdfBytes, response.getBody());
		}

		// Delete the file after the test
		Files.deleteIfExists(new File(pdfPath).toPath());
	}
}