package fructose.service;

import fructose.model.Employeur;
import fructose.model.Etudiant;
import fructose.model.Professeur;
import fructose.model.Utilisateur;
import fructose.model.auth.Credentials;
import fructose.model.auth.Role;
import fructose.repository.vides.EmployeurRepository;
import fructose.repository.vides.EtudiantRepository;
import fructose.repository.UtilisateurRepository;
import fructose.repository.vides.ProfesseurRepository;
import fructose.security.JwtTokenProvider;
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
import org.springframework.security.authentication.AuthenticationManager;
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

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    public void setUp() {
        utilisateurService = new UtilisateurService(etudiantRepository, professeurRepository, employeurRepository, passwordEncoder, utilisateurRepository, jwtTokenProvider,authenticationManager);
    }

    // ------------------- GET UTILISATEUR BY ID ------------------- //

    @Test
    void testGetUtilisateurById_Success() {
        Long id = 1L;
        Etudiant etudiant = new Etudiant();
        etudiant.setId(id);
        etudiant.setCredentials(Credentials.builder()
                .email("test@example.com")
                .password("Password123!")
                .role(Role.ETUDIANT)
                .build());

        when(etudiantRepository.findById(id)).thenReturn(Optional.of(etudiant));

        UtilisateurDTO result = utilisateurService.getUtilisateurById(id, Role.ETUDIANT);
        assertNotNull(result);
    }

    @Test
    void testGetUtilisateurById_Professeur_Success() {
        Long id = 1L;
        Professeur professeur = new Professeur();
        professeur.setId(id);
        professeur.setCredentials(Credentials.builder()
                .email("professeur@example.com")
                .password("Password123!")
                .role(Role.PROFESSEUR)
                .build());
        when(professeurRepository.findById(id)).thenReturn(Optional.of(professeur));

        UtilisateurDTO result = utilisateurService.getUtilisateurById(id, Role.PROFESSEUR);
        assertNotNull(result);
        verify(professeurRepository).findById(id);
    }

    @Test
    void testGetUtilisateurById_Employeur_Success() {
        Long id = 1L;
        Employeur employeur = new Employeur();
        employeur.setId(id);
        employeur.setCredentials(Credentials.builder()
                .email("employeur@example.com")
                .password("Password123!")
                .role(Role.EMPLOYEUR)
                .build());
        when(employeurRepository.findById(id)).thenReturn(Optional.of(employeur));

        UtilisateurDTO result = utilisateurService.getUtilisateurById(id, Role.EMPLOYEUR);
        assertNotNull(result);
        verify(employeurRepository).findById(id);
    }

    @Test
    void testGetUtilisateurById_NotFound() {
        Long id = 1L;
        when(etudiantRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.getUtilisateurById(id, Role.ETUDIANT);
        });
    }

    // ------------------- ADD UTILISATEUR ------------------- //

    @Test
    void testAddUtilisateur_Success() {
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setPassword("password123");
        utilisateurDTO.setRole(Role.ETUDIANT);

        when(passwordEncoder.encode(utilisateurDTO.getPassword())).thenReturn("encodedPassword");

        utilisateurService.addUtilisateur(utilisateurDTO);

        verify(etudiantRepository, times(1)).save(any(Etudiant.class));
    }

    @Test
    void testAddUtilisateur_Professeur_Success() {
        ProfesseurDTO professeurDTO = new ProfesseurDTO();
        professeurDTO.setPassword("password123");
        professeurDTO.setRole(Role.PROFESSEUR);

        when(passwordEncoder.encode(professeurDTO.getPassword())).thenReturn("encodedPassword");

        utilisateurService.addUtilisateur(professeurDTO);

        verify(professeurRepository, times(1)).save(any(Professeur.class));
    }

    @Test
    void testAddUtilisateur_Employeur_Success() {
        EmployeurDTO employeurDTO = new EmployeurDTO();
        employeurDTO.setPassword("password123");
        employeurDTO.setRole(Role.EMPLOYEUR);

        when(passwordEncoder.encode(employeurDTO.getPassword())).thenReturn("encodedPassword");

        utilisateurService.addUtilisateur(employeurDTO);

        verify(employeurRepository, times(1)).save(any(Employeur.class));
    }

    @Test
    void addUtilisateur_ValidEtudiant_SavesEtudiant() {
        EtudiantDTO etudiantDTO = new EtudiantDTO();
        etudiantDTO.setFullName("John Doe");
        etudiantDTO.setEmail("john@gmail.com");
        etudiantDTO.setPassword("Password123!");
        etudiantDTO.setMatricule("1111111");
        etudiantDTO.setRole(Role.ETUDIANT);
        etudiantDTO.setDepartement("Informatique");
        etudiantDTO.setCompanyName(null);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        utilisateurService.addUtilisateur(etudiantDTO);

        verify(etudiantRepository).save(any(Etudiant.class));
    }

    @Test
    void updateUtilisateur_ValidProfesseur_UpdatesProfesseur() {
        ProfesseurDTO professeurDTO = new ProfesseurDTO();
        professeurDTO.setFullName("Jane Doe");
        professeurDTO.setEmail("jane@gmai.com");
        professeurDTO.setPassword("Password123!");
        professeurDTO.setMatricule("2222222");
        professeurDTO.setRole(Role.PROFESSEUR);
        professeurDTO.setDepartement("Informatique");
        professeurDTO.setCompanyName(null);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        utilisateurService.updateUtilisateur(professeurDTO, Role.PROFESSEUR);

        verify(professeurRepository).save(any(Professeur.class));
    }


    // ------------------- DELETE UTILISATEUR ------------------- //

    @Test
    void testDeleteUtilisateur_Success() {
        Long id = 1L;
        Etudiant etudiant = new Etudiant();
        etudiant.setId(id);
        etudiant.setCredentials(new Credentials("etudiant@example.com", "password123", Role.ETUDIANT));

        when(etudiantRepository.findById(id)).thenReturn(Optional.of(etudiant));

        utilisateurService.deleteUtilisateur(id, Role.ETUDIANT);

        verify(etudiantRepository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteUtilisateur_Professeur_Success() {
        Long id = 1L;
        Professeur professeur = new Professeur();
        professeur.setId(id);
        professeur.setCredentials(new Credentials("professeur@example.com", "password123", Role.PROFESSEUR));

        when(professeurRepository.findById(id)).thenReturn(Optional.of(professeur));

        utilisateurService.deleteUtilisateur(id, Role.PROFESSEUR);

        verify(professeurRepository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteUtilisateur_Employeur_Success() {
        Long id = 1L;
        Employeur employeur = new Employeur();
        employeur.setId(id);
        employeur.setCredentials(new Credentials("employeur@example.com", "password123", Role.EMPLOYEUR));

        when(employeurRepository.findById(id)).thenReturn(Optional.of(employeur));

        utilisateurService.deleteUtilisateur(id, Role.EMPLOYEUR);

        verify(employeurRepository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteUtilisateur_NotFound() {
        Long id = 1L;
        when(etudiantRepository.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.deleteUtilisateur(id, Role.ETUDIANT);
        });

        assertEquals("Etudiant avec ID: " + id + " n'existe pas", exception.getMessage());
        verify(etudiantRepository, never()).deleteById(id);
    }



    // ------------------- GET ALL UTILISATEURS ------------------- //

    @Test
    void testGetUtilisateurs() {

        Etudiant etudiant1 = new Etudiant();
        etudiant1.setCredentials(new Credentials("etudiant1@example.com", "password123", Role.ETUDIANT));
        Etudiant etudiant2 = new Etudiant();
        etudiant2.setCredentials(new Credentials("etudiant2@example.com", "password123", Role.ETUDIANT));

        List<Etudiant> etudiants = List.of(etudiant1,etudiant2);
        when(etudiantRepository.findAll()).thenReturn(etudiants);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs(Role.ETUDIANT);

        assertEquals(2, utilisateurs.size());
    }

    @Test
    void testGetUtilisateurs_Professeur() {
        Professeur professeur1 = new Professeur();
        professeur1.setCredentials(new Credentials("professeur1@example.com", "password123", Role.PROFESSEUR));
        Professeur professeur2 = new Professeur();
        professeur2.setCredentials(new Credentials("professeur2@example.com", "password123", Role.PROFESSEUR));


        List<Professeur> professeurs = List.of(professeur1, professeur2);
        when(professeurRepository.findAll()).thenReturn(professeurs);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs(Role.PROFESSEUR);

        assertEquals(2, utilisateurs.size());
    }

    @Test
    void testGetUtilisateurs_Employeur() {

        Employeur employeur1 = new Employeur();
        employeur1.setCredentials(new Credentials("employeur1@example.com", "password123", Role.EMPLOYEUR));
        Employeur employeur2 = new Employeur();
        employeur2.setCredentials(new Credentials("employeur2@example.com", "password123", Role.EMPLOYEUR));

        List<Employeur> employeurs = List.of(employeur1,employeur2);
        when(employeurRepository.findAll()).thenReturn(employeurs);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs(Role.EMPLOYEUR);

        assertEquals(2, utilisateurs.size());
    }

    // ------------------- LOGIN UTILISATEUR ------------------- //

    @Test
    public void test_successful_login_with_correct_email_and_password() {
        Utilisateur utilisateurVazgan = Utilisateur.createUtilisateur("Etudiant",
                "Vazgen Markaryan", "vazgen@gmail.com", "Vazgen123!",
                "1111111", "informatique", null);
        utilisateurVazgan.setCredentials(new Credentials("vazgen@gmail.com", "Vazgen123!", Role.ETUDIANT));
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

        when(utilisateurRepository.findByEmail(email)).thenReturn(null);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.login(email, password);
        });

        assertEquals("L'utilisateur avec mail vazgen2@gmail.com n'existe pas", exception.getMessage());
    }

    @Test
    public void test_login_with_incorrect_password() {
        Utilisateur utilisateurVazgan = Utilisateur.createUtilisateur("Etudiant", "Vazgen Markaryan", "vazgen@gmail.com", "Vazgen123!", "1111111", "informatique", null);
        utilisateurVazgan.setPassword(new BCryptPasswordEncoder().encode(utilisateurVazgan.getPassword()));
        when(utilisateurRepository.findByEmail(utilisateurVazgan.getEmail())).thenReturn(utilisateurVazgan);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.login(utilisateurVazgan.getEmail(), "IncorrectPassword1!");
        });

        assertEquals("Mot de passe incorrect", exception.getMessage());
    }

    @Test
    void login_ValidCredentials_ReturnsUtilisateurDTO() {
        Utilisateur utilisateur = new Utilisateur("John Doe", "john@example.com", "encodedPassword", "1234567", Role.ETUDIANT, null, null);
        when(utilisateurRepository.findByEmail("john@example.com")).thenReturn(utilisateur);
        when(passwordEncoder.matches("Password123!", "encodedPassword")).thenReturn(true);

        UtilisateurDTO result = utilisateurService.login("john@example.com", "Password123!");

        assertNotNull(result);
        assertEquals("John Doe", result.getFullName());
    }

    @Test
    void login_InvalidCredentials_ThrowsException() {
        Utilisateur utilisateur = new Utilisateur("John Doe", "john@example.com", "encodedPassword", "1234567", Role.ETUDIANT, null, null);
        when(utilisateurRepository.findByEmail("john@example.com")).thenReturn(utilisateur);
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> utilisateurService.login("john@example.com", "wrongPassword"));
        assertEquals("Mot de passe incorrect", exception.getMessage());
    }

    // ------------------- VALID ROLE ------------------- //

    @Test
    void testIsValidRole() {
        assertTrue(utilisateurService.isValidRole("ETUDIANT"));
        assertFalse(utilisateurService.isValidRole("InvalidRole"));
    }
}