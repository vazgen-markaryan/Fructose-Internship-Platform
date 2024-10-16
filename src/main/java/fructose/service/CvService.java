package fructose.service;

import fructose.model.Cv;
import fructose.repository.CvRepository;
import fructose.service.dto.UtilisateurDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
        saveCv.setUtilisateur(UtilisateurDTO.toEntity(utilisateurDTO));
        cvRepository.save(saveCv);
    }

}
