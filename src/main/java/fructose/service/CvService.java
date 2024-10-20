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
        try {
            Cv saveCv = new Cv();
            saveCv.setFilename(cv.getOriginalFilename());
            saveCv.setFileContent(cv.getBytes());
            saveCv.setIsRefused(false);
            saveCv.setIsApproved(false);
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

    public List<CvDTO> getCvsByUser(UtilisateurDTO utilisateurDTO){
        List<CvDTO> cvDTOList = new ArrayList<>();
        Utilisateur utilisateur = UtilisateurDTO.toEntity(utilisateurDTO);
        List<Cv> cvList = cvRepository.getAllByUserId(utilisateur.getId());

        for (Cv cv: cvList) {
            cvDTOList.add(CvDTO.toDTO(cv));
        }

        return cvDTOList;
    }
    public byte[] getCvFileContentById(Long id) {
        Cv cv = cvRepository.findById(id).orElse(null);
        if (cv != null) {
            return cv.getFileContent();
        }
        return null;
    }


}
