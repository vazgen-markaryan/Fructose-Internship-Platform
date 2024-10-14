package fructose.controller;

import fructose.service.CvService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class CvController {
    private final CvService cvService;

    public CvController(CvService cvService) {
        this.cvService = cvService;
    }

    @GetMapping("/deposer-cv")
    public ResponseEntity<?> enregistrerCV(@RequestBody MultipartFile file){
        try{
            cvService.addCv(file);
            return new ResponseEntity<>("Fichier PDF enregistré avec succès.", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Erreur lors de la lecture du fichier.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
