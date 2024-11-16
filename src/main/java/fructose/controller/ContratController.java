package fructose.controller;

import fructose.service.ContratService;
import fructose.service.dto.ContratDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/contrats")
@RequiredArgsConstructor
public class ContratController {

    private final ContratService contratService;

    @PostMapping
    public ResponseEntity<ContratDTO> createContrat(@Valid @RequestBody ContratDTO contratDTO) {
        ContratDTO createdContrat = contratService.createContrat(contratDTO);
        URI location = URI.create("/api/contrats/" + createdContrat.getId());
        return ResponseEntity.created(location).body(createdContrat);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContratDTO> getContratById(@PathVariable Long id) {
        ContratDTO contratDTO = contratService.getContratById(id);
        return ResponseEntity.ok(contratDTO);
    }

    @GetMapping
    public ResponseEntity<List<ContratDTO>> getContrats() {
        List<ContratDTO> contrats = contratService.getContrats();
        return ResponseEntity.ok(contrats);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContrat(@PathVariable Long id) {
        contratService.deleteContrat(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/sign")
    public ResponseEntity<ContratDTO> signContrat(@PathVariable Long id, @RequestParam String signature) {
        ContratDTO signedContrat = contratService.signContrat(id, signature);
        return ResponseEntity.ok(signedContrat);
    }
}
