package fructose.controller;

import fructose.service.OffreStageService;
import fructose.service.UtilisateurService;
import fructose.service.dto.OffreStageDTO;
import org.hibernate.exception.ConstraintViolationException;
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

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


public class OffreStageControllerTest {

    @InjectMocks
    private OffreStageController offreStageController;

    @Mock
    private OffreStageService offreStageService;

    @Mock
    private UtilisateurService utilisateurService;

    @Mock
    private OffreStageDTO offreStageDTO;

    @Mock
    private BindingResult bindingResult;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreerOffreStageSucces() {
        when(bindingResult.hasErrors()).thenReturn(false);
        doNothing().when(offreStageService).addOffreStage(any(OffreStageDTO.class));
        ResponseEntity<?> response = offreStageController.creerOffreStage("token", offreStageDTO, bindingResult);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Offre de stage créée avec succès !", response.getBody());

        verify(offreStageService, times(1)).addOffreStage(offreStageDTO);
    }

    @Test
    void testCreerOffreStageInvalide() {
        when(bindingResult.hasErrors()).thenReturn(true);
        when(bindingResult.getFieldErrors()).thenReturn(
                List.of(new FieldError("offreStageDTO", "nom", "Le nom n'est pas valide"))
        );

        ResponseEntity<?> response = offreStageController.creerOffreStage("token", offreStageDTO, bindingResult);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Erreur de validation : Le nom n'est pas valide", response.getBody());

        verify(bindingResult, times(1)).hasErrors();
        verify(bindingResult, times(1)).getFieldErrors();
        verifyNoInteractions(offreStageService);
    }

    @Test
    void testCreerOffreStageDataAccessException() {
        when(bindingResult.hasErrors()).thenReturn(false);
        doThrow(new DataAccessException("Database error") {}).when(offreStageService).addOffreStage(any(OffreStageDTO.class));

        ResponseEntity<?> response = offreStageController.creerOffreStage("token", offreStageDTO, bindingResult);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Erreur lors de la création de l'offre de stage.", response.getBody());

        verify(offreStageService, times(1)).addOffreStage(offreStageDTO);
    }

    @Test
    void testCreerOffreStageUniqueConstraintViolationException() {
        when(bindingResult.hasErrors()).thenReturn(false);
        SQLException sqlException = new SQLException("Unique constraint violation (1L)");
        ConstraintViolationException constraintViolationException = new ConstraintViolationException("Database error", sqlException, "constraint violation");
        doThrow(new DataAccessException("Database error", constraintViolationException) {}).when(offreStageService).addOffreStage(any(OffreStageDTO.class));

        ResponseEntity<?> response = offreStageController.creerOffreStage("token", offreStageDTO, bindingResult);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Violation de contrainte unique : La valeur \"1L\" existe déjà.", response.getBody());

