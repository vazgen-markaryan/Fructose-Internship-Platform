package fructose.controller;

import fructose.service.EvaluationService;
import fructose.service.dto.EvaluationEmployeurDTO;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EvaluationControllerTest {

    @Mock
    private EvaluationService evaluationService;

    @InjectMocks
    private EvaluationController evaluationController;

    public EvaluationControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void creerEvaluation_success() throws Exception {
        EvaluationEmployeurDTO evaluationDTO = new EvaluationEmployeurDTO();

        File tempFile = File.createTempFile("evaluation_stagiaire", ".pdf");
        tempFile.deleteOnExit();

        when(evaluationService.creerEvaluation(evaluationDTO)).thenReturn(tempFile.getAbsolutePath());

        ResponseEntity<byte[]> response = evaluationController.creerEvaluation(evaluationDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals("application/pdf", response.getHeaders().getContentType().toString());
        verify(evaluationService, times(1)).creerEvaluation(evaluationDTO);
    }


    @Test
    void creerEvaluation_fileNotFound() {
        EvaluationEmployeurDTO evaluationDTO = new EvaluationEmployeurDTO();
        String invalidPath = "invalid/path/evaluation_stagiaire.pdf";
        when(evaluationService.creerEvaluation(evaluationDTO)).thenReturn(invalidPath);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> evaluationController.creerEvaluation(evaluationDTO));
        assertEquals(500, exception.getStatusCode().value());
        verify(evaluationService, times(1)).creerEvaluation(evaluationDTO);
    }

    @Test
    void recupererEvaluationEleve_success() throws Exception {
        EvaluationEmployeurDTO evaluationDTO = new EvaluationEmployeurDTO();

        File tempFile = File.createTempFile("evaluation_stagiaire", ".pdf");
        tempFile.deleteOnExit();

        when(evaluationService.recupererEvaluationParId(evaluationDTO)).thenReturn(tempFile.getAbsolutePath());

        ResponseEntity<byte[]> response = evaluationController.recupererEvaluationEleve(evaluationDTO);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertEquals("application/pdf", response.getHeaders().getContentType().toString());
        verify(evaluationService, times(1)).recupererEvaluationParId(evaluationDTO);
    }


    @Test
    void findAllEvaluation_success() {
        List<EvaluationEmployeurDTO> mockEvaluations = Arrays.asList(
                new EvaluationEmployeurDTO(),
                new EvaluationEmployeurDTO()
        );
        when(evaluationService.findAllEvaluation()).thenReturn(mockEvaluations);

        ResponseEntity<?> response = evaluationController.findAllEvaluation();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof List);
        verify(evaluationService, times(1)).findAllEvaluation();
    }

    @Test
    void findAllEvaluation_failure() {
        when(evaluationService.findAllEvaluation()).thenThrow(new RuntimeException("Database error"));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> evaluationController.findAllEvaluation());
        assertEquals(500, exception.getStatusCode().value());
        verify(evaluationService, times(1)).findAllEvaluation();
    }

    @Test
    void recupererEvaluationEleve_fileNotFound() throws Exception {
        // Arrange
        EvaluationEmployeurDTO evaluationDTO = new EvaluationEmployeurDTO();
        String nonExistentPdfPath = "mock/path/nonexistent.pdf";

        // Simuler que le service retourne un chemin vers un fichier inexistant
        when(evaluationService.recupererEvaluationParId(evaluationDTO)).thenReturn(nonExistentPdfPath);

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            evaluationController.recupererEvaluationEleve(evaluationDTO);
        });

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, exception.getStatusCode());
        assertEquals("Error generating evaluation PDF", exception.getReason());
        verify(evaluationService, times(1)).recupererEvaluationParId(evaluationDTO);
    }

}
