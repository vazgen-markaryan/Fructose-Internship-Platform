package fructose.controller;

import fructose.service.CvService;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class CvControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CvService cvService;

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

        doNothing().when(cvService).addCv(file);

        ResponseEntity<String> response = cvController.enregistrerCV(file);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Fichier PDF enregistré avec succès.", response.getBody());
    }

    @Test
    public void testEnregistrerCV_Failure() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test content".getBytes());

        doThrow(new IOException("Error")).when(cvService).addCv(file);

        ResponseEntity<String> response = cvController.enregistrerCV(file);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Erreur lors de la lecture du fichier.", response.getBody());
    }

    @Test
    public void testEnregistrerCV_FichierVide() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "", MediaType.APPLICATION_PDF_VALUE, new byte[0]);

        ResponseEntity<String> response = cvController.enregistrerCV(file);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Le fichier est vide. Veuillez télécharger un fichier PDF valide.", response.getBody());
    }

    @Test
    public void testEnregistrerCV_MauvaisTypeFichier() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", MediaType.TEXT_PLAIN_VALUE, "test content".getBytes());

        ResponseEntity<String> response = cvController.enregistrerCV(file);

        assertEquals(HttpStatus.UNSUPPORTED_MEDIA_TYPE, response.getStatusCode());
        assertEquals("Le fichier n'est pas au format PDF. Veuillez télécharger un fichier PDF.", response.getBody());
    }

    @Test
    public void testEnregistrerCV_ExceptionInService() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test content".getBytes());

        // Simuler une exception inattendue dans le service
        doThrow(new RuntimeException("Unexpected error")).when(cvService).addCv(file);

        ResponseEntity<String> response = cvController.enregistrerCV(file);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Une erreur inattendue s'est produite.", response.getBody());
    }

}
