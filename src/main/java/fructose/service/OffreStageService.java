package fructose.service;

import fructose.model.OffreStage;
import fructose.repository.OffreStageRepository;
import fructose.service.dto.OffreStageDTO;
import org.springframework.stereotype.Service;

@Service
public class OffreStageService {
    private final OffreStageRepository offreStageRepository;


    public OffreStageService(OffreStageRepository offreStageRepository) {
        this.offreStageRepository = offreStageRepository;
    }

    public OffreStageDTO addOffreStage(OffreStageDTO offreStageDTO) {
        OffreStage offreStage = OffreStageDTO.toEntity(offreStageDTO);
        OffreStage savedOffreStage = offreStageRepository.save(offreStage);
        return OffreStageDTO.toDTO(savedOffreStage);
    }

    public void deleteOffreStage(Long id) {
        offreStageRepository.deleteById(id);
    }

    public OffreStageDTO getOffreStage(Long id) {
        OffreStage offreStage = offreStageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("OffreStage not found"));
        return OffreStageDTO.toDTO(offreStage);
    }
}