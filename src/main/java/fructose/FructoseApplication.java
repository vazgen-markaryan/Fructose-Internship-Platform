package fructose;

import fructose.model.Utilisateur;
import fructose.service.UtilisateurService;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.UtilisateurDTO;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

@SpringBootApplication
public class FructoseApplication implements CommandLineRunner {

	private final UtilisateurService utilisateurService;

	public FructoseApplication(UtilisateurService utilisateurService) {
		this.utilisateurService = utilisateurService;
	}

	public static void main(String[] args) {
		SpringApplication.run(FructoseApplication.class, args);
		
//		TO RUN THE APPLICATION:
//		1. Run this file
//		2. Go to CMD, Change Directory into front-end/fructose and run "npm start"
//		3. Go to browser and type "localhost:3000"


//		Connexion à la BD avec console
//		psql -U team24 -d fructose
//		user team24
//		password team24
//		team 24 est SUPERUSER

//		package.json a été modifié. Le proxy sur la ligne 5 est ajouté pour le future redirect
	}

	@Override
	public void run(String... args) {
		Utilisateur vazgen = Utilisateur.createUtilisateur("Etudiant", "Vazgen Markaryan", "vazgen@gmail.com", "Vazgen123!", "(123) 456-7890", "1234 rue Pomme", "11111111", "Etudiant");
		EtudiantDTO etudiantVazgen = vazgen.toEtudiantDTO();

		try {
			List<UtilisateurDTO> utilisateurDTOList = utilisateurService.getUtilisateurs("Etudiant");
			boolean exists = utilisateurDTOList.stream()
					.anyMatch(utilisateur -> utilisateur.getFullName().equals(etudiantVazgen.getFullName()));

			if (exists) {
				System.out.println("L'étudiant " + etudiantVazgen.getFullName() + " existe déjà dans la base de données");
			} else {
				utilisateurService.addUtilisateur(etudiantVazgen, "Etudiant");
			}
		} catch (Exception e) {
			System.out.println("Une erreur s'est produite : " + e.getMessage());
		}
	}
}
