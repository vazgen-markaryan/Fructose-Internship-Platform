package fructose.service;

import fructose.model.Cv;
import fructose.repository.CvRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class CvService {
    private final CvRepository cvRepository;

    public CvService(CvRepository cvRepository) {
        this.cvRepository = cvRepository;
    }

    public void addCv(MultipartFile cv) throws IOException {
        if (cv == null || cv.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide ou invalide.");
        }

        if (!"application/pdf".equals(cv.getContentType())) {
            throw new IllegalArgumentException("Le fichier n'est pas au format PDF.");
        }

        try {
            Cv saveCv = new Cv();
            saveCv.setFileContent(cv.getBytes());
            cvRepository.save(saveCv);
        } catch (IOException e) {
            throw new IOException("Erreur lors de la lecture du contenu du fichier PDF.", e);
        } catch (Exception e) {
            throw new RuntimeException("Une erreur inattendue est survenue lors de l'enregistrement du fichier PDF.", e);
        }
    }
}
