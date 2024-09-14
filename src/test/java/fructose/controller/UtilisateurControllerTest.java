package fructose.controller;

import fructose.service.UtilisateurService;
import fructose.service.dto.UtilisateurDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

class UtilisateurControllerTest {

    @InjectMocks
    private UtilisateurController utilisateurController;

    @Mock
    private UtilisateurService utilisateurService;

    @Mock
    private BindingResult bindingResult;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreerUtilisateur_Success() {
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setRole("Etudiant");
        when(bindingResult.hasErrors()).thenReturn(false);
        when(utilisateurService.isValidRole(utilisateurDTO.getRole())).thenReturn(true);

        ResponseEntity<?> response = utilisateurController.creerUtilisateur(utilisateurDTO, bindingResult);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Utilisateur créé avec succès !", response.getBody());
    }

    @Test
    void testCreerUtilisateur_ValidationErrors() {
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        when(bindingResult.hasErrors()).thenReturn(true);
        when(bindingResult.getFieldErrors()).thenReturn(
                List.of(new FieldError("utilisateurDTO", "email", "L'adresse courriel doit être valide"))
        );

        ResponseEntity<?> response = utilisateurController.creerUtilisateur(utilisateurDTO, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Erreur de validation : L'adresse courriel doit être valide", response.getBody());
    }

    @Test
    void testCreerUtilisateur_InvalidRole() {
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setRole("InvalidRole");
        when(bindingResult.hasErrors()).thenReturn(false);
        when(utilisateurService.isValidRole(utilisateurDTO.getRole())).thenReturn(false);

        ResponseEntity<?> response = utilisateurController.creerUtilisateur(utilisateurDTO, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Rôle invalide.", response.getBody());
    }

    @Test
    void testCreerUtilisateur_DataAccessException() {
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setRole("Etudiant");
        when(bindingResult.hasErrors()).thenReturn(false);
        when(utilisateurService.isValidRole(utilisateurDTO.getRole())).thenReturn(true);
        doThrow(new DataAccessException("Database error") {}).when(utilisateurService).addUtilisateur(utilisateurDTO, utilisateurDTO.getRole());

        ResponseEntity<?> response = utilisateurController.creerUtilisateur(utilisateurDTO, bindingResult);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Erreur lors de la création de l'utilisateur.", response.getBody());
    }

    @Test
    void testCreerUtilisateur_GenericException() {
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setRole("Etudiant");
        when(bindingResult.hasErrors()).thenReturn(false);
        when(utilisateurService.isValidRole(utilisateurDTO.getRole())).thenReturn(true);
        doThrow(new RuntimeException("Generic error")).when(utilisateurService).addUtilisateur(utilisateurDTO, utilisateurDTO.getRole());

        ResponseEntity<?> response = utilisateurController.creerUtilisateur(utilisateurDTO, bindingResult);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Une erreur inattendue s'est produite.", response.getBody());
    }
}