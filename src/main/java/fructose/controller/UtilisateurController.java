package fructose.controller;

import fructose.service.UtilisateurService;
import fructose.service.dto.UtilisateurDTO;
import fructose.service.dto.auth.LoginDTO;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.context.support.DefaultMessageSourceResolvable;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class UtilisateurController {

    private static final Logger logger = LoggerFactory.getLogger(UtilisateurController.class);
    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @PostMapping("/creer-utilisateur")
    public ResponseEntity<?> creerUtilisateur(@RequestBody @Valid UtilisateurDTO utilisateurDTO, BindingResult result) {
        if (result.hasErrors()) {
            String errorMessages = result.getFieldErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining(", "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur de validation : " + errorMessages);
        }
        try {
            if (!utilisateurService.isValidRole(utilisateurDTO.getRole().toString())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rôle invalide.");
            }
            utilisateurService.addUtilisateur(utilisateurDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Utilisateur créé avec succès !");
        } catch (DataAccessException e) {
            String errorMessage = "Erreur lors de la création de l'utilisateur.";
            if (e.getCause() instanceof org.hibernate.exception.ConstraintViolationException violation) {
                String detailMessage = violation.getSQLException().getMessage();
                String uniqueValue = detailMessage.substring(detailMessage.indexOf('(') + 1, detailMessage.indexOf(')'));
                errorMessage = "Violation de contrainte unique : La valeur \"" + uniqueValue + "\" existe déjà.";
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        } catch (RuntimeException e) {
            logger.error("Une erreur inattendue s'est produite:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur inattendue s'est produite.");
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean emailTaken = utilisateurService.isEmailTaken(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("emailTaken", emailTaken);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-matricule")
    public ResponseEntity<Map<String, Boolean>> checkMatricule(@RequestParam String matricule) {
        boolean matriculeTaken = utilisateurService.isMatriculeTaken(matricule);
        Map<String, Boolean> response = new HashMap<>();
        response.put("matriculeTaken", matriculeTaken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/connexion")
    public ResponseEntity<?> connexion(@RequestBody @Valid LoginDTO loginDTO, BindingResult result) {
        if (result.hasErrors()) {
            String errorMessages = result.getFieldErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining(", "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur de validation : " + errorMessages);
        }
        try {
            String token = utilisateurService.authenticateUser(loginDTO.getEmail(), loginDTO.getPassword());
            return ResponseEntity.status(HttpStatus.OK).body("Token : " + token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Une erreur inattendue s'est produite : " + e.getMessage());
        }
    }

    @PostMapping("/valider-token")
    public ResponseEntity<?> validerToken(@RequestHeader("Authorization") String token) {
        try {
            String tokenFiltrer = token.startsWith("Bearer ") ? token.substring(7) : token;
            boolean estValide = utilisateurService.validationToken(tokenFiltrer);
            return ResponseEntity.status(HttpStatus.OK).body("Token valide : " + estValide);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token invalide.");
        }
    }

    @PostMapping("/infos-utilisateur")
    public ResponseEntity<?> getInfosUtilisateur(@RequestHeader("Authorization") String token) {
        try {
            UtilisateurDTO utilisateurDTO = utilisateurService.getUtilisateurByToken(token);
            return ResponseEntity.status(HttpStatus.OK).body(utilisateurDTO);
        } catch (Exception e) {
            logger.error("Impossible de récupérer les infos utilisateur:", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Impossible de récupérer les infos utilisateur: " + e.getMessage());
        }
    }
}