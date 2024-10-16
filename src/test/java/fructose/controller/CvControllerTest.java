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

        ResponseEntity<String> response = (ResponseEntity<String>) cvController.enregistrerCV(file);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Fichier PDF enregistré avec succès.", response.getBody());
    }

    @Test
    public void testEnregistrerCV_Failure() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", MediaType.APPLICATION_PDF_VALUE, "test content".getBytes());

        doThrow(new IOException("Error")).when(cvService).addCv(file);

        ResponseEntity<String> response = (ResponseEntity<String>) cvController.enregistrerCV(file);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Erreur lors de la lecture du fichier.", response.getBody());
    }
}
