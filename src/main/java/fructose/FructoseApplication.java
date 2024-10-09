package fructose;

import fructose.model.*;
import fructose.service.OffreStageService;
import fructose.model.Employeur;
import fructose.model.Etudiant;
import fructose.model.Professeur;
import fructose.model.Utilisateur;
import fructose.model.auth.Role;
import fructose.service.UtilisateurService;
import fructose.service.dto.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class FructoseApplication implements CommandLineRunner {

	private final UtilisateurService utilisateurService;
	private final OffreStageService offreStageService;

	public FructoseApplication(UtilisateurService utilisateurService, OffreStageService offreStageService) {
		this.utilisateurService = utilisateurService;
		this.offreStageService = offreStageService;
	}
	
	public static void main(String[] args) {
		SpringApplication.run(FructoseApplication.class, args);
	}

	@Override
	public void run(String... args) {
		Utilisateur vazgen = Utilisateur.createUtilisateur("Etudiant", "Vazgen Markaryan", "vazgen@gmail.com", "Vazgen123!", "1111111", "Informatique", null);
		EtudiantDTO etudiantVazgen = EtudiantDTO.toDTO((Etudiant) vazgen);

		Utilisateur francois = Utilisateur.createUtilisateur("Professeur", "François Lacoursière", "francois@gmail.com", "Francois123!", "2222222", "Informatique", null);
		ProfesseurDTO professeurFrancois = ProfesseurDTO.toDTO((Professeur) francois);

		Utilisateur ubisoft = Utilisateur.createUtilisateur("Employeur", "Yves Guillemot", "ubisoft@gmail.com", "Ubisoft123!", null, "Informatique", "Ubisoft Incorporé");
		EmployeurDTO employeurUbisoft = EmployeurDTO.toDTO((Employeur) ubisoft);

		OffreStage offreStage = OffreStage.createOffreStage("Développeur de jeux video", "Développeur Unity", "Développer des jeux video en utilisant Unity", "Ubisoft", "techniques_informatique", 25.0, "virtuel", "Montréal", "temps_plein", LocalDate.now().plusMonths(3), LocalDate.now().plusMonths(6), 20, 1, LocalDate.now().plusMonths(2));
		OffreStageDTO offreStageDTO = OffreStageDTO.toDTO(offreStage);
		try {
			checkAndAddOffreStage(offreStageDTO);
		}catch (Exception e){
			System.out.println("Une erreur s'est produite : " + e.getMessage());
			e.printStackTrace();
		}

		try {
			System.out.println();
			checkAndAddUtilisateur(etudiantVazgen, Role.ETUDIANT);
			System.out.println();
			checkAndAddUtilisateur(professeurFrancois, Role.PROFESSEUR);
			System.out.println();
			checkAndAddUtilisateur(employeurUbisoft, Role.EMPLOYEUR);

		} catch (Exception e) {
			System.out.println("Une erreur s'est produite : " + e.getMessage());
			e.printStackTrace();
		}
	}

	private void checkAndAddOffreStage(OffreStageDTO offreStage) {
		System.out.println(); //Ajouté juste pour la lisibilité
		List<OffreStageDTO> offreStageList = offreStageService.getOffresStage();
		boolean exists = offreStageList
				.stream()
				.anyMatch(offre -> offre.getNom().equals(offreStage.getNom()));

		if (exists) {
			System.out.println("Offre de stage avec nom " + offreStage.getNom() + " existe déjà dans la base de données");
		} else {
			offreStageService.addOffreStage(offreStage);
			System.out.println("Offre de stage avec nom " + offreStage.getNom() + " a été ajoutée avec succès");
		}
	}

	private void checkAndAddUtilisateur(UtilisateurDTO utilisateurDTO, Role role) {
		List<UtilisateurDTO> utilisateurList = utilisateurService.getUtilisateurs(role);
		boolean exists = utilisateurList
				.stream()
				.anyMatch(utilisateur -> utilisateur.getEmail().equals(utilisateurDTO.getEmail()));

		if (exists) {
			System.out.println(role.toString() + " avec email " + utilisateurDTO.getEmail() + " existe déjà dans la base de données");
		} else {
			utilisateurService.addUtilisateur(utilisateurDTO);
			System.out.println(role.toString() + " avec email " + utilisateurDTO.getEmail() + " a été ajouté avec succès");
		}
	}
}