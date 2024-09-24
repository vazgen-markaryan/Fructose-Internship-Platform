package fructose.service;

import fructose.model.OffreStage;
import fructose.repository.OffreStageRepository;
import fructose.service.dto.OffreStageDTO;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class OffreStageServiceTest {

    @InjectMocks
    private OffreStageService offreStageService;

    @Mock
    private OffreStageRepository offreStageRepository;

    @Mock
    private OffreStageDTO offreStageDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        offreStageDTO = new OffreStageDTO();
        offreStageDTO.setId(1L);
        offreStageDTO.setNom("Google");
        offreStageDTO.setPoste("Developpeur Java");
        offreStageDTO.setDescription("Faire du développement Java chez Google");
        offreStageDTO.setCompagnie("Google");
        offreStageDTO.setProgrammeEtude("Technique de l'informatique");
        offreStageDTO.setTauxHoraire("25");
        offreStageDTO.setAdresse("1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis");
        offreStageDTO.setTypeEmploi("Presentiel");
        offreStageDTO.setModaliteTravail("Temps plein");
        offreStageDTO.setDateDebut(LocalDate.of(2022, 5, 1));
        offreStageDTO.setDateFin(LocalDate.of(2022, 8, 31));
        offreStageDTO.setNombreHeuresSemaine("40 heures");
        offreStageDTO.setNombrePostes(5);
        offreStageDTO.setDateLimiteCandidature(LocalDate.of(2022, 4, 1));
    }

    @Test
    void testAddOffreStageSuccess() {
        offreStageService.addOffreStage(offreStageDTO);

        verify(offreStageRepository, times(1)).save(any(OffreStage.class));
    }

    @Test
    void testAddOffreStageIdNull() {
        offreStageDTO.setId(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("id: L'identifiant ne peut pas être null", exception.getMessage());
    }

    @Test
    void testAddOffreStageNomNull() {
        offreStageDTO.setNom(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("nom: Le nom ne peut pas être vide", exception.getMessage());
    }

    @Test
    void testAddOffreStageNomVide() {
        offreStageDTO.setNom("");
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        for (String errorMessage : exception.getMessage().split(", ")) {
            assertTrue(errorMessage.equals("nom: Le nom ne peut pas être vide") ||
                    errorMessage.equals("nom: Le nom doit contenir au moins 3 caractères") ||
                    errorMessage.equals("nom: Le nom doit contenir uniquement des lettres et des espaces"));
        }
    }

    @Test
    void testAddOffreStageNomTropCourt() {
        offreStageDTO.setNom("AB");
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("nom: Le nom doit contenir au moins 3 caractères et au plus 100 caractères", exception.getMessage());
    }

    @Test
    void testAddOffreStageNomInvalide() {
        offreStageDTO.setNom("Google123");
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("nom: Le nom doit contenir uniquement des lettres et des espaces", exception.getMessage());
    }

    @Test
    void testAddOffreStagePosteNull() {
        offreStageDTO.setPoste(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("poste: Le poste ne peut pas être vide", exception.getMessage());
    }

    @Test
    void testAddOffreStageDescriptionNull() {
        offreStageDTO.setDescription(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("description: La description ne peut pas être vide", exception.getMessage());
    }

    @Test
    void testAddOffreStageCompagnieNull() {
        offreStageDTO.setCompagnie(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("compagnie: La compagnie ne peut pas être vide", exception.getMessage());
    }

    @Test
    void testAddOffreStageProgrammeEtudeNull() {
        offreStageDTO.setProgrammeEtude(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("programmeEtude: Le programme d'étude ne peut pas être vide", exception.getMessage());
    }

    @Test
    void testAddOffreStageTauxHoraireNull() {
        offreStageDTO.setTauxHoraire(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("tauxHoraire: Le taux horaire ne peut pas être vide", exception.getMessage());
    }

    @Test
    void testAddOffreStageTypeEmploiNull() {
        offreStageDTO.setTypeEmploi(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("typeEmploi: Le type d'emploi ne peut pas être null", exception.getMessage());
    }

    @Test
    void testAddOffreStageTypeEmploiInvalid() {
        offreStageDTO.setTypeEmploi("Pina Colada");
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("typeEmploi: Le type d'emploi doit être l'un des suivants : Presentiel, Virtuel, Hybride", exception.getMessage());
    }

    @Test
    void testAddOffreStageAdresseNull() {
        offreStageDTO.setAdresse(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("adresse: L'adresse ne peut pas être vide", exception.getMessage());
    }

    @Test
    void testAddOffreStageModaliteTravailNull() {
        offreStageDTO.setModaliteTravail(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("modaliteTravail: La modalité de travail ne peut pas être vide", exception.getMessage());
    }

    @Test
    void testAddOffreStageDateDebutNull() {
        offreStageDTO.setDateDebut(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("dateDebut: La date de début ne peut pas être null", exception.getMessage());
    }

    @Test
    void testAddOffreStageDateFinNull() {
        offreStageDTO.setDateFin(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("dateFin: La date de fin ne peut pas être null", exception.getMessage());
    }

    @Test
    void testAddOffreStageNombreHeuresSemaineNull() {
        offreStageDTO.setNombreHeuresSemaine(null);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("nombreHeuresSemaine: Le nombre d'heures par semaine ne peut pas être vide", exception.getMessage());
    }

    @Test
    void testAddOffreStageNombrePostesInvalid() {
        offreStageDTO.setNombrePostes(0);
        Exception exception = assertThrows(ConstraintViolationException.class, () -> {
            offreStageService.addOffreStage(offreStageDTO);
        });
        assertEquals("nombrePostes: Le nombre de postes ne peut pas être inferieur a 1", exception.getMessage());
    }

    @Test
    void testAddOffreStageNull() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            offreStageService.addOffreStage(null);
        });

        assertEquals("OffreStageDTO ne peut pas être nul", exception.getMessage());
    }

    @Test
    void testDeleteOffreStageSuccess() {
        offreStageService.deleteOffreStage(offreStageDTO.getId());

        verify(offreStageRepository, times(1)).deleteById(offreStageDTO.getId());
    }
    @Test
    void testGetOffreStageSuccess() {
        OffreStage offreStage = OffreStageDTO.toEntity(offreStageDTO);
        when(offreStageRepository.findById(offreStageDTO.getId())).thenReturn(Optional.of(offreStage));

        OffreStageDTO result = offreStageService.getOffreStage(offreStageDTO.getId());
        assertNotNull(result);
    }
}
