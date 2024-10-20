package fructose.service;

import fructose.model.Cv;
import fructose.model.Utilisateur;
import fructose.repository.CvRepository;
import fructose.service.dto.CvDTO;
import fructose.service.dto.UtilisateurDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CvService {
    private final CvRepository cvRepository;

    public CvService(CvRepository cvRepository) {
        this.cvRepository = cvRepository;
    }

    public void addCv(MultipartFile cv, UtilisateurDTO utilisateurDTO) throws IOException {
        Cv saveCv = new Cv();
        saveCv.setFilename(cv.getOriginalFilename());
        saveCv.setFileContent(cv.getBytes());
        saveCv.setIsRefused(false);
        saveCv.setIsApproved(false);
        saveCv.setUtilisateur(UtilisateurDTO.toEntity(utilisateurDTO));
        cvRepository.save(saveCv);
    }

    public List<CvDTO> getCvsByUser(UtilisateurDTO utilisateurDTO){
        List<CvDTO> cvDTOList = new ArrayList<>();
        Utilisateur utilisateur = UtilisateurDTO.toEntity(utilisateurDTO);
        List<Cv> cvList = cvRepository.getAllByUserId(utilisateur.getId());

        for (Cv cv: cvList) {
            cvDTOList.add(CvDTO.toDTO(cv));
        }

        return cvDTOList;
    }

}
