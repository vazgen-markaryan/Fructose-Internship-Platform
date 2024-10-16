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
    public ResponseEntity<?> enregistrerCV(@RequestBody MultipartFile file) {
        // Vérifier si le fichier est vide
        if (file.isEmpty()) {
            return new ResponseEntity<>("Le fichier est vide. Veuillez télécharger un fichier PDF valide.", HttpStatus.BAD_REQUEST);
        }

        // Vérifier si le type de fichier est bien un PDF
        if (!"application/pdf".equals(file.getContentType())) {
            return new ResponseEntity<>("Le fichier n'est pas au format PDF. Veuillez télécharger un fichier PDF.", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }

        try {
            cvService.addCv(file);
            return new ResponseEntity<>("Fichier PDF enregistré avec succès.", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Erreur lors de la lecture du fichier.", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Gestion d'autres exceptions possibles
            return new ResponseEntity<>("Une erreur inattendue s'est produite.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
