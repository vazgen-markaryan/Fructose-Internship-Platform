package fructose.service.dto;

import fructose.model.Cv;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CvDTO {
	private Long id;
	private String filename;
	private Boolean isApproved;
	private Boolean isRefused;
	private Long utilisateurId;
	
	public static CvDTO toDTO(Cv cv) {
		CvDTO cvDTO = new CvDTO();
		cvDTO.setId(cv.getId());
		cvDTO.setFilename(cv.getFilename());
		cvDTO.setIsApproved(cv.getIsApproved());
		cvDTO.setIsRefused(cv.getIsRefused());
		cvDTO.setUtilisateurId(cv.getUtilisateur().getId());
		return cvDTO;
	}
}
