package fructose.service;

import fructose.model.Cv;
import fructose.repository.CvRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CvServiceTest {

    @Mock
    private CvRepository cvRepository;

    @InjectMocks
    private CvService cvService;

    @Test
    void testAddCv_Success() throws IOException {
        MockMultipartFile mockFile = new MockMultipartFile(
                "cv",
                "testCv.pdf",
                "application/pdf",
                "Dummy PDF Content".getBytes()
        );

        cvService.addCv(mockFile);
        verify(cvRepository, times(1)).save(any(Cv.class));
    }

    @Test
    void testAddCv_Failure_FileEmpty() {
        MockMultipartFile mockFile = new MockMultipartFile(
                "cv",
                "testCv.pdf",
                "application/pdf",
                new byte[0] // Fichier vide
        );

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            cvService.addCv(mockFile);
        });

        assertEquals("Le fichier est vide ou invalide.", exception.getMessage());
    }

    @Test
    void testAddCv_Failure_InvalidFileType() {
        MockMultipartFile mockFile = new MockMultipartFile(
                "cv",
                "testCv.txt",
                "text/plain",
                "Dummy Content".getBytes()
        );

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            cvService.addCv(mockFile);
        });

        assertEquals("Le fichier n'est pas au format PDF.", exception.getMessage());
    }

    @Test
    void testAddCv_Failure_DatabaseError() throws IOException {
        MockMultipartFile mockFile = new MockMultipartFile(
                "cv",
                "testCv.pdf",
                "application/pdf",
                "Dummy PDF Content".getBytes()
        );

        doThrow(new RuntimeException("Database error")).when(cvRepository).save(any(Cv.class));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            cvService.addCv(mockFile);
        });

        assertEquals("Une erreur inattendue est survenue lors de l'enregistrement du fichier PDF.", exception.getMessage());
    }
}