package fructose.controller;

import fructose.service.CandidatureService;
import fructose.service.ContratService;
import fructose.service.UtilisateurService;
import fructose.service.dto.CandidatureDTO;
import fructose.service.dto.ContratDTO;
import fructose.service.dto.UtilisateurDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;

@RestController
@RequestMapping ("/contrats")
@RequiredArgsConstructor
public class ContratController {
	
	private final ContratService contratService;
	private final UtilisateurService utilisateurService;
	private final CandidatureService candidatureService;
	
	private void validateToken(String token) {
		if (!utilisateurService.validationToken(token)) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		}
	}
	
	@GetMapping ("/generate/{id}")
	public ResponseEntity<byte[]> generateContrat(@RequestHeader ("Authorization") String token, @PathVariable Long id) {
		validateToken(token); // Validates the token
		try {
			UtilisateurDTO utilisateur = utilisateurService.getUtilisateurByToken(token);
			CandidatureDTO candidatureDTO = candidatureService.getCandidatureById(id);
			
			String pdfPath = contratService.generateContrat(candidatureDTO, utilisateur);
			
			File pdfFile = new File(pdfPath);
			if (!pdfFile.exists()) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Generated PDF not found");
			}
			
			byte[] pdfBytes = Files.readAllBytes(pdfFile.toPath());
			
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);
			headers.setContentDisposition(ContentDisposition.inline().filename("contract_stage.pdf").build());
			headers.setContentLength(pdfBytes.length);
			
			Files.delete(pdfFile.toPath());
			
			return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
			
		} catch (IOException e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading contract PDF", e);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating contract", e);
		}
	}
	
	@PostMapping
	public void saveContrat(@RequestHeader ("Authorization") String token, @Valid @RequestBody CandidatureDTO candidatureDTO) {
		validateToken(token);
		try {
			UtilisateurDTO utilisateur = utilisateurService.getUtilisateurByToken(token);
			ContratDTO contratDTO = new ContratDTO();
			contratDTO.setCandidatureDTO(candidatureDTO);
			contratDTO.setGestionnaire(utilisateur);
			contratDTO.setSignatureGestionnaire(utilisateur.getFullName());
			contratDTO.setDateSignatureGestionnaire(LocalDate.now());
			contratService.saveContrat(contratDTO);
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error saving contract", e);
		}
	}
}