        verify(offreStageService, times(1)).addOffreStage(offreStageDTO);
    }

    @Test
    void testCreerOffreStageException() {
        when(bindingResult.hasErrors()).thenReturn(false);
        doThrow(new IllegalStateException("The Byte Buddy agent is not loaded or this method is not called via the system class loader")).when(offreStageService).addOffreStage(any(OffreStageDTO.class));

        ResponseEntity<?> response = offreStageController.creerOffreStage("token", offreStageDTO, bindingResult);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Une erreur inattendue s'est produite.", response.getBody());

        verify(offreStageService, times(1)).addOffreStage(offreStageDTO);
    }

    @Test
    void testModifierOffreStageSucces() {
        when(bindingResult.hasErrors()).thenReturn(false);
        doNothing().when(offreStageService).updateOffreStage(any(OffreStageDTO.class));
        ResponseEntity<?> response = offreStageController.modifierOffreStage("token", offreStageDTO, bindingResult);

        // Create hashmap for success response
        HashMap<String, String> successResponse = new HashMap<>();
        successResponse.put("message", "Offre de stage modifiée avec succès !");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(successResponse, response.getBody());

        verify(offreStageService, times(1)).updateOffreStage(offreStageDTO);
    }

    @Test
    void testModifierOffreStageInvalide() {
        when(bindingResult.hasErrors()).thenReturn(true);
        when(bindingResult.getFieldErrors()).thenReturn(
                List.of(new FieldError("offreStageDTO", "nom", "Le nom n'est pas valide"))
        );

        ResponseEntity<?> response = offreStageController.modifierOffreStage("token", offreStageDTO, bindingResult);

        // Create hashmap for error response
        HashMap<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
        errorResponse.put("errors", List.of("Le nom n'est pas valide"));
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(errorResponse, response.getBody());

        verify(bindingResult, times(1)).hasErrors();
        verify(bindingResult, times(1)).getFieldErrors();
        verifyNoInteractions(offreStageService);
    }

    @Test
    void testModifierOffreStageDataAccessException() {
        when(bindingResult.hasErrors()).thenReturn(false);
        doThrow(new DataAccessException("Database error") {}).when(offreStageService).updateOffreStage(any(OffreStageDTO.class));

        ResponseEntity<?> response = offreStageController.modifierOffreStage("token", offreStageDTO, bindingResult);

        // Create hashmap for error response
        HashMap<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Erreur lors de la modification de l'offre de stage.");
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(errorResponse, response.getBody());

        verify(offreStageService, times(1)).updateOffreStage(offreStageDTO);
    }

    @Test
    void testModifierOffreStageUniqueConstraintViolationException() {
        when(bindingResult.hasErrors()).thenReturn(false);
        SQLException sqlException = new SQLException("Unique constraint violation (1L)");
        ConstraintViolationException constraintViolationException = new ConstraintViolationException("Database error", sqlException, "constraint violation");
        doThrow(new DataAccessException("Database error", constraintViolationException) {}).when(offreStageService).updateOffreStage(any(OffreStageDTO.class));

        ResponseEntity<?> response = offreStageController.modifierOffreStage("token", offreStageDTO, bindingResult);

        HashMap<String, String> expectedResponse = new HashMap<>();
        expectedResponse.put("message", "Violation de contrainte unique : La valeur \"1L\" existe déjà.");
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());

        verify(offreStageService, times(1)).updateOffreStage(offreStageDTO);
    }

    @Test
    void testModifierOffreStageUnexpectedException() {
        when(bindingResult.hasErrors()).thenReturn(false);
        doThrow(new RuntimeException("Unexpected error")).when(offreStageService).updateOffreStage(any(OffreStageDTO.class));

        ResponseEntity<?> response = offreStageController.modifierOffreStage("token", offreStageDTO, bindingResult);

        HashMap<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Une erreur inattendue s'est produite.");
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(errorResponse, response.getBody());

        verify(offreStageService, times(1)).updateOffreStage(offreStageDTO);
    }

    @Test
    void testGetOffreStage() {
        List<OffreStageDTO> offresStage = List.of(new OffreStageDTO(), new OffreStageDTO());
        when(offreStageService.getOffresStage()).thenReturn(offresStage);

        ResponseEntity<?> response = offreStageController.getOffreStage();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(offresStage, response.getBody());

        verify(offreStageService, times(1)).getOffresStage();
    }

    @Test
    void testGetOffreStageNotFound() {
        when(offreStageService.getOffresStage()).thenThrow(new IllegalArgumentException());

        ResponseEntity<?> response = offreStageController.getOffreStage();

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Aucune offre de stage n'a été trouvée.", response.getBody());

        verify(offreStageService, times(1)).getOffresStage();
    }

    @Test
    void testGetOffreStageException() {
        when(offreStageService.getOffresStage()).thenThrow(new RuntimeException("Unexpected error"));

        ResponseEntity<?> response = offreStageController.getOffreStage();

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Une erreur inattendue s'est produite.", response.getBody());

        verify(offreStageService, times(1)).getOffresStage();
    }

    @Test
    void testGetOffreStageByIdSuccess() {
        OffreStageDTO offreStageDTO = new OffreStageDTO();
        when(offreStageService.getOffreStageById(1L)).thenReturn(offreStageDTO);

        ResponseEntity<?> response = offreStageController.getOffreStageById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(offreStageDTO, response.getBody());

        verify(offreStageService, times(1)).getOffreStageById(1L);
    }

    @Test
    void testGetOffreStageByIdException() {
        when(offreStageService.getOffreStageById(1L)).thenThrow(new IllegalArgumentException("L'offre stage avec l'ID: 1 n'existe pas, alors il ne peut pas être récupéré"));

        ResponseEntity<?> response = offreStageController.getOffreStageById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Aucune offre de stage n'a été trouvée avec l'ID: 1", response.getBody());

        verify(offreStageService, times(1)).getOffreStageById(1L);
    }

    @Test
    void testGetOffreStageByIdGenericException() {
        when(offreStageService.getOffreStageById(1L)).thenThrow(new RuntimeException("Unexpected error"));

        ResponseEntity<?> response = offreStageController.getOffreStageById(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Une erreur inattendue s'est produite.", response.getBody());

        verify(offreStageService, times(1)).getOffreStageById(1L);
    }

    @Test
    void testDeleteOffreStageSuccess() {
        doNothing().when(offreStageService).deleteOffreStage(1L);

        ResponseEntity<?> response = offreStageController.deleteOffreStage(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Offre de stage supprimée avec succès !", response.getBody());

        verify(offreStageService, times(1)).deleteOffreStage(1L);
    }

    @Test
    void testDeleteOffreStageException() {
        doThrow(new RuntimeException("Unexpected error")).when(offreStageService).deleteOffreStage(1L);

        ResponseEntity<?> response = offreStageController.deleteOffreStage(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Une erreur inattendue s'est produite.", response.getBody());

        verify(offreStageService, times(1)).deleteOffreStage(1L);
    }
}