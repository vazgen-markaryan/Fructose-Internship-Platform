package fructose.controller;

import fructose.model.evaluation.EvaluationEmployeur;
import fructose.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/evaluations")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @PostMapping("/creer")
    public ResponseEntity<EvaluationEmployeur> creerEvaluation(@RequestBody EvaluationEmployeur evaluation) {
        EvaluationEmployeur nouvelleEvaluation = evaluationService.creerEvaluation(evaluation);
        return ResponseEntity.ok(nouvelleEvaluation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluationEmployeur> recupererEvaluation(@PathVariable Long id) {
        EvaluationEmployeur evaluation = evaluationService.recupererEvaluationParId(id);
        return ResponseEntity.ok(evaluation);
    }
}
