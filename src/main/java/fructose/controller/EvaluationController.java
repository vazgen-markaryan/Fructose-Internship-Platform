package fructose.controller;

import fructose.model.evaluation.EvaluationEmployeur;
import fructose.service.EvaluationService;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.EvaluationEmployeurDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@RestController
@RequestMapping("/evaluations")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @PostMapping("/creer")
    public ResponseEntity<byte[]> creerEvaluation(@RequestBody EvaluationEmployeurDTO evaluationDTO){
        try {
            EvaluationEmployeur savedEvaluation = evaluationService.creerEvaluation(evaluationDTO);
            String pdfPath = evaluationService.generateEvaluationPdf(savedEvaluation, evaluationDTO.getCandidatureDTO().getEtudiantDTO());
            File pdfFile = new File(pdfPath);
            if (!pdfFile.exists()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Generated PDF not found");
            }
            byte[] pdfBytes = Files.readAllBytes(pdfFile.toPath());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline().filename("evaluation_stagiaire.pdf").build());
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating evaluation PDF", e);
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<EvaluationEmployeur> recupererEvaluation(@PathVariable Long id) {
        EvaluationEmployeur evaluation = evaluationService.recupererEvaluationParId(id);
        return ResponseEntity.ok(evaluation);
    }
}