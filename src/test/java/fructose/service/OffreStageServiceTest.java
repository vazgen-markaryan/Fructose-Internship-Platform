package fructose.service;

import fructose.model.OffreStage;
import fructose.repository.OffreStageRepository;
import fructose.service.dto.OffreStageDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OffreStageServiceTest {

    @Mock
    private OffreStageService offreStageService;

    @Mock
    private OffreStageRepository offreStageRepository;

    @Mock
    private OffreStage offreStage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        offreStage = new OffreStage();
        offreStage.setId(1L);
        offreStage.setNom("Développeur Java chez Google");
        offreStage.setPoste("Développeur Java");
        offreStage.setDescription("Faire du développement Java chez Google");
        offreStage.setCompagnie("Google");
        offreStage.setProgrammeEtude("Techniques de l'informatique");
        offreStage.setTauxHoraire("25$");
        offreStage.setAdresse("1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis");
        offreStage.setModaliteTravail("Télétravail");
        offreStage.setDateDebut(LocalDate.of(2022, 5, 1));
        offreStage.setDateFin(LocalDate.of(2022, 8, 31));
        offreStage.setNombreHeuresSemaine("40 heures");
        offreStage.setNombrePostes(5);
        offreStage.setDateLimiteCandidature(LocalDate.of(2022, 4, 1));
    }

    @Test
    void testAddOffreStage() {
        OffreStageDTO offreStageDTO = new OffreStageDTO();
        offreStageDTO.setNom("Développeur Java chez Google");
        offreStageDTO.setPoste("Développeur Java");
        offreStageDTO.setDescription("Faire du développement Java chez Google");
        offreStageDTO.setCompagnie("Google");
        offreStageDTO.setProgrammeEtude("Techniques de l'informatique");
        offreStageDTO.setTauxHoraire("25$");
        offreStageDTO.setAdresse("1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis");
        offreStageDTO.setModaliteTravail("Télétravail");
        offreStageDTO.setDateDebut(LocalDate.of(2022, 5, 1));
        offreStageDTO.setDateFin(LocalDate.of(2022, 8, 31));
        offreStageDTO.setNombreHeuresSemaine("40 heures");
        offreStageDTO.setNombrePostes(5);
        offreStageDTO.setDateLimiteCandidature(LocalDate.of(2022, 4, 1));

        when(offreStageRepository.save(any(OffreStage.class))).thenReturn(offreStage);

        offreStageService.addOffreStage(offreStageDTO);

        verify(offreStageRepository, times(1)).save(any(OffreStage.class));

    }

    @Test
    void testDeleteOffreStage() {
        when(offreStageRepository.findById(offreStage.getId())).thenReturn(java.util.Optional.of(offreStage));
    }

    @Test
    void testGetOffreStage() {
        OffreStageDTO expectedOffreStageDTO = OffreStageDTO.toDTO(offreStage);

        when(offreStageRepository.findById(offreStage.getId())).thenReturn(java.util.Optional.of(offreStage));

        OffreStageDTO result = offreStageService.getOffreStage(offreStage.getId());

        assertNotNull(result);
        assertEquals(expectedOffreStageDTO.getNom(), result.getNom());
        assertEquals(expectedOffreStageDTO.getPoste(), result.getPoste());
        assertEquals(expectedOffreStageDTO.getDescription(), result.getDescription());
        assertEquals(expectedOffreStageDTO.getCompagnie(), result.getCompagnie());
        assertEquals(expectedOffreStageDTO.getProgrammeEtude(), result.getProgrammeEtude());
        assertEquals(expectedOffreStageDTO.getTauxHoraire(), result.getTauxHoraire());
        assertEquals(expectedOffreStageDTO.getAdresse(), result.getAdresse());
        assertEquals(expectedOffreStageDTO.getModaliteTravail(), result.getModaliteTravail());
        assertEquals(expectedOffreStageDTO.getDateDebut(), result.getDateDebut());
        assertEquals(expectedOffreStageDTO.getDateFin(), result.getDateFin());
        assertEquals(expectedOffreStageDTO.getNombreHeuresSemaine(), result.getNombreHeuresSemaine());
        assertEquals(expectedOffreStageDTO.getNombrePostes(), result.getNombrePostes());
        assertEquals(expectedOffreStageDTO.getDateLimiteCandidature(), result.getDateLimiteCandidature());
    }
}
