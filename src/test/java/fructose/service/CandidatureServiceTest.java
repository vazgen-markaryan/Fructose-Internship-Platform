package fructose.service;

import fructose.model.*;
import fructose.model.auth.Credentials;
import fructose.model.enumerator.EtatCandidature;
import fructose.model.enumerator.Role;
import fructose.repository.CandidatureRepository;
import fructose.repository.CvRepository;
import fructose.repository.OffreStageRepository;
import fructose.service.dto.CandidatureDTO;
import fructose.service.dto.CvDTO;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.OffreStageDTO;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CandidatureServiceTest {

    @InjectMocks
    private CandidatureService candidatureService;

    @Mock
    private CandidatureRepository candidatureRepository;

    @Mock
    private OffreStageRepository offreStageRepository;

    @Mock
    private CvRepository cvRepository;

    private Etudiant etudiant;
    private OffreStage offreStage;
    private Candidature candidature;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        Credentials credentials = Credentials.builder()
                .email("etudiant@example.com")
                .build();
        etudiant = new Etudiant();
        etudiant.setCredentials(credentials);

        offreStage = new OffreStage();
        offreStage.setNom("Stage en Développement");
        offreStage.setCompagnie("TechCorp");

        candidature = new Candidature();
        candidature.setId(1L);
        candidature.setEtudiant(etudiant);
        candidature.setOffreStage(offreStage);
        candidature.setEtat(EtatCandidature.EN_ATTENTE);
    }

    @Test
    void testRefuserCandidatureSuccess() {
        when(candidatureRepository.findById(1L)).thenReturn(Optional.of(candidature));

        candidatureService.refuserCandidature(1L, "Manque de compétences");

        verify(candidatureRepository, times(1)).findById(1L);
        verify(candidatureRepository, times(1)).save(candidature);
    }

    @Test
    void testRefuserCandidatureNotFound() {
        when(candidatureRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> candidatureService.refuserCandidature(1L, "Commentaire"));

        verify(candidatureRepository, times(1)).findById(1L);
        verify(candidatureRepository, never()).save(any(Candidature.class));
    }

    @Test
    void testApprouverCandidatureSuccess() {
        when(candidatureRepository.findById(1L)).thenReturn(Optional.of(candidature));

        candidatureService.approuverCandidature(1L);

        verify(candidatureRepository, times(1)).findById(1L);
        verify(candidatureRepository, times(1)).save(candidature);
    }

    @Test
    void testApprouverCandidatureNotFound() {
        when(candidatureRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> candidatureService.approuverCandidature(1L));

        verify(candidatureRepository, times(1)).findById(1L);
        verify(candidatureRepository, never()).save(any(Candidature.class));
    }

    @Test
    void testGetOffreStageDetailsByEtudiantId() {
        Long etudiantId = 1L;

        List<Candidature> candidatures = Collections.singletonList(candidature);
        when(candidatureRepository.findByEtudiantIdWithoutCv(etudiantId)).thenReturn(candidatures);

        when(offreStageRepository.findById(offreStage.getId())).thenReturn(Optional.of(offreStage));

        List<Map<String, Object>> result = candidatureService.getOffreStageDetailsByEtudiantId(etudiantId);

        verify(candidatureRepository, times(1)).findByEtudiantIdWithoutCv(etudiantId);
        verify(offreStageRepository, times(1)).findById(offreStage.getId());

        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("id", candidature.getId());
        expectedData.put("etat", candidature.getEtat());
        expectedData.put("commentaireRefus", candidature.getCommentaireRefus());
        expectedData.put("nomOffre", offreStage.getNom());
        expectedData.put("compagnie", offreStage.getCompagnie());

        List<Map<String, Object>> expected = Collections.singletonList(expectedData);

        assertEquals(expected, result);
    }

    @Test
    void testGetCandidaturesByOffreStageIdSuccess() {
        Long offreStageId = 1L;

        List<Candidature> candidatures = new ArrayList<>();
        Candidature candidature = new Candidature();
        candidature.setId(1L);
        candidature.setEtat(EtatCandidature.EN_ATTENTE);
        candidature.setCommentaireRefus("N/A");

        Credentials credentials = Credentials.builder().email("Mike@gmail.com").password("GG").role(Role.ETUDIANT).build();
        Utilisateur etudiant = new Utilisateur();
        etudiant.setFullName("John Doe");
        etudiant.setCredentials(credentials);

        Credentials credentials2 = Credentials.builder().email("Blabla@gmail.com").password("GG").role(Role.EMPLOYEUR).build();
        Utilisateur employeur = new Utilisateur();
        employeur.setFullName("John Doe");
        employeur.setCredentials(credentials2);


        Departement departement = new Departement();
        departement.setId(1L);
        etudiant.setDepartement(departement);
        candidature.setEtudiant(etudiant);

        Departement departements = new Departement();
        departements.setId(2L);
        employeur.setDepartement(departement);


        Cv cv = new Cv();
        cv.setId(1L);
        cv.setUtilisateur(etudiant);
        cv.setCommentaireRefus("Refusé par Defaut");
        candidature.setCv(cv);

        OffreStage offreStage = new OffreStage();
        offreStage.setId(1L);
        offreStage.setNom("Stage en Développement");
        offreStage.setCompagnie("TechCorp");
        offreStage.setDepartement(departement);
        offreStage.setTauxHoraire(15.0);
        offreStage.setTypeEmploi("presentiel");
        offreStage.setAdresse("123 Rue Exemple");
        offreStage.setModaliteTravail("temps_plein");
        offreStage.setDateDebut(LocalDate.of(2023, 1, 1));
        offreStage.setDateFin(LocalDate.of(2023, 6, 30));
        offreStage.setNombreHeuresSemaine(40);
        offreStage.setNombrePostes(2);
        offreStage.setDateLimiteCandidature(LocalDate.of(2022, 12, 31));
        offreStage.setOwner(employeur);
        offreStage.setIsApproved(false);
        offreStage.setIsRefused(false);
        offreStage.setCommentaireRefus("Commentaire par défaut");
        candidature.setOffreStage(offreStage);

        candidatures.add(candidature);

        when(candidatureRepository.findByCandidatureByOwner(offreStageId)).thenReturn(candidatures);

        List<Map<String, Object>> result = candidatureService.findByCandidatureByOwner(offreStageId);

        verify(candidatureRepository, times(1)).findByCandidatureByOwner(offreStageId);

        Map<String, Object> expectedData = new HashMap<>();
        expectedData.put("candidature", CandidatureDTO.toDTO(candidature));
        expectedData.put("etudiant", EtudiantDTO.toDTO(etudiant));
        expectedData.put("cv", CvDTO.toDTO(cv));
        expectedData.put("idOffreStage", offreStage.getId());

        List<Map<String, Object>> expected = new ArrayList<>();
        expected.add(expectedData);

        Assertions.assertThat(result).usingRecursiveComparison().isEqualTo(expected);

    }

    @Test
    void testGetCandidaturesByOffreStageIdNoCandidatures() {
        Long offreStageId = 1L;

        // Mock an empty list
        when(candidatureRepository.findByCandidatureByOwner(offreStageId)).thenReturn(Collections.emptyList());

        // Execute service method
        List<Map<String, Object>> result = candidatureService.findByCandidatureByOwner(offreStageId);

        // Verify repository interaction
        verify(candidatureRepository, times(1)).findByCandidatureByOwner(offreStageId);

        // Assert the result is an empty list
        assertTrue(result.isEmpty());
    }

    @Test
    void testPostulerSuccess() {
        Candidature candidature = new Candidature();
        candidature.setId(1L);
        candidature.setEtat(EtatCandidature.EN_ATTENTE);
        candidature.setCommentaireRefus("N/A");

        Credentials credentials = Credentials.builder().email("Mike@gmail.com").password("GG").role(Role.ETUDIANT).build();
        Utilisateur etudiant = new Utilisateur();
        etudiant.setFullName("John Doe");
        etudiant.setCredentials(credentials);

        Credentials credentials2 = Credentials.builder().email("Blabla@gmail.com").password("GG").role(Role.EMPLOYEUR).build();
        Utilisateur employeur = new Utilisateur();
        employeur.setFullName("John Doe");
        employeur.setCredentials(credentials2);

        Departement departement = new Departement();
        departement.setId(1L);
        etudiant.setDepartement(departement);
        candidature.setEtudiant(etudiant);

        Departement departements = new Departement();
        departements.setId(2L);
        employeur.setDepartement(departements);

        Cv cv = new Cv();
        cv.setId(1L);
        cv.setUtilisateur(etudiant);
        cv.setCommentaireRefus("Refusé par Defaut");
        candidature.setCv(cv);

        OffreStage offreStage = new OffreStage();
        offreStage.setId(1L);
        offreStage.setNom("Stage en Développement");
        offreStage.setCompagnie("TechCorp");
        offreStage.setDepartement(departement);
        offreStage.setTauxHoraire(15.0);
        offreStage.setTypeEmploi("presentiel");
        offreStage.setAdresse("123 Rue Exemple");
        offreStage.setModaliteTravail("temps_plein");
        offreStage.setDateDebut(LocalDate.of(2023, 1, 1));
        offreStage.setDateFin(LocalDate.of(2023, 6, 30));
        offreStage.setNombreHeuresSemaine(40);
        offreStage.setNombrePostes(2);
        offreStage.setDateLimiteCandidature(LocalDate.of(2022, 12, 31));
        offreStage.setOwner(employeur);
        offreStage.setIsApproved(false);
        offreStage.setIsRefused(false);
        offreStage.setCommentaireRefus("Commentaire par défaut");
        candidature.setOffreStage(offreStage);

        when(offreStageRepository.getReferenceById(offreStage.getId())).thenReturn(offreStage);
        when(candidatureRepository.getCandidatureNumbers(etudiant.getId(), offreStage.getId())).thenReturn(0L);
        when(cvRepository.getReferenceById(1L)).thenReturn(cv);

        candidatureService.postuler(EtudiantDTO.toDTO(etudiant), offreStage.getId(), 1L);

        verify(offreStageRepository, times(1)).getReferenceById(offreStage.getId());
        verify(candidatureRepository, times(1)).getCandidatureNumbers(etudiant.getId(), offreStage.getId());
        verify(cvRepository, times(1)).getReferenceById(1L);
        verify(candidatureRepository, times(1)).save(any(Candidature.class));
    }

    @Test
    void testPostulerCandidatureDejaSoumise() {
        Credentials credentials = Credentials.builder().email("Mike@gmail.com").password("GG").role(Role.ETUDIANT).build();
        Utilisateur etudiant = new Utilisateur();
        etudiant.setFullName("John Doe");
        etudiant.setCredentials(credentials);

        Departement departement = new Departement();
        departement.setId(1L);
        etudiant.setDepartement(departement);

        Cv cv = new Cv();
        cv.setId(1L);
        cv.setUtilisateur(etudiant);

        OffreStage offreStage = new OffreStage();
        offreStage.setId(1L);
        offreStage.setNom("Stage en Développement");
        offreStage.setCompagnie("TechCorp");

        when(offreStageRepository.getReferenceById(offreStage.getId())).thenReturn(offreStage);
        when(candidatureRepository.getCandidatureNumbers(etudiant.getId(), offreStage.getId())).thenReturn(1L);
        when(cvRepository.getReferenceById(1L)).thenReturn(cv);

        assertThrows(IllegalArgumentException.class, () -> candidatureService.postuler(EtudiantDTO.toDTO(etudiant), offreStage.getId(), 1L));

        verify(offreStageRepository, times(1)).getReferenceById(offreStage.getId());
        verify(candidatureRepository, times(1)).getCandidatureNumbers(etudiant.getId(), offreStage.getId());
        verify(cvRepository, times(1)).getReferenceById(1L);
        verify(candidatureRepository, never()).save(any(Candidature.class));
    }

}