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
        // Validation des données soumises
        if (result.hasErrors()) {
            // Extraction des messages d'erreur
            String errorMessages = result.getFieldErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining(", "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur de validation : " + errorMessages);
        }

        try {
            // Vérification du rôle, pour éviter toute injection ou modification indésirable
            if (!utilisateurService.isValidRole(utilisateurDTO.getRole())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Rôle invalide.");
            }
            // Ajout sécurisé de l'utilisateur via le service
            utilisateurService.addUtilisateur(utilisateurDTO, utilisateurDTO.getRole());
            // Réponse en cas de succès
            return ResponseEntity.status(HttpStatus.CREATED).body("Utilisateur créé avec succès !");
        } catch (DataAccessException e) {
            String errorMessage = "Erreur lors de la création de l'utilisateur.";
            if (e.getCause() instanceof org.hibernate.exception.ConstraintViolationException constraintViolationException) {
                String detailMessage = constraintViolationException.getSQLException().getMessage();
                String uniqueValue = detailMessage.substring(detailMessage.indexOf('(') + 1, detailMessage.indexOf(')'));
                errorMessage = "Violation de contrainte unique : La valeur \"" + uniqueValue + "\" existe déjà.";
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur inattendue s'est produite.");
        }
    }
}