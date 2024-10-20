package fructose.controller;

import fructose.model.Cv;
import fructose.service.CvService;
import fructose.service.UtilisateurService;
import fructose.service.dto.CvDTO;
import fructose.service.dto.UtilisateurDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class CvController {
    private final CvService cvService;

    private final UtilisateurService utilisateurService;

    public CvController(CvService cvService, UtilisateurService utilisateurDTO) {
        this.cvService = cvService;
        this.utilisateurService = utilisateurDTO;
    }

    @PostMapping("/deposer-cv")
    public ResponseEntity<?> enregistrerCV(@RequestHeader("Authorization") String token, @RequestBody MultipartFile file) {
        // Vérifier si le fichier est vide
        if (file.isEmpty()) {
            return new ResponseEntity<>("Le fichier est vide. Veuillez télécharger un fichier PDF valide.", HttpStatus.BAD_REQUEST);
        }

        // Vérifier si le type de fichier est bien un PDF
        if (!"application/pdf".equals(file.getContentType())) {
            return new ResponseEntity<>("Le fichier n'est pas au format PDF. Veuillez télécharger un fichier PDF.", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }

        if (!utilisateurService.validationToken(token)) {
            System.out.println("Token reçu : " + token);
            return new ResponseEntity<>("Le Token est invalid", HttpStatus.BAD_REQUEST);
        }

        UtilisateurDTO utilisateurDTO = utilisateurService.getUtilisateurByToken(token);

        try {
            cvService.addCv(file, utilisateurDTO);
            return new ResponseEntity<>("Fichier PDF enregistré avec succès.", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Erreur lors de la lecture du fichier.", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Une erreur inattendue s'est produite.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/cvs")
    public ResponseEntity<?> getCVs(@RequestHeader("Authorization") String token) {
        if (!utilisateurService.validationToken(token)) {
            System.out.println("Token reçu : " + token);
            return new ResponseEntity<>("Le Token est invalid", HttpStatus.BAD_REQUEST);
        }

        UtilisateurDTO utilisateurDTO = utilisateurService.getUtilisateurByToken(token);

        //try {
            List<CvDTO> cvList = cvService.getCvsByUser(utilisateurDTO);
            return new ResponseEntity<>(cvList, HttpStatus.OK);
        //} catch (Exception e) {
        //    System.out.println(e.getMessage());
        //    return new ResponseEntity<>("Une erreur inattendue s'est produite.", HttpStatus.INTERNAL_SERVER_ERROR);
        //}
    }

    @GetMapping("/cvFile/{id}")
    public ResponseEntity<?> getCVFile(@RequestHeader("Authorization") String token, @PathVariable String id) {
        // TODO: Get le fichier PDF SEULEMENT

        /*
        if (!utilisateurService.validationToken(token)) {
            System.out.println("Token reçu : " + token);
            return new ResponseEntity<>("Le Token est invalid", HttpStatus.BAD_REQUEST);
        }

        UtilisateurDTO utilisateurDTO = utilisateurService.getUtilisateurByToken(token);

        try {
            List<Cv> cvList = cvService.getCvsByUser(utilisateurDTO);
            return new ResponseEntity<>(cvList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Une erreur inattendue s'est produite.", HttpStatus.INTERNAL_SERVER_ERROR);
        }*/
        return null;
    }
}