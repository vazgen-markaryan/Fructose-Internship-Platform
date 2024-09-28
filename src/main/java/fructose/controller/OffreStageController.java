package fructose.controller;

import fructose.service.dto.OffreStageDTO;
import fructose.service.OffreStageService;
import jakarta.validation.Valid;
import org.hibernate.exception.ConstraintViolationException;
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
public class OffreStageController {
    private final OffreStageService offreStageService;

    public OffreStageController(OffreStageService offreStageService) {
        this.offreStageService = offreStageService;
    }

    @PostMapping("/creer-offre-stage")
    public ResponseEntity<?> creerOffreStage(@RequestBody @Valid OffreStageDTO offreStageDTO, BindingResult result) {
        if (result.hasErrors()) {
            String errorMessages = result.getFieldErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
                    .collect(Collectors.joining(", "));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur de validation : " + errorMessages);
        }
        try {
            offreStageService.addOffreStage(offreStageDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Offre de stage créée avec succès !");
        } catch (DataAccessException e) {
            if (e.getCause() instanceof ConstraintViolationException violation) {
                String detailMessage = violation.getSQLException().getMessage();
                String uniqueValue = detailMessage.substring(detailMessage.indexOf('(') + 1, detailMessage.indexOf(')'));
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Violation de contrainte unique : La valeur \"" + uniqueValue + "\" existe déjà.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la création de l'offre de stage.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur inattendue s'est produite.");
        }
    }
}
