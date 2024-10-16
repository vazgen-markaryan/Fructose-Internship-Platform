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
        OffreStageDTO offreStageDTO = new OffreStageDTO();
        offreStageDTO.setId(1L);
        offreStageDTO.setNom("Google");
        offreStageDTO.setPoste("Developpeur Java");
        offreStageDTO.setDescription("Faire du developpement Java chez Google");
        offreStageDTO.setCompagnie("Google");
        Departement departement = new Departement();
        departement.setNom("Informatique");
        offreStageDTO.setDepartement(departement);
        offreStageDTO.setTauxHoraire(23.75);
        offreStageDTO.setAdresse("1600 Amphitheatre Parkway, Mountain View, CA 94043, Etats-Unis");
        offreStageDTO.setTypeEmploi("presentiel");
        offreStageDTO.setModaliteTravail("temps_plein");
        offreStageDTO.setDateDebut(LocalDate.now().plusMonths(1));
        offreStageDTO.setDateFin(LocalDate.now().plusMonths(6));
        offreStageDTO.setNombreHeuresSemaine(40);
        offreStageDTO.setNombrePostes(5);
        offreStageDTO.setDateLimiteCandidature(LocalDate.now().plusDays(14));
        EmployeurDTO employeurDTO = new EmployeurDTO();
        employeurDTO.setRole(Role.EMPLOYEUR);
        employeurDTO.setEmail("Mike");
        offreStageDTO.setOwnerDTO(employeurDTO);
        Utilisateur admin = Utilisateur.createUtilisateur("Admin", "Gabriel Laplante", "admin@gmail.com", "Admin123!", "0000000", "CÉGEP ANDRÉ LAURENDEAU", null);
        AdminDTO superAdmin = AdminDTO.toDTO((Admin) admin);
        addWithHandleException(this::checkAndAddDepartement, "Une erreur s'est produite lors de l'ajout du département");
        addWithHandleException(() -> checkAndAddOffreStage(offreStageDTO), "Une erreur s'est produite lors de l'ajout de l'offre de stage");
        addWithHandleException(() -> {
            checkAndAddUtilisateur(superAdmin, Role.ADMIN);
            checkAndAddUtilisateur(etudiantVazgen, Role.ETUDIANT);
            checkAndAddUtilisateur(professeurFrancois, Role.PROFESSEUR);
            checkAndAddUtilisateur(employeurUbisoft, Role.EMPLOYEUR);
        }, "Une erreur s'est produite lors de l'ajout de l'utilisateur");
    }

    private void checkAndAddDepartement(){
        DepartementDTO departement1 = new DepartementDTO();
        departement1.setNom("techniques_informatique");
        DepartementDTO departement2 = new DepartementDTO();
        departement2.setNom("soins_infirmiers");
        departementService.addDepartement(departement1);
        departementService.addDepartement(departement2);
    }

    private void addWithHandleException(Runnable action, String errorMessage) {
        try {
            action.run();
        } catch (Exception e) {
            logger.error(errorMessage, e);
        }
    }

    private void checkAndAddOffreStage(OffreStageDTO offreStage) {
        offreStageService.addOffreStage(offreStage, offreStage.getOwnerDTO());
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