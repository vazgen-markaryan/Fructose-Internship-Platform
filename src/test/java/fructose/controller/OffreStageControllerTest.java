package fructose.controller;

import fructose.service.OffreStageService;
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
        ResponseEntity<?> response = offreStageController.creerOffreStage(offreStageDTO, bindingResult);

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

        ResponseEntity<?> response = offreStageController.creerOffreStage(offreStageDTO, bindingResult);

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

        ResponseEntity<?> response = offreStageController.creerOffreStage(offreStageDTO, bindingResult);

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

        ResponseEntity<?> response = offreStageController.creerOffreStage(offreStageDTO, bindingResult);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Violation de contrainte unique : La valeur \"1L\" existe déjà.", response.getBody());

        verify(offreStageService, times(1)).addOffreStage(offreStageDTO);
    }

    @Test
    void testCreerOffreStageException() {
        when(bindingResult.hasErrors()).thenReturn(false);
        doThrow(new RuntimeException()).when(offreStageService).addOffreStage(any(OffreStageDTO.class));

        ResponseEntity<?> response = offreStageController.creerOffreStage(offreStageDTO, bindingResult);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Une erreur inattendue s'est produite.", response.getBody());

        verify(offreStageService, times(1)).addOffreStage(offreStageDTO);
    }
}