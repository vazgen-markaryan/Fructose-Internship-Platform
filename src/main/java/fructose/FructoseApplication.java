package fructose;

import fructose.model.*;
import fructose.service.DepartementService;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class FructoseApplication implements CommandLineRunner {
	
	private static final Logger logger = LoggerFactory.getLogger(FructoseApplication.class);
	private final UtilisateurService utilisateurService;
	private final OffreStageService offreStageService;
	private final DepartementService departementService;
	
	public FructoseApplication(UtilisateurService utilisateurService, OffreStageService offreStageService, DepartementService departementService) {
		this.utilisateurService = utilisateurService;
		this.offreStageService = offreStageService;
		this.departementService = departementService;
	}
	
	public static void main(String[] args) {
		SpringApplication.run(FructoseApplication.class, args);
	}
	
	@Override
	public void run(String... args) {
		addWithHandleException(this::checkAndAddDepartement, "Une erreur s'est produite lors de l'ajout du département");
		
		// DEPARTEMENTS
		Departement departementInformatique = getDepartement("techniques_informatique");
		Departement departementCegep = getDepartement("CÉGEP ANDRÉ LAURENDEAU");
		
		// ÉTUDIANTS APPROUVÉS
		createAndPersistUtilisateur("Etudiant", "Vazgen Markaryan", "vazgen@gmail.com", "Vazgen123!", "1111111", departementInformatique, null, true);
		createAndPersistUtilisateur("Etudiant", "Alexondeur Tudose", "alex@gmail.com", "Alex123!", "2222222", departementInformatique, null, true);
		createAndPersistUtilisateur("Etudiant", "Bernard Thomas Laforest", "bernard@gmail.com", "Bernard123!", "3333333", departementInformatique, null, true);
		createAndPersistUtilisateur("Etudiant", "Lou Jonathan Monty", "lou@gmail.com", "LouJM123!", "4444444", departementInformatique, null, true);
		createAndPersistUtilisateur("Etudiant", "Joan Favrichon", "joan@gmail.com", "Joan123!", "5555555", departementInformatique, null, true);
		
		// ÉTUDIANTS NON APPROUVÉS
		createAndPersistUtilisateur("Etudiant", "Roberto Berrios Larios", "roberto@gmail.com", "Roberto123!", "1234567", departementInformatique, null, false);
		createAndPersistUtilisateur("Etudiant", "Samuel Léveillé", "samuel@gmail.com", "Samuel123!", "2345678", departementInformatique, null, false);
		createAndPersistUtilisateur("Etudiant", "Jason Jody Aubé", "jason@gmail.com", "Jason123!", "3456789", departementInformatique, null, false);
		System.out.println();
		
		// PROFESSEURS APPROUVÉS
		createAndPersistUtilisateur("Professeur", "François Lacoursière", "francois@gmail.com", "Francois123!", "6666666", departementInformatique, null, true);
		createAndPersistUtilisateur("Professeur", "Michel Généreux", "michel@gmail.com", "Michel123!", "7777777", departementInformatique, null, true);
		
		// PROFESSEURS NON APPROUVÉS
		createAndPersistUtilisateur("Professeur", "David Giasson", "david@gmail.com", "David123!", "8888888", departementInformatique, null, false);
		createAndPersistUtilisateur("Professeur", "Thomas Coutelen", "thomas@gmail.com", "Thomas123!", "9999999", departementInformatique, null, false);
		System.out.println();
		
		// EMPLOYEURS
		createAndPersistUtilisateur("Employeur", "Yves Guillemot", "ubisoft@gmail.com", "Ubisoft123!", null, departementInformatique, "Ubisoft Incorporé", true);
		createAndPersistUtilisateur("Employeur", "Sundar Pichai", "google@gmail.com", "Google123!", null, departementInformatique, "Google LLC", true);
		createAndPersistUtilisateur("Employeur", "Bobby Kotick", "activision@gmail.com", "Activision123!", null, departementInformatique, "Activision Publishing Incorporé", true);
		
		// EMPLOYEUR NON APPROUVÉS
		createAndPersistUtilisateur("Employeur", "Andrew Wilson", "electronicarts@gmail.com", "Electronicarts123!", null, departementInformatique, "Electronic Arts Inc", false);
		createAndPersistUtilisateur("Employeur", "Satya Nadella", "microsoft@gmail.com", "Microsoft123!", null, departementInformatique, "Microsoft Corporation", false);
		System.out.println();
		
		// ADMINS
		createAndPersistUtilisateur("Admin", "Didier Tremblay", "didieradmin@gmail.com", "Didieradmin123!", "1212121", departementCegep, null, true);
		createAndPersistUtilisateur("Admin", "Karim Mihoubi", "karimadmin@gmail.com", "Karimadmin123!", "2121212", departementCegep, null, true);
		System.out.println();
		
		// OFFRE DE STAGE
		createAndPersistOffreStage("Développeur Java", "Développer des applications Java", "Développeur Java", "Ubisoft Incorporé", departementInformatique, 20.0, "presentiel", "5505, rue Saint-Laurent, Montréal, QC, H2T 1S6", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 20, 5, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		createAndPersistOffreStage("Développeur Web", "Développer des applications Web", "Développeur Web", "Google LLC", departementInformatique, 25.0, "virtuel", "Mountain View, Californie, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 30, 10, LocalDate.of(2025, 5, 1), "google@gmail.com");
		createAndPersistOffreStage("Développeur C++", "Développer des jeux vidéo", "Développeur C++", "Activision Publishing, Inc", departementInformatique, 30.0, "hybride", "Santa Monica, Californie, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 40, 15, LocalDate.of(2025, 5, 1), "activision@gmail.com");
	}
	
	private Departement getDepartement(String nom) {
		return DepartementDTO.toEntity(departementService.getDepartementByNom(nom));
	}
	
	private UtilisateurDTO createEtudiant(String nom, String email, String password, String matricule, Departement departement, boolean isApproved) {
		Utilisateur etudiant = Utilisateur.createUtilisateur("Etudiant", nom, email, password, matricule, departement, null, isApproved);
		return EtudiantDTO.toDTO((Etudiant) etudiant);
	}
	
	private UtilisateurDTO createProfesseur(String nom, String email, String password, String matricule, Departement departement, boolean isApproved) {
		Utilisateur professeur = Utilisateur.createUtilisateur("Professeur", nom, email, password, matricule, departement, null, isApproved);
		return ProfesseurDTO.toDTO((Professeur) professeur);
	}
	
	private UtilisateurDTO createEmployeur(String nom, String email, String password, Departement departement, String entreprise, boolean isApproved) {
		Utilisateur employeur = Utilisateur.createUtilisateur("Employeur", nom, email, password, null, departement, entreprise, isApproved);
		return EmployeurDTO.toDTO((Employeur) employeur);
	}
	
	private UtilisateurDTO createAdmin(String nom, String email, String password, String matricule, Departement departement, boolean isApproved) {
		Utilisateur admin = Utilisateur.createUtilisateur("Admin", nom, email, password, matricule, departement, null, isApproved);
		return AdminDTO.toDTO((Admin) admin);
	}
	
	private void createAndPersistOffreStage(String nom, String description, String poste, String entreprise, Departement departement, double salaire, String modeTravail, String adresse, String typeContrat, LocalDate dateDebut, LocalDate dateFin, int heuresParSemaine, int nombrePostes, LocalDate dateLimite, String emailEmployeur) {
		UtilisateurDTO employeurDTO = utilisateurService.getUtilisateurByEmail(emailEmployeur);
		OffreStage offreStage = OffreStage.createOffreStage(nom, description, poste, entreprise, departement, salaire, modeTravail, adresse, typeContrat, dateDebut, dateFin, heuresParSemaine, nombrePostes, dateLimite, UtilisateurDTO.toEntity(employeurDTO));
		OffreStageDTO offreStageDTO = OffreStageDTO.toDTO(offreStage);
		addWithHandleException(() -> checkAndAddOffreStage(offreStageDTO, employeurDTO), "Une erreur s'est produite lors de l'ajout de l'offre de stage");
	}
	
	private void createAndPersistUtilisateur(String role, String nom, String email, String password, String matricule, Departement departement, String entreprise, boolean isApproved) {
		UtilisateurDTO utilisateurDTO = switch (role) {
			case "Etudiant" -> createEtudiant(nom, email, password, matricule, departement, isApproved);
			case "Professeur" -> createProfesseur(nom, email, password, matricule, departement, isApproved);
			case "Employeur" -> createEmployeur(nom, email, password, departement, entreprise, isApproved);
			case "Admin" -> createAdmin(nom, email, password, matricule, departement, isApproved);
			default -> throw new IllegalArgumentException("Invalid role: " + role);
		};
		checkAndAddUtilisateur(utilisateurDTO, Role.valueOf(role.toUpperCase()));
	}
	
	private void addWithHandleException(Runnable action, String errorMessage) {
		try {
			action.run();
		} catch (Exception e) {
			logger.error(errorMessage, e);
		}
	}
	
	private void checkAndAddDepartement() {
		List<Departement> departements = departementService.getAllDepartements();
		if (!departements.isEmpty()) {
			System.out.println("Les départements existent déjà dans la base de données");
			return;
		}
		
		StringBuilder resultMessage = new StringBuilder();
		boolean allSuccess = true;
		
		for (String departementName : Departement.getDepartementsParDefauts()) {
			try {
				DepartementDTO departementDTO = new DepartementDTO();
				departementDTO.setNom(departementName);
				departementService.addDepartement(departementDTO);
			} catch (Exception e) {
				resultMessage.append("Échec de l'ajout du département \"").append(departementName).append("\"\n");
				allSuccess = false;
			}
		}
		
		if (allSuccess) {
			resultMessage.append("Tous les départements ont été créés avec succès.");
		} else {
			resultMessage.append("Certains départements n'ont pas pu être créés.");
		}
		
		System.out.println("\n" + resultMessage.toString().trim() + "\n");
	}
	
	private void checkAndAddOffreStage(OffreStageDTO offreStage, UtilisateurDTO ownerDTO) {
		offreStageService.addOffreStage(offreStage, ownerDTO);
		System.out.println("OFFRE STAGE avec le nom \"" + offreStage.getNom() + "\" a été ajoutée avec succès");
	}
	
	private void checkAndAddUtilisateur(UtilisateurDTO utilisateurDTO, Role role) {
		List<UtilisateurDTO> utilisateurList = utilisateurService.getUtilisateurs(role);
		boolean exists = utilisateurList.stream().anyMatch(utilisateur -> utilisateur.getEmail().equals(utilisateurDTO.getEmail()));
		
		if (exists) {
			System.out.println(role + " avec email \"" + utilisateurDTO.getEmail() + "\" existe déjà dans la base de données (Password " + utilisateurDTO.getPassword() + ")");
		} else {
			utilisateurService.addUtilisateur(utilisateurDTO);
			System.out.println(role + " avec email \"" + utilisateurDTO.getEmail() + "\" a été ajouté avec succès (Password " + utilisateurDTO.getPassword() + ")");
		}
	}
}