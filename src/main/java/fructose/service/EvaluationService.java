package fructose.service;

import fructose.model.evaluation.CritereEvaluation;
import fructose.model.evaluation.EvaluationEmployeur;
import fructose.model.evaluation.PDF.EvaluationEmployeurPdf;
import fructose.model.evaluation.SectionEvaluation;
import fructose.repository.CandidatureRepository;
import fructose.repository.EvaluationRepository;
import fructose.service.dto.EvaluationEmployeurDTO;
import fructose.service.dto.UtilisateurDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;
    @Autowired
    private CandidatureRepository candidatureRepository;

    @Transactional
    public EvaluationEmployeur creerEvaluation(EvaluationEmployeurDTO evaluationDTO) {
        EvaluationEmployeur evaluation = EvaluationEmployeurDTO.toEntity(evaluationDTO);
        for (SectionEvaluation section : evaluation.getSections()) {
            section.setEvaluation(evaluation);
            for (CritereEvaluation critere : section.getCriteres()) {
                critere.setSection(section);
            }
        }
        return evaluationRepository.save(evaluation);
    }

    public String generateEvaluationPdf(EvaluationEmployeur evaluation, UtilisateurDTO etudiant) {
        if (evaluation == null) {
            throw new IllegalArgumentException("L'évaluation ne peut pas être nulle");
        }
        try {
            System.out.println(evaluation.getCandidature());
            EvaluationEmployeurPdf evaluationPdf = new EvaluationEmployeurPdf(evaluation, etudiant);
            return evaluationPdf.createPdf();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération du PDF de l'évaluation", e);
        }
    }

    public EvaluationEmployeur recupererEvaluationParId(Long id) {
        Optional<EvaluationEmployeur> evaluation = evaluationRepository.findById(id);
        return evaluation.orElseThrow(() -> new RuntimeException("Évaluation non trouvée avec l'ID : " + id));
    }
}
