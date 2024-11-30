package fructose.service;

import fructose.model.evaluation.CritereEvaluation;
import fructose.model.evaluation.EvaluationEmployeur;
import fructose.model.evaluation.PDF.EvaluationEmployeurPdf;
import fructose.model.evaluation.SectionEvaluation;
import fructose.repository.CandidatureRepository;
import fructose.repository.EvaluationRepository;
import fructose.service.dto.EvaluationEmployeurDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Transactional
    public String creerEvaluation(EvaluationEmployeurDTO evaluationDTO) {
        EvaluationEmployeur evaluation = InitializeData(evaluationDTO);
        evaluationRepository.save(evaluation);
        return generateEvaluationPdf(evaluation);
    }

    public String generateEvaluationPdf(EvaluationEmployeur evaluation) {
        if (evaluation == null) {
            throw new IllegalArgumentException("L'évaluation ne peut pas être nulle");
        }
        try {
            System.out.println(evaluation.getCandidature());
            EvaluationEmployeurPdf evaluationPdf = new EvaluationEmployeurPdf(evaluation);
            return evaluationPdf.createPdf();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la génération du PDF de l'évaluation", e);
        }
    }

    public String recupererEvaluationParId(EvaluationEmployeurDTO evaluationDTO) {
        EvaluationEmployeur evaluation = InitializeData(evaluationDTO);
        return generateEvaluationPdf(evaluation);
    }

    public static EvaluationEmployeur InitializeData(EvaluationEmployeurDTO evaluationDTO) {
        EvaluationEmployeur evaluation = EvaluationEmployeurDTO.toEntity(evaluationDTO);
        for (SectionEvaluation section : evaluation.getSections()) {
            section.setEvaluation(evaluation);
            for (CritereEvaluation critere : section.getCriteres()) {
                critere.setSection(section);
            }
        }
        return evaluation;
    }

    public List<EvaluationEmployeurDTO> findAllEvaluation() {
        List<EvaluationEmployeurDTO> evaluationEmployeurDTOS = new ArrayList<>();
        List<EvaluationEmployeur> evaluationEmployeurList = evaluationRepository.findAll();
        for(EvaluationEmployeur evaluationEmployeur : evaluationEmployeurList){
            evaluationEmployeurDTOS.add(EvaluationEmployeurDTO.toDTO(evaluationEmployeur));
        }
        return evaluationEmployeurDTOS;
    }
}
