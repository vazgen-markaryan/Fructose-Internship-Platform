package fructose.controller;

import com.itextpdf.layout.Document;
import fructose.service.ContratService;
import fructose.service.UtilisateurService;
import fructose.service.dto.CandidatureDTO;
import fructose.service.dto.ContratDTO;
import fructose.service.dto.UtilisateurDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/contrats")
@RequiredArgsConstructor
public class ContratController {

    private final ContratService contratService;
    private final UtilisateurService utilisateurService;

    private void validateToken(String token) {
        if (!utilisateurService.validationToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateContrat(@RequestHeader("Authorization") String token, @Valid @RequestBody CandidatureDTO candidatureDTO) {
        System.out.println(candidatureDTO);
        validateToken(token);
        try {
            Document pdfDocument = contratService.generateContrat(candidatureDTO);
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            pdfDocument.close();
            byte[] pdfBytes = byteArrayOutputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "contrat_" + candidatureDTO.getId() + ".pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating contract PDF", e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContratDTO> getContratById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        validateToken(token);
        ContratDTO contratDTO = contratService.getContratById(id);
        return ResponseEntity.ok(contratDTO);
    }

    @GetMapping
    public ResponseEntity<List<ContratDTO>> getContrats(@RequestHeader("Authorization") String token) {
        validateToken(token);
        List<ContratDTO> contrats = contratService.getContrats();
        return ResponseEntity.ok(contrats);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContrat(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        validateToken(token);
        contratService.deleteContrat(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/sign")
    public ResponseEntity<ContratDTO> signContrat(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestParam String signature) {
        validateToken(token);
        ContratDTO signedContrat = contratService.signContrat(id, signature);
        return ResponseEntity.ok(signedContrat);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getContratPDF(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        validateToken(token);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document pdfDocument = contratService.getContratPDFById(id);
        pdfDocument.close();
        byte[] pdfBytes = byteArrayOutputStream.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "contrat_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}