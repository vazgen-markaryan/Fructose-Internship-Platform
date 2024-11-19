package fructose.controller;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import fructose.service.CandidatureService;
import fructose.service.ContratService;
import fructose.service.UtilisateurService;
import fructose.service.dto.AdminDTO;
import fructose.service.dto.CandidatureDTO;
import fructose.service.dto.ContratDTO;
import fructose.service.dto.UtilisateurDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/contrats")
@RequiredArgsConstructor
public class ContratController {

    private final ContratService contratService;
    private final UtilisateurService utilisateurService;
    private final CandidatureService candidatureService;
    
    private void validateToken(String token) {
        if (!utilisateurService.validationToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }
    
    @GetMapping("/generate/{id}")
    public ResponseEntity<byte[]> generateContrat(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        validateToken(token); // Validates the token
        try {
            // Fetching user and candidature details
            UtilisateurDTO utilisateur = utilisateurService.getUtilisateurByToken(token);
            CandidatureDTO candidatureDTO = candidatureService.getCandidatureById(id);
            
            // Generate the contract and get the file path
            String pdfPath = contratService.generateContrat(candidatureDTO, utilisateur);
            
            // Load the PDF file
            File pdfFile = new File(pdfPath);
            if (!pdfFile.exists()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Generated PDF not found");
            }
            
            // Read the file into a byte array
            byte[] pdfBytes = Files.readAllBytes(pdfFile.toPath());
            
            // Build the response with appropriate headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.inline().filename("contract_stage.pdf").build());
            headers.setContentLength(pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error reading contract PDF", e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating contract", e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContratDTO> getContratById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        validateToken(token);
        ContratDTO contratDTO = contratService.getContratById(id);
        return ResponseEntity.ok(contratDTO);
    }

    //@GetMapping
    //public ResponseEntity<List<ContratDTO>> getContrats(@RequestHeader("Authorization") String token) {
    //    validateToken(token);
    //    List<ContratDTO> contrats = contratService.getContrats();
    //    return ResponseEntity.ok(contrats);
    //}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContrat(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        validateToken(token);
        contratService.deleteContrat(id);
        return ResponseEntity.noContent().build();
    }

    //@PatchMapping("/{id}/sign")
    //public ResponseEntity<ContratDTO> signContrat(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestParam String signature) {
    //    validateToken(token);
    //    ContratDTO signedContrat = contratService.signContrat(id, signature);
    //    return ResponseEntity.ok(signedContrat);
    //}

//    @GetMapping("/{id}/pdf")
//    public ResponseEntity<byte[]> getContratPDF(@RequestHeader("Authorization") String token, @PathVariable Long id) {
//        validateToken(token);
//        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//        Document pdfDocument = contratService.getContratPDFById(id);
//        pdfDocument.close();
//        byte[] pdfBytes = byteArrayOutputStream.toByteArray();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_PDF);
//        headers.setContentDispositionFormData("attachment", "contrat_" + id + ".pdf");
//
//        return ResponseEntity.ok()
//                .headers(headers)
//                .body(pdfBytes);
//    }
}