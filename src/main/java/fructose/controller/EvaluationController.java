package fructose.controller;

import fructose.service.EvaluationService;
import fructose.service.dto.EvaluationEmployeurDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/evaluations")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @PostMapping("/creer")
    public ResponseEntity<byte[]> creerEvaluation(@RequestBody EvaluationEmployeurDTO evaluationDTO){
        try {
            String pdfPath = evaluationService.creerEvaluation(evaluationDTO);
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
    @PostMapping("/evaluation-eleve")
    public ResponseEntity<byte[]> recupererEvaluationEleve(@RequestBody EvaluationEmployeurDTO evaluationDTO){
        try {
            String pdfPath = evaluationService.recupererEvaluationParId(evaluationDTO);
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

    @GetMapping("/all-evaluation")
    public ResponseEntity<?> findAllEvaluation(){
        try {
            List<EvaluationEmployeurDTO> evaluationEmployeurDTOS = evaluationService.findAllEvaluation();
            return new ResponseEntity<>(evaluationEmployeurDTOS, HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating evaluation PDF", e);
        }
    }


}