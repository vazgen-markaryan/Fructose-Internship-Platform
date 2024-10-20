package fructose.service;

import fructose.model.Cv;
import fructose.model.Utilisateur;
import fructose.model.auth.Role;
import fructose.repository.CvRepository;
import fructose.service.dto.UtilisateurDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

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

    private UtilisateurDTO utilisateurDTO;

    @BeforeEach
    void setUp() {
        utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setId(1L);
        utilisateurDTO.setFullName("John Doe");
        utilisateurDTO.setEmail("john.doe@example.com");
        utilisateurDTO.setPassword("password123");
        utilisateurDTO.setMatricule("1234567");
        utilisateurDTO.setRole(Role.ETUDIANT);
        utilisateurDTO.setDepartement("Informatique");
        utilisateurDTO.setCompanyName("TechCorp");
    }

    @Test
    void testAddCv_Success() throws IOException {
        MockMultipartFile mockFile = new MockMultipartFile(
                "cv",
                "testCv.pdf",
                "application/pdf",
                "Dummy PDF Content".getBytes()
        );

        cvService.addCv(mockFile, utilisateurDTO);

        verify(cvRepository, times(1)).save(any(Cv.class));
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
            cvService.addCv(mockFile, utilisateurDTO);
        });

        assertEquals("Une erreur inattendue est survenue lors de l'enregistrement du fichier PDF.", exception.getMessage());
    }


    @Test
    void testGetAllCvs_Success() {
        Cv cv1 = new Cv();
        Cv cv2 = new Cv();
        List<Cv> cvList = Arrays.asList(cv1, cv2);

        when(cvRepository.findAll()).thenReturn(cvList);

        List<Cv> result = cvService.getAllCvs();

        assertEquals(2, result.size());
    }

    @Test
    void testGetAllCvs_Failure() {
        doThrow(new RuntimeException("Database error")).when(cvRepository).findAll();

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            cvService.getAllCvs();
        });

        assertEquals("Une erreur est survenue lors de la récupération des CVs.", exception.getMessage());
    }
}
