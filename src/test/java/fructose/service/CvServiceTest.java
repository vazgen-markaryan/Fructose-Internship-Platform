package fructose.service;

import fructose.model.Cv;
import fructose.model.OffreStage;
import fructose.repository.CvRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CvServiceTest {

    @Mock
    private CvRepository cvRepository;

    @InjectMocks
    private CvService cvService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testAddCv() throws IOException {
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
    void testAddCv_Failure() throws IOException {
        MockMultipartFile mockFile = new MockMultipartFile(
                "cv",
                "testCv.pdf",
                "application/pdf",
                "Dummy PDF Content".getBytes()
        );


        doThrow(new RuntimeException("Database error")).when(cvRepository).save(any(Cv.class));
        try {
            cvService.addCv(mockFile);
        } catch (RuntimeException e) {
            assertEquals("Database error", e.getMessage());
            return;
        }

        fail("Expected a RuntimeException to be thrown");
    }


}
