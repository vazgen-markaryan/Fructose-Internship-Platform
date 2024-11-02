package fructose;

import fructose.model.*;
import fructose.model.enumerator.Role;
import fructose.service.CandidatureService;
import fructose.service.DepartementService;
import fructose.service.OffreStageService;
import fructose.service.UtilisateurService;
import fructose.service.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class FructoseApplication implements CommandLineRunner {
	
	private static final Logger logger = LoggerFactory.getLogger(FructoseApplication.class);
	private final UtilisateurService utilisateurService;
	private final OffreStageService offreStageService;
	private final DepartementService departementService;
	private final CandidatureService candidatureService;
	
	public FructoseApplication(UtilisateurService utilisateurService,
	                           OffreStageService offreStageService,
	                           DepartementService departementService,
	                           CandidatureService candidatureService) {
		this.utilisateurService = utilisateurService;
		this.offreStageService = offreStageService;
		this.departementService = departementService;
		this.candidatureService = candidatureService;
	}
	
	public static void main(String[] args) {
		SpringApplication.run(FructoseApplication.class, args);
	}
	
	@Override
	public void run(String... args) {
		
		checkAndAddDepartement();
		
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
		
		// OFFRES DE STAGE
		createAndPersistOffreStage("Développeur Java", "Développer des applications Java", "Développeur Java", "Ubisoft Incorporé", departementInformatique, 20.0, "presentiel", "5505, rue Saint-Laurent, Montréal, QC, H2T 1S6", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 20, 5, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		createAndPersistOffreStage("Développeur Web", "Développer des applications Web", "Développeur Web", "Ubisoft Incorporé", departementInformatique, 25.0, "virtuel", "Mountain View, Californie, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 30, 10, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		createAndPersistOffreStage("Développeur C++", "Développer des jeux vidéo", "Développeur C++", "Ubisoft Incorporé", departementInformatique, 30.0, "hybride", "Santa Monica, Californie, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 40, 15, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		createAndPersistOffreStage("Développeur Python", "Développer des applications Python", "Développeur Python", "Ubisoft Incorporé", departementInformatique, 22.0, "presentiel", "Redmond, Washington, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 25, 8, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		createAndPersistOffreStage("Développeur Frontend", "Créer des interfaces utilisateur", "Développeur Frontend", "Ubisoft Incorporé", departementInformatique, 28.0, "virtuel", "Menlo Park, Californie, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 35, 12, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		createAndPersistOffreStage("Développeur Ruby", "Développer des applications Ruby", "Développeur Ruby", "Ubisoft Incorporé", departementInformatique, 26.0, "virtuel", "San Francisco, Californie, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 23, 7, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		createAndPersistOffreStage("Ingénieur en machine learning", "Développer des modèles ML", "Ingénieur en ML", "Ubisoft Incorporé", departementInformatique, 35.0, "hybride", "Sunnyvale, Californie, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 20, 6, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		createAndPersistOffreStage("Développeur Go", "Développer des applications Go", "Développeur Go", "Ubisoft Incorporé", departementInformatique, 28.0, "presentiel", "Stockholm, Suède", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 19, 8, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		createAndPersistOffreStage("Ingénieur en cloud", "Gérer les infrastructures cloud", "Ingénieur Cloud", "Ubisoft Incorporé", departementInformatique, 34.0, "virtuel", "Seattle, Washington, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 18, 9, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		createAndPersistOffreStage("Data Scientist", "Analyser des données complexes", "Data Scientist", "Ubisoft Incorporé", departementInformatique, 36.0, "hybride", "Armonk, New York, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 15, 7, LocalDate.of(2025, 5, 1), "ubisoft@gmail.com");
		
		createAndPersistOffreStage("Développeur Backend", "Développer la logique serveur", "Développeur Backend", "Google LLC", departementInformatique, 24.0, "hybride", "Seattle, Washington, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 20, 6, LocalDate.of(2025, 5, 1), "google@gmail.com");
		createAndPersistOffreStage("Ingénieur DevOps", "Gérer l'infrastructure", "Ingénieur DevOps", "Google LLC", departementInformatique, 26.0, "presentiel", "Armonk, New York, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 15, 7, LocalDate.of(2025, 5, 1), "google@gmail.com");
		createAndPersistOffreStage("Analyste de données", "Analyser les données", "Analyste de données", "Google LLC", departementInformatique, 27.0, "virtuel", "Redwood City, Californie, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 18, 9, LocalDate.of(2025, 5, 1), "google@gmail.com");
		createAndPersistOffreStage("Concepteur UX/UI", "Concevoir des expériences utilisateur", "Concepteur UX/UI", "Google LLC", departementInformatique, 29.0, "hybride", "San Jose, Californie, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 22, 5, LocalDate.of(2025, 5, 1), "google@gmail.com");
		createAndPersistOffreStage("Testeur QA", "Tester des applications", "Testeur QA", "Google LLC", departementInformatique, 21.0, "presentiel", "San Francisco, Californie, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 19, 8, LocalDate.of(2025, 5, 1), "google@gmail.com");
		createAndPersistOffreStage("Développeur Kotlin", "Développer des applications Android", "Développeur Kotlin", "Google LLC", departementInformatique, 31.0, "presentiel", "Mountain View, Californie, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 20, 8, LocalDate.of(2025, 5, 1), "google@gmail.com");
		createAndPersistOffreStage("Développeur Swift", "Développer des applications iOS", "Développeur Swift", "Google LLC", departementInformatique, 33.0, "virtuel", "Cupertino, Californie, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 20, 6, LocalDate.of(2025, 5, 1), "google@gmail.com");
		createAndPersistOffreStage("Ingénieur QA", "Assurer la qualité des logiciels", "Ingénieur QA", "Google LLC", departementInformatique, 29.0, "hybride", "San Francisco, Californie, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 25, 10, LocalDate.of(2025, 5, 1), "google@gmail.com");
		createAndPersistOffreStage("Consultant en IT", "Conseiller les entreprises sur les technologies", "Consultant IT", "Google LLC", departementInformatique, 32.0, "presentiel", "New York, New York, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 22, 9, LocalDate.of(2025, 5, 1), "google@gmail.com");
		createAndPersistOffreStage("Développeur en réalité augmentée", "Créer des applications AR", "Développeur AR", "Google LLC", departementInformatique, 30.0, "virtuel", "Plantation, Floride, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 19, 5, LocalDate.of(2025, 5, 1), "google@gmail.com");
		
		createAndPersistOffreStage("Développeur en réalité virtuelle", "Créer des applications VR", "Développeur VR", "Activision Publishing, Inc", departementInformatique, 29.0, "hybride", "Menlo Park, Californie, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 17, 6, LocalDate.of(2025, 5, 1), "activision@gmail.com");
		createAndPersistOffreStage("Analyste en cybersécurité", "Protéger les données", "Analyste Cyber", "Activision Publishing, Inc", departementInformatique, 37.0, "presentiel", "Santa Clara, Californie, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 16, 8, LocalDate.of(2025, 5, 1), "activision@gmail.com");
		createAndPersistOffreStage("Développeur en blockchain", "Développer des solutions blockchain", "Développeur Blockchain", "Activision Publishing, Inc", departementInformatique, 38.0, "virtuel", "San Francisco, Californie, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 18, 7, LocalDate.of(2025, 5, 1), "activision@gmail.com");
		createAndPersistOffreStage("Ingénieur en intelligence artificielle", "Développer des modèles IA", "Ingénieur IA", "Activision Publishing, Inc", departementInformatique, 40.0, "hybride", "Londres, Royaume-Uni", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 20, 9, LocalDate.of(2025, 5, 1), "activision@gmail.com");
		createAndPersistOffreStage("Développeur en systèmes embarqués", "Développer des systèmes embarqués", "Développeur Systèmes", "Activision Publishing, Inc", departementInformatique, 27.0, "presentiel", "Eindhoven, Pays-Bas", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 22, 6, LocalDate.of(2025, 5, 1), "activision@gmail.com");
		createAndPersistOffreStage("Développeur Mobile", "Développer des applications mobiles", "Développeur Mobile", "Activision Publishing, Inc", departementInformatique, 23.0, "virtuel", "Stockholm, Suède", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 20, 10, LocalDate.of(2025, 5, 1), "activision@gmail.com");
		createAndPersistOffreStage("Ingénieur en sécurité", "Sécuriser les systèmes", "Ingénieur en sécurité", "Activision Publishing, Inc", departementInformatique, 32.0, "hybride", "Santa Clara, Californie, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 30, 12, LocalDate.of(2025, 5, 1), "activision@gmail.com");
		createAndPersistOffreStage("Administrateur système", "Gérer les systèmes informatiques", "Administrateur système", "Activision Publishing, Inc", departementInformatique, 22.0, "presentiel", "Santa Clara, Californie, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 15, 6, LocalDate.of(2025, 5, 1), "activision@gmail.com");
		createAndPersistOffreStage("Développeur PHP", "Développer des applications PHP", "Développeur PHP", "Activision Publishing, Inc", departementInformatique, 24.0, "virtuel", "Raleigh, Caroline du Nord, États-Unis", "temps_partiel", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 20, 8, LocalDate.of(2025, 5, 1), "activision@gmail.com");
		createAndPersistOffreStage("Développeur Full Stack", "Développer des applications full stack", "Développeur Full Stack", "Activision Publishing, Inc", departementInformatique, 25.0, "hybride", "San Jose, Californie, États-Unis", "temps_plein", LocalDate.of(2025, 6, 1), LocalDate.of(2025, 8, 31), 28, 9, LocalDate.of(2025, 5, 1), "activision@gmail.com");
		
		//CANDIDATURE
		System.out.println(); // Ajouter une ligne vide pour la lisibilité
		createAndPersistCandidature("vazgen@gmail.com", 10L, 20L, 30L);
		
		System.out.println(); // Ajouter une ligne vide pour la lisibilité
		candidatureService.approuverCandidature(1L);
		
		System.out.println(); // Ajouter une ligne vide pour la lisibilité
		candidatureService.refuserCandidature(2L, "Pas assez d'expérience");
	}
	
	
	//ADD METHODS
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
	
	private void createAndPersistOffreStage(String nom, String description, String poste, String entreprise, Departement departement, double salaire, String modeTravail, String adresse, String typeContrat, LocalDate dateDebut, LocalDate dateFin, int heuresParSemaine, int nombrePostes, LocalDate dateLimite, String emailEmployeur) {
		UtilisateurDTO employeurDTO = utilisateurService.getUtilisateurByEmail(emailEmployeur);
		OffreStage offreStage = OffreStage.createOffreStage(nom, description, poste, entreprise, departement, salaire, modeTravail, adresse, typeContrat, dateDebut, dateFin, heuresParSemaine, nombrePostes, dateLimite, UtilisateurDTO.toEntity(employeurDTO), false, false, "Commentaire par défaut");
		OffreStageDTO offreStageDTO = OffreStageDTO.toDTO(offreStage);
		checkAndAddOffreStage(offreStageDTO, employeurDTO);
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
	
	private void createAndPersistCandidature(String email, Long... offreStageIds) {
		try {
			Etudiant etudiant = (Etudiant) EtudiantDTO.toEntity(utilisateurService.getUtilisateurByEmail(email));
			
			// Postuler pour chaque offre de stage
			for (Long offreStageId : offreStageIds) {
				OffreStageDTO offreStageDTO = offreStageService.getOffreStageById(offreStageId);
				candidatureService.postuler(etudiant, OffreStageDTO.toEntity(offreStageDTO));
			}
		} catch (Exception e) {
			logger.error("Erreur lors de la soumission de la candidature", e);
		}
	}
	
	
	//UTILITY METHODS
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