package fructose.controller;

import fructose.model.Cv;
import fructose.service.CvService;
import fructose.service.UtilisateurService;
import fructose.service.dto.UtilisateurDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class CvControllerTest {
    private MockMvc mockMvc;

    @Mock
    private CvService cvService;

    @Mock
    private UtilisateurService utilisateurService;

    @InjectMocks
    private CvController cvController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(cvController).build();
    }

    @Test
    public void testEnregistrerCV_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test content".getBytes());
        String token = "validToken";

        when(utilisateurService.validationToken(token)).thenReturn(true);
        when(utilisateurService.getUtilisateurByToken(token)).thenReturn(new UtilisateurDTO());
        doNothing().when(cvService).addCv(any(), any());

        ResponseEntity<String> response = cvController.enregistrerCV(token, file);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Fichier PDF enregistré avec succès.", response.getBody());
    }

    @Test
    public void testEnregistrerCV_Failure_FileEmpty() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "", "", new byte[0]);
        String token = "validToken";

        when(utilisateurService.validationToken(token)).thenReturn(true);

        ResponseEntity<String> response = cvController.enregistrerCV(token, file);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Le fichier est vide. Veuillez télécharger un fichier PDF valide.", response.getBody());
    }

    @Test
    public void testEnregistrerCV_Failure_InvalidFileType() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "test content".getBytes());
        String token = "validToken";

        when(utilisateurService.validationToken(token)).thenReturn(true);

        ResponseEntity<String> response = cvController.enregistrerCV(token, file);

        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, response.getStatusCode());
        assertEquals("Le fichier n'est pas au format PDF. Veuillez télécharger un fichier PDF.", response.getBody());
    }

    @Test
    public void testEnregistrerCV_Failure_TokenInvalid() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test content".getBytes());
        String token = "invalidToken";

        when(utilisateurService.validationToken(token)).thenReturn(false);

        ResponseEntity<String> response = cvController.enregistrerCV(token, file);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Le Token est invalid", response.getBody());
    }

    @Test
    public void testEnregistrerCV_Failure_ReadError() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test content".getBytes());
        String token = "validToken";

        when(utilisateurService.validationToken(token)).thenReturn(true);
        when(utilisateurService.getUtilisateurByToken(token)).thenReturn(new UtilisateurDTO());
        doThrow(new IOException("Error")).when(cvService).addCv(any(), any());

        ResponseEntity<String> response = cvController.enregistrerCV(token, file);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Erreur lors de la lecture du fichier.", response.getBody());
    }

    @Test
    public void testEnregistrerCV_Failure_UnexpectedError() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test content".getBytes());
        String token = "validToken";

        when(utilisateurService.validationToken(token)).thenReturn(true);
        when(utilisateurService.getUtilisateurByToken(token)).thenReturn(new UtilisateurDTO());
        doThrow(new RuntimeException("Unexpected error")).when(cvService).addCv(any(), any());

        ResponseEntity<String> response = cvController.enregistrerCV(token, file);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Une erreur inattendue s'est produite.", response.getBody());
    }

    @Test
    public void testGetAllCvs_Success() {
        // Simuler la validation du token et la récupération de CVs
        when(utilisateurService.validationToken("validToken")).thenReturn(true);
        when(cvService.getAllCvs()).thenReturn(Collections.singletonList(new Cv())); // Ajouter un CV fictif

        ResponseEntity<List<Cv>> response = cvController.getAllCvs("validToken");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size()); // Vérifiez que la liste contient un élément
    }

    @Test
    public void testGetAllCvs_RuntimeException() {
        // Simuler la validation du token et une exception lors de la récupération des CVs
        when(utilisateurService.validationToken("validToken")).thenReturn(true);
        when(cvService.getAllCvs()).thenThrow(new RuntimeException("Database error"));

        ResponseEntity<List<Cv>> response = cvController.getAllCvs("validToken");

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
    @Test
    public void testGetAllCvs_Unauthorized() {
        String token = "invalidToken";

        when(utilisateurService.validationToken(token)).thenReturn(false);

        ResponseEntity<List<Cv>> response = cvController.getAllCvs(token);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}
