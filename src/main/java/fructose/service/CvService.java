package fructose.service;

import fructose.model.Cv;
import fructose.repository.CvRepository;
import fructose.service.dto.UtilisateurDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class CvService {
    private final CvRepository cvRepository;

    public CvService(CvRepository cvRepository) {
        this.cvRepository = cvRepository;
    }

    public void addCv(MultipartFile cv, UtilisateurDTO utilisateurDTO) throws IOException {
        try {
            Cv saveCv = new Cv();
            saveCv.setFilename(cv.getOriginalFilename());
            saveCv.setFileContent(cv.getBytes());
            saveCv.setUtilisateur(UtilisateurDTO.toEntity(utilisateurDTO));
            cvRepository.save(saveCv);
        }catch (Exception e) {
            throw new RuntimeException("Une erreur inattendue est survenue lors de l'enregistrement du fichier PDF.", e);
        }
    }

    public List<Cv> getAllCvs() {
        List<Cv> list;
        try {
            list = cvRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Une erreur est survenue lors de la récupération des CVs.", e);
        }

        return list;
    }

}
