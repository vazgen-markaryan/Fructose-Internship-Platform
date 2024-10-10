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
        Cv saveCv = new Cv();
        saveCv.setFileContent(cv.getBytes());
        cvRepository.save(saveCv);
    }

}
