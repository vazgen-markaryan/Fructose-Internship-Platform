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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

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


}
