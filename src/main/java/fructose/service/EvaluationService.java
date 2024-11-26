package fructose.service;

import fructose.model.evaluation.CritereEvaluation;
import fructose.model.evaluation.EvaluationEmployeur;
import fructose.model.evaluation.SectionEvaluation;
import fructose.repository.EvaluationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;


    @Transactional
    public EvaluationEmployeur creerEvaluation(EvaluationEmployeur evaluation) {
        for (SectionEvaluation section : evaluation.getSections()) {
            section.setEvaluation(evaluation);
            for (CritereEvaluation critere : section.getCriteres()) {
                critere.setSection(section);
            }
        }
        return evaluationRepository.save(evaluation);
    }

    public EvaluationEmployeur recupererEvaluationParId(Long id) {
        Optional<EvaluationEmployeur> evaluation = evaluationRepository.findById(id);
        return evaluation.orElseThrow(() -> new RuntimeException("Évaluation non trouvée avec l'ID : " + id));
    }
}
