package fructose.controller;

import fructose.model.Cv;
import fructose.service.CvService;
import fructose.service.UtilisateurService;
import fructose.service.dto.CvDTO;
import fructose.service.dto.UtilisateurDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class CvController {
    private final CvService cvService;
    private final UtilisateurService utilisateurService;

    public CvController(CvService cvService, UtilisateurService utilisateurService) {
        this.cvService = cvService;
        this.utilisateurService = utilisateurService;
    }

    @PostMapping("/deposer-cv")
    public ResponseEntity<String> enregistrerCV(@RequestHeader("Authorization") String token, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("Le fichier est vide. Veuillez télécharger un fichier PDF valide.", HttpStatus.BAD_REQUEST);
        }

        if (!"application/pdf".equals(file.getContentType())) {
            return new ResponseEntity<>("Le fichier n'est pas au format PDF. Veuillez télécharger un fichier PDF.", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }

        if (!utilisateurService.validationToken(token)) {
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

    @GetMapping(value = "/cvs/{id}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getCVFile(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!utilisateurService.validationToken(token)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            byte[] fileContent = cvService.getCvFileContentById(id);
            if (fileContent == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(fileContent, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/cv-history")
    public ResponseEntity<List<Cv>> getAllCvs(@RequestHeader("Authorization") String token) {
        try {
            if (!utilisateurService.validationToken(token)) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            List<Cv> cvs = cvService.getAllCvs();
            System.out.println(cvs);
            return new ResponseEntity<>(cvs, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/cvs/{id}")
    public ResponseEntity<String> deleteCv(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!utilisateurService.validationToken(token)) {
            return new ResponseEntity<>("Le Token est invalide", HttpStatus.UNAUTHORIZED);
        }

        try {
            UtilisateurDTO utilisateurDTO = utilisateurService.getUtilisateurByToken(token);
            boolean isDeleted = cvService.deleteCvById(id, utilisateurDTO);
            if (isDeleted) {
                return new ResponseEntity<>("Le CV a été supprimé avec succès.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Le CV n'a pas été trouvé ou l'utilisateur n'est pas autorisé à le supprimer.", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Une erreur inattendue s'est produite lors de la suppression du CV.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

