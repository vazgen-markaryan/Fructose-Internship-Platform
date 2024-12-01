package fructose.service;

import fructose.model.enumerator.ReponseEvaluation;
import fructose.model.enumerator.Role;
import fructose.model.evaluation.CritereEvaluation;
import fructose.model.evaluation.EvaluationEmployeur;
import fructose.model.evaluation.PDF.EvaluationEmployeurPdf;
import fructose.model.evaluation.SectionEvaluation;
import fructose.repository.EvaluationEmployeurRepository;
import fructose.service.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class EvaluationServiceTest {

    @Mock
    private EvaluationEmployeurRepository evaluationEmployeurRepository;


    @Mock
    private EvaluationEmployeurPdf evaluationEmployeurPdf;

    @InjectMocks
    private EvaluationService evaluationService;

    private EvaluationEmployeurDTO evaluationDTO;
    private EvaluationEmployeur evaluation;

    @BeforeEach
    void setUp() {
        UtilisateurDTO etudiant = new UtilisateurDTO();
        etudiant.setId(1L);
        etudiant.setFullName("Test User");
        etudiant.setEmail("test@example.com");
        etudiant.setPassword("password");
        etudiant.setMatricule("12345");
        etudiant.setRole(Role.ETUDIANT);
        etudiant.setCompanyName("Test Company");
        etudiant.setIsApproved(true);

        DepartementDTO departementDTO = new DepartementDTO(1L, "Test Department");
        etudiant.setDepartementDTO(departementDTO);

        OffreStageDTO offreStageDTO = new OffreStageDTO();
        offreStageDTO.setId(1L);
        offreStageDTO.setNom("Test Offer");
        offreStageDTO.setDescription("Test Offer Description");
        offreStageDTO.setTauxHoraire(1000.0);
        offreStageDTO.setOwnerDTO(etudiant);
        offreStageDTO.setAdresse("Test Address");
        offreStageDTO.setDateFin(LocalDate.now());
        offreStageDTO.setDateDebut(LocalDate.now());
        offreStageDTO.setTypeEmploi("presentiel");
        offreStageDTO.setModaliteTravail("temps_plein");
        offreStageDTO.setDepartementDTO(departementDTO);

        CandidatureDTO candidatureDTO = new CandidatureDTO();
        candidatureDTO.setId(1L);
        candidatureDTO.setEtudiantDTO(etudiant);
        candidatureDTO.setOffreStageDTO(offreStageDTO);

        evaluationDTO = new EvaluationEmployeurDTO();
        evaluationDTO.setCandidatureDTO(candidatureDTO);
        evaluationDTO.setCommentaireAppreciationGlobale("Test Comment");
        evaluationDTO.setAcceuilleEleveProchainStage("oui");

        SectionEvaluationDTO sectionDTO = new SectionEvaluationDTO();
        sectionDTO.setName("Test Section");
        sectionDTO.setCommentaire("Test Commentaire");
        CritereEvaluationDTO critereDTO = new CritereEvaluationDTO();
        critereDTO.setQuestion("Test Question");
        critereDTO.setReponse(String.valueOf(ReponseEvaluation.MOSTLY_AGREE));
        sectionDTO.setCriteres(List.of(critereDTO));
        evaluationDTO.setSections(List.of(sectionDTO));

        evaluation = new EvaluationEmployeur();
        evaluation.setCandidature(CandidatureDTO.toEntity(candidatureDTO));
        evaluation.getCandidature().setEtudiant(UtilisateurDTO.toEntity(etudiant));
        evaluation.setCommentaireAppreciationGlobale("Test Comment");
        evaluation.setAcceuilleEleveProchainStage("oui");
        SectionEvaluation section = new SectionEvaluation();
        section.setName("Test Section");
        section.setCommentaire("Test Commentaire");
        CritereEvaluation critere = new CritereEvaluation();
        critere.setQuestion("Test Question");
        critere.setReponse(ReponseEvaluation.MOSTLY_AGREE);
        critere.setSection(section);
        section.setCriteres(List.of(critere));
        evaluation.setSections(List.of(section));
    }

    @Test
    void testCreerEvaluation_Employeur_Success() {
        String result = evaluationService.creerEvaluationEmployeur(EvaluationEmployeurDTO.toDTO(evaluation));
        assertEquals("evaluation_stagiaire_.pdf", result);
        verify(evaluationEmployeurRepository, times(1)).save(any(EvaluationEmployeur.class));
    }

    @Test
    void testFindAllEvaluationEmployeur() {
        when(evaluationEmployeurRepository.findAll()).thenReturn(List.of(evaluation));

        List<EvaluationEmployeurDTO> evaluations = evaluationService.findAllEvaluationEmployeur();

        assertNotNull(evaluations);
        assertEquals(1, evaluations.size());
    }

    @Test
    void testRecupererEvaluationEmployeurParId() {
        lenient().when(evaluationEmployeurRepository.findById(evaluationDTO.getId())).thenReturn(Optional.ofNullable(evaluation));

        String result = evaluationService.recupererEvaluationEmployeurParId(evaluationDTO.getId());

        assertEquals("evaluation_stagiaire_.pdf", result);
    }
}
