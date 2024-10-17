package fructose;

import fructose.model.*;
import fructose.repository.DepartementRepository;
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
        Utilisateur vazgen = Utilisateur.createUtilisateur("Etudiant", "Vazgen Markaryan", "vazgen@gmail.com", "Vazgen123!", "1111111", "techniques_informatique", null);
        EtudiantDTO etudiantVazgen = EtudiantDTO.toDTO((Etudiant) vazgen);

        Utilisateur francois = Utilisateur.createUtilisateur("Professeur", "François Lacoursière", "francois@gmail.com", "Francois123!", "2222222", "techniques_informatique", null);
        ProfesseurDTO professeurFrancois = ProfesseurDTO.toDTO((Professeur) francois);

        Utilisateur ubisoft = Utilisateur.createUtilisateur("Employeur", "Yves Guillemot", "ubisoft@gmail.com", "Ubisoft123!", null, "techniques_informatique", "Ubisoft Incorporé");
        EmployeurDTO employeurUbisoft = EmployeurDTO.toDTO((Employeur) ubisoft);
        Utilisateur admin = Utilisateur.createUtilisateur("Admin", "Gabriel Laplante", "admin@gmail.com", "Admin123!", "0000000", "CÉGEP ANDRÉ LAURENDEAU", null);
        AdminDTO superAdmin = AdminDTO.toDTO((Admin) admin);
        addWithHandleException(this::checkAndAddDepartement, "Une erreur s'est produite lors de l'ajout du département");
        addWithHandleException(() -> {
            checkAndAddUtilisateur(superAdmin, Role.ADMIN);
            checkAndAddUtilisateur(etudiantVazgen, Role.ETUDIANT);
            checkAndAddUtilisateur(professeurFrancois, Role.PROFESSEUR);
            checkAndAddUtilisateur(employeurUbisoft, Role.EMPLOYEUR);
        }, "Une erreur s'est produite lors de l'ajout de l'utilisateur");

        OffreStageDTO offreStage = new OffreStageDTO();
        offreStage.setNom("Développeur Java");
        offreStage.setDescription("Développer des applications Java");
        offreStage.setPoste("Développeur Java");
        offreStage.setCompagnie("Ubisoft Incorporé");
        DepartementDTO departementPersisted = departementService.getDepartementByNom("techniques_informatique");
        offreStage.setDepartementDTO(departementPersisted);
        offreStage.setTauxHoraire(20.0);
        offreStage.setTypeEmploi("presentiel");
        offreStage.setAdresse("5505, rue Saint-Laurent, Montréal, QC, H2T 1S6");
        offreStage.setModaliteTravail("temps_plein");
        offreStage.setDateDebut(LocalDate.of(2025, 6, 1));
        offreStage.setDateFin(LocalDate.of(2025, 8, 31));
        offreStage.setNombreHeuresSemaine(40);
        offreStage.setNombrePostes(5);
        offreStage.setDateLimiteCandidature(LocalDate.of(2025, 5, 1));
        UtilisateurDTO ownerPersisted = utilisateurService.getUtilisateurByEmail("ubisoft@gmail.com");
        addWithHandleException(() -> checkAndAddOffreStage(offreStage, ownerPersisted), "Une erreur s'est produite lors de l'ajout de l'offre de stage");
    }

    private void checkAndAddDepartement(){
        List<Departement> departements = departementService.getAllDepartements();
        if (!departements.isEmpty()) {
            System.out.println("Les départements existent déjà dans la base de données");
            return;
        }
        Departement.getDepartementsParDefauts().forEach(departementName -> {
            DepartementDTO departementDTO = new DepartementDTO();
            departementDTO.setNom(departementName);
            departementService.addDepartement(departementDTO);
            System.out.println("Département \"" + departementName + "\" a été ajouté avec succès");
        });
    }

    private void addWithHandleException(Runnable action, String errorMessage) {
        try {
            action.run();
        } catch (Exception e) {
            logger.error(errorMessage, e);
        }
    }

    private void checkAndAddOffreStage(OffreStageDTO offreStage, UtilisateurDTO ownerDTO) {
        offreStageService.addOffreStage(offreStage, ownerDTO);
        System.out.println("OFFRE STAGE avec le nom \"" + offreStage.getNom() + "\" a été ajoutée avec succès");
    }

    private void checkAndAddUtilisateur(UtilisateurDTO utilisateurDTO, Role role) {
        List<UtilisateurDTO> utilisateurList = utilisateurService.getUtilisateurs(role);
        boolean exists = utilisateurList.stream().anyMatch(utilisateur -> utilisateur.getEmail().equals(utilisateurDTO.getEmail()));

        if (exists) {
            System.out.println(role + " avec email \"" + utilisateurDTO.getEmail() + "\" existe déjà dans la base de données");
        } else {
            utilisateurService.addUtilisateur(utilisateurDTO);
            System.out.println(role + " avec email \"" + utilisateurDTO.getEmail() + "\" a été ajouté avec succès");
        }
    }
}