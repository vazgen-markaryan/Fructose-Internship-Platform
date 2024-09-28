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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import java.sql.SQLException;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import org.springframework.http.MediaType;

class UtilisateurControllerTest {

    private MockMvc mockMvc;

    @InjectMocks
    private UtilisateurController utilisateurController;

    @Mock
    private UtilisateurService utilisateurService;

    @Mock
    private BindingResult bindingResult;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(utilisateurController).build();
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

    @Test
    void testCreerUtilisateur_ConstraintViolationException() {
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setRole("Etudiant");
        when(bindingResult.hasErrors()).thenReturn(false);
        when(utilisateurService.isValidRole(utilisateurDTO.getRole())).thenReturn(true);

        // Simuler une violation de contrainte unique
        org.hibernate.exception.ConstraintViolationException violationException =
                new org.hibernate.exception.ConstraintViolationException(
                        "Violation de contrainte unique",
                        new SQLException("ERREUR: duplicate key value violates unique constraint \"unique_email\" (email)"),
                        "email"
                );

        doThrow(new DataAccessException("Database error", violationException) {}).when(utilisateurService).addUtilisateur(utilisateurDTO, utilisateurDTO.getRole());

        ResponseEntity<?> response = utilisateurController.creerUtilisateur(utilisateurDTO, bindingResult);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Violation de contrainte unique : La valeur \"email\" existe déjà.", response.getBody());
    }

    @Test
    public void testConnexionWithValidationErrors() {
        // Cas où il y a des erreurs de validation
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setEmail("invalid");
        utilisateurDTO.setPassword("123");

        when(bindingResult.hasErrors()).thenReturn(true);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(new FieldError("email", "email", "Email invalide")));

        ResponseEntity<?> response = utilisateurController.connexion(utilisateurDTO, bindingResult);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Erreur de validation : Email invalide", response.getBody());
    }

    @Test
    public void testConnexionSuccess() throws Exception {
        // Cas de succès de la connexion
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setEmail("test@example.com");
        utilisateurDTO.setPassword("password123");

        when(bindingResult.hasErrors()).thenReturn(false);
        when(utilisateurService.login(anyString(), anyString())).thenReturn(utilisateurDTO);

        mockMvc.perform(post("/connexion")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\": \"test@example.com\", \"password\": \"password123\"}"))
            .andExpect(status().isOk())
            .andExpect(content().json("{\"email\": \"test@example.com\", \"password\": \"password123\"}"));
    }

    @Test
    public void testConnexionException() throws Exception {
        // Cas où une exception est levée pendant la connexion
        when(bindingResult.hasErrors()).thenReturn(false);
        when(utilisateurService.login(anyString(), anyString())).thenThrow(new RuntimeException("Erreur de connexion"));

        mockMvc.perform(post("/connexion")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\": \"test@example.com\", \"password\": \"password123\"}"))
            .andExpect(status().isInternalServerError())
            .andExpect(content().string("Une erreur s'est produite : Erreur de connexion"));
    }
}