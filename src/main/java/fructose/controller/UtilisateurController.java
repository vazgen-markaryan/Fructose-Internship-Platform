package fructose.controller;

import fructose.service.UtilisateurService;
import fructose.service.dto.UtilisateurDTO;
import jakarta.validation.Valid;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.context.support.DefaultMessageSourceResolvable;

import java.util.stream.Collectors;

@RestController
public class UtilisateurController {
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
            if (!utilisateurService.isValidRole(utilisateurDTO.getRole())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rôle invalide.");
            }
            utilisateurService.addUtilisateur(utilisateurDTO, utilisateurDTO.getRole());
            return ResponseEntity.status(HttpStatus.CREATED).body("Utilisateur créé avec succès !");
        } catch (DataAccessException e) {
            String errorMessage = "Erreur lors de la création de l'utilisateur.";
            if (e.getCause() instanceof org.hibernate.exception.ConstraintViolationException violation) {
                String detailMessage = violation.getSQLException().getMessage();
                String uniqueValue = detailMessage.substring(detailMessage.indexOf('(') + 1, detailMessage.indexOf(')'));
                errorMessage = "Violation de contrainte unique : La valeur \"" + uniqueValue + "\" existe déjà.";
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @PostMapping("/connexion")
    public ResponseEntity<?> connexion(@RequestBody @Valid UtilisateurDTO utilisateurDTO, BindingResult result) {
        if (result.hasErrors()) {
            String errorMessages = result.getFieldErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining(", "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur de validation : " + errorMessages);
        }

        try {
            UtilisateurDTO loggedInUser = utilisateurService.login(utilisateurDTO.getEmail(), utilisateurDTO.getPassword());
            return ResponseEntity.status(HttpStatus.OK).body(loggedInUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur s'est produite : " + e.getMessage());
        }
    }
}