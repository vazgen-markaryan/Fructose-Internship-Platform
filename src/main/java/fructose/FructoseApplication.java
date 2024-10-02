package fructose;

import fructose.model.Employeur;
import fructose.model.Etudiant;
import fructose.model.Professeur;
import fructose.model.Utilisateur;
import fructose.service.UtilisateurService;
import fructose.service.dto.EmployeurDTO;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.ProfesseurDTO;
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
//		team24 est SUPERUSER

//		package.json a été modifié. Le proxy sur la ligne 5 est ajouté pour le future redirect
	}
	
	@Override
	public void run(String... args) {
		Utilisateur vazgen = Utilisateur.createUtilisateur("Etudiant", "Vazgen Markaryan", "vazgen@gmail.com", "Vazgen123!", "1111111", "Etudiant", "techniques_informatique", null);
		EtudiantDTO etudiantVazgen = EtudiantDTO.toDTO((Etudiant) vazgen);
		
		Utilisateur francois = Utilisateur.createUtilisateur("Professeur", "François Lacoursière", "francois@gmail.com", "Francois123!", "2222222", "Professeur", "techniques_informatique", null);
		ProfesseurDTO professeurFrancois = ProfesseurDTO.toDTO((Professeur) francois);
		
		Utilisateur ubisoft = Utilisateur.createUtilisateur("Employeur", "Yves Guillemot", "ubisoft@gmail.com", "Ubisoft123!", null, "Employeur", "techniques_informatique", "Ubisoft Incorporé");
		EmployeurDTO employeurUbisoft = EmployeurDTO.toDTO((Employeur) ubisoft);
		
		try {
			checkAndAddUtilisateur(etudiantVazgen, "Etudiant");
			checkAndAddUtilisateur(professeurFrancois, "Professeur");
			checkAndAddUtilisateur(employeurUbisoft, "Employeur");
			
			// Test login
			// UtilisateurDTO loggedInUser = utilisateurService.login("1111111", "Vazgen123!");
			// System.out.println("Login successful for user: " + loggedInUser.getFullName());
			
		} catch (Exception e) {
			System.out.println("Une erreur s'est produite : " + e.getMessage());
			e.printStackTrace();
		}
	}
	
	private void checkAndAddUtilisateur(UtilisateurDTO utilisateurDTO, String userType) {
		System.out.println(); //Ajouté juste pour la lisibilité
		List<UtilisateurDTO> utilisateurList = utilisateurService.getUtilisateurs(userType);
		boolean exists = utilisateurList
				.stream()
				.anyMatch(utilisateur -> utilisateur.getEmail().equals(utilisateurDTO.getEmail()));
		
		if (exists) {
			System.out.println(userType + " avec email " + utilisateurDTO.getEmail() + " existe déjà dans la base de données");
		} else {
			utilisateurService.addUtilisateur(utilisateurDTO, userType);
			System.out.println(userType + " avec email " + utilisateurDTO.getEmail() + " a été ajouté avec succès");
		}
	}
}