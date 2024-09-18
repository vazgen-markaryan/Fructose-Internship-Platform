package fructose.service;

import fructose.model.Employeur;
import fructose.model.Etudiant;
import fructose.model.Professeur;
import fructose.model.Utilisateur;
import fructose.repository.vides.EmployeurRepository;
import fructose.repository.vides.EtudiantRepository;
import fructose.repository.UtilisateurRepository;
import fructose.repository.vides.ProfesseurRepository;
import fructose.service.dto.EmployeurDTO;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.ProfesseurDTO;
import fructose.service.dto.UtilisateurDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UtilisateurServiceTest {

    @InjectMocks
    private UtilisateurService utilisateurService;

    @Mock
    private EtudiantRepository etudiantRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @Mock
    private ProfesseurRepository professeurRepository;

    @Mock
    private EmployeurRepository employeurRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        utilisateurService = new UtilisateurService(etudiantRepository, professeurRepository, employeurRepository, passwordEncoder, utilisateurRepository);
    }

    // ------------------- GET UTILISATEUR BY ID ------------------- //

    @Test
    void testGetUtilisateurById_Success() {
        Long id = 1L;
        Etudiant etudiant = new Etudiant();
        etudiant.setId(id);
        when(etudiantRepository.findById(id)).thenReturn(Optional.of(etudiant));

        UtilisateurDTO result = utilisateurService.getUtilisateurById(id, "Etudiant");
        assertNotNull(result);
    }

    @Test
    void testGetUtilisateurById_Professeur_Success() {
        Long id = 1L;
        Professeur professeur = new Professeur();
        professeur.setId(id);
        when(professeurRepository.findById(id)).thenReturn(Optional.of(professeur));

        UtilisateurDTO result = utilisateurService.getUtilisateurById(id, "Professeur");
        assertNotNull(result);
        verify(professeurRepository).findById(id);
    }

    @Test
    void testGetUtilisateurById_Employeur_Success() {
        Long id = 1L;
        Employeur employeur = new Employeur();
        employeur.setId(id);
        when(employeurRepository.findById(id)).thenReturn(Optional.of(employeur));

        UtilisateurDTO result = utilisateurService.getUtilisateurById(id, "Employeur");
        assertNotNull(result);
        verify(employeurRepository).findById(id);
    }

    @Test
    void testGetUtilisateurById_NotFound() {
        Long id = 1L;
        when(etudiantRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.getUtilisateurById(id, "Etudiant");
        });
    }

    // ------------------- ADD UTILISATEUR ------------------- //

    @Test
    void testAddUtilisateur_Success() {
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setPassword("password123");
        utilisateurDTO.setRole("Etudiant");

        when(passwordEncoder.encode(utilisateurDTO.getPassword())).thenReturn("encodedPassword");

        utilisateurService.addUtilisateur(utilisateurDTO, "Etudiant");

        verify(etudiantRepository, times(1)).save(any(Etudiant.class));
    }

    @Test
    void testAddUtilisateur_Professeur_Success() {
        ProfesseurDTO professeurDTO = new ProfesseurDTO();
        professeurDTO.setPassword("password123");
        professeurDTO.setRole("Professeur");

        when(passwordEncoder.encode(professeurDTO.getPassword())).thenReturn("encodedPassword");

        utilisateurService.addUtilisateur(professeurDTO, "Professeur");

        verify(professeurRepository, times(1)).save(any(Professeur.class));
    }

    @Test
    void testAddUtilisateur_Employeur_Success() {
        EmployeurDTO employeurDTO = new EmployeurDTO();
        employeurDTO.setPassword("password123");
        employeurDTO.setRole("Employeur");

        when(passwordEncoder.encode(employeurDTO.getPassword())).thenReturn("encodedPassword");

        utilisateurService.addUtilisateur(employeurDTO, "Employeur");

        verify(employeurRepository, times(1)).save(any(Employeur.class));
    }

    @Test
    void addUtilisateur_ValidEtudiant_SavesEtudiant() {
        EtudiantDTO etudiantDTO = new EtudiantDTO();
        etudiantDTO.setFullName("John Doe");
        etudiantDTO.setEmail("john@gmail.com");
        etudiantDTO.setPassword("Password123!");
        etudiantDTO.setMatricule("1111111");
        etudiantDTO.setRole("Etudiant");
        etudiantDTO.setDepartement("Informatique");
        etudiantDTO.setCompanyName(null);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        utilisateurService.addUtilisateur(etudiantDTO, "Etudiant");

        verify(etudiantRepository).save(any(Etudiant.class));
    }

    @Test
    void updateUtilisateur_ValidProfesseur_UpdatesProfesseur() {
        ProfesseurDTO professeurDTO = new ProfesseurDTO();
        professeurDTO.setFullName("Jane Doe");
        professeurDTO.setEmail("jane@gmai.com");
        professeurDTO.setPassword("Password123!");
        professeurDTO.setMatricule("2222222");
        professeurDTO.setRole("Professeur");
        professeurDTO.setDepartement("Informatique");
        professeurDTO.setCompanyName(null);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        utilisateurService.updateUtilisateur(professeurDTO, "Professeur");

        verify(professeurRepository).save(any(Professeur.class));
    }

    // ------------------- DELETE UTILISATEUR ------------------- //

    @Test
    void testDeleteUtilisateur_Success() {
        Long id = 1L;
        Etudiant etudiant = new Etudiant();
        etudiant.setId(id);
        when(etudiantRepository.findById(id)).thenReturn(Optional.of(etudiant));

        utilisateurService.deleteUtilisateur(id, "Etudiant");

        verify(etudiantRepository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteUtilisateur_Professeur_Success() {
        Long id = 1L;
        Professeur professeur = new Professeur();
        professeur.setId(id);
        when(professeurRepository.findById(id)).thenReturn(Optional.of(professeur));

        utilisateurService.deleteUtilisateur(id, "Professeur");

        verify(professeurRepository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteUtilisateur_Employeur_Success() {
        Long id = 1L;
        Employeur employeur = new Employeur();
        employeur.setId(id);
        when(employeurRepository.findById(id)).thenReturn(Optional.of(employeur));

        utilisateurService.deleteUtilisateur(id, "Employeur");

        verify(employeurRepository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteUtilisateur_NotFound() {
        Long id = 1L;
        when(etudiantRepository.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.deleteUtilisateur(id, "Etudiant");
        });

        assertEquals("Etudiant avec ID: " + id + " n'existe pas", exception.getMessage());
        verify(etudiantRepository, never()).deleteById(id);
    }

    // ------------------- GET ALL UTILISATEURS ------------------- //

    @Test
    void testGetUtilisateurs() {
        List<Etudiant> etudiants = List.of(new Etudiant(), new Etudiant());
        when(etudiantRepository.findAll()).thenReturn(etudiants);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs("Etudiant");

        assertEquals(2, utilisateurs.size());
    }

    @Test
    void testGetUtilisateurs_Professeur() {
        List<Professeur> professeurs = List.of(new Professeur(), new Professeur());
        when(professeurRepository.findAll()).thenReturn(professeurs);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs("Professeur");

        assertEquals(2, utilisateurs.size());
    }

    @Test
    void testGetUtilisateurs_Employeur() {
        List<Employeur> employeurs = List.of(new Employeur(), new Employeur());
        when(employeurRepository.findAll()).thenReturn(employeurs);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs("Employeur");

        assertEquals(2, utilisateurs.size());
    }

    // ------------------- LOGIN UTILISATEUR ------------------- //

    @Test
    public void test_successful_login_with_correct_email_and_password() {
        Utilisateur utilisateurVazgan = Utilisateur.createUtilisateur("Etudiant",
                "Vazgen Markaryan", "vazgen@gmail.com", "Vazgen123!",
                "1111111", "Etudiant", "informatique", null);
        utilisateurVazgan.setPassword(new BCryptPasswordEncoder().encode(utilisateurVazgan.getPassword()));
        String password = "Vazgen123!";

        when(utilisateurRepository.findByEmail("vazgen@gmail.com")).thenReturn(utilisateurVazgan);
        doReturn(true).when(passwordEncoder).matches(password, utilisateurVazgan.getPassword());

        UtilisateurDTO result = utilisateurService.login(utilisateurVazgan.getEmail(), password);

        assertNotNull(result);
        assertEquals(utilisateurVazgan.getMatricule(), result.getMatricule());
        verify(utilisateurRepository).findByEmail(utilisateurVazgan.getEmail());
    }

    @Test
    public void test_login_with_incorrect_email() {
        String email = "vazgen2@gmail.com";
        String password = "Vazgen";
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail("vazgen@gmail.com");

        when(utilisateurRepository.findByEmail(email)).thenReturn(null);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.login(email, password);
        });

        assertEquals("L'utilisateur avec mail vazgen2@gmail.com n'existe pas", exception.getMessage());
    }

    @Test
    public void test_login_with_incorrect_password() {
        Utilisateur utilisateurVazgan = Utilisateur.createUtilisateur("Etudiant", "Vazgen Markaryan", "vazgen@gmail.com", "Vazgen123!", "1111111", "Etudiant", "informatique", null);
        utilisateurVazgan.setPassword(new BCryptPasswordEncoder().encode(utilisateurVazgan.getPassword()));
        when(utilisateurRepository.findByEmail(utilisateurVazgan.getEmail())).thenReturn(utilisateurVazgan);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.login(utilisateurVazgan.getEmail(), "IncorrectPassword1!");
        });

        assertEquals("Mot de passe incorrect", exception.getMessage());
    }

    @Test
    void login_ValidCredentials_ReturnsUtilisateurDTO() {
        Utilisateur utilisateur = new Utilisateur("John Doe", "john@example.com", "encodedPassword", "1234567", "Etudiant", null, null);
        when(utilisateurRepository.findByEmail("john@example.com")).thenReturn(utilisateur);
        when(passwordEncoder.matches("Password123!", "encodedPassword")).thenReturn(true);

        UtilisateurDTO result = utilisateurService.login("john@example.com", "Password123!");

        assertNotNull(result);
        assertEquals("John Doe", result.getFullName());
    }

    @Test
    void login_InvalidCredentials_ThrowsException() {
        Utilisateur utilisateur = new Utilisateur("John Doe", "john@example.com", "encodedPassword", "1234567", "Etudiant", null, null);
        when(utilisateurRepository.findByEmail("john@example.com")).thenReturn(utilisateur);
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> utilisateurService.login("john@example.com", "wrongPassword"));
        assertEquals("Mot de passe incorrect", exception.getMessage());
    }

    // ------------------- VALID ROLE ------------------- //

    @Test
    void testIsValidRole() {
        assertTrue(utilisateurService.isValidRole("Etudiant"));
        assertFalse(utilisateurService.isValidRole("InvalidRole"));
    }
}