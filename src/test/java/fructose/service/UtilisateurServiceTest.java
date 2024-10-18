package fructose.service;

import fructose.model.*;
import fructose.model.auth.Credentials;
import fructose.model.auth.Role;
import fructose.repository.*;
import fructose.security.JwtTokenProvider;
import fructose.security.exception.InvalidJwtTokenException;
import fructose.service.dto.*;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
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
    private AdminRepository adminRepository;

    @Mock
    private EmployeurRepository employeurRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private DepartementRepository departementRepository;

    @BeforeEach
    public void setUp() {
        utilisateurService = new UtilisateurService(etudiantRepository, professeurRepository, employeurRepository, adminRepository, passwordEncoder, utilisateurRepository, jwtTokenProvider,authenticationManager);
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
        etudiant.setDepartement(new Departement());

        when(etudiantRepository.findById(id)).thenReturn(Optional.of(etudiant));

        UtilisateurDTO result = utilisateurService.getUtilisateurById(id, Role.ETUDIANT);
        assertNotNull(result);
    }

    @Test
    void testGetUtilisateurById_Admin_Success() {
        Long id = 1L;
        Admin admin = new Admin();
        admin.setId(id);
        admin.setCredentials(Credentials.builder()
                .email("test@example.com")
                .password("Password123!")
                .role(Role.ADMIN)
                .build());

        when(adminRepository.findById(id)).thenReturn(Optional.of(admin));

        UtilisateurDTO result = utilisateurService.getUtilisateurById(id, Role.ADMIN);
        assertNotNull(result);
    }

    @Test
    void testGetUtilisateurById_Admin_NotFound() {
        Long adminId = 1L;
        when(adminRepository.findById(adminId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.getUtilisateurById(adminId, Role.ADMIN);
        });

        assertEquals("Admin avec ID: " + adminId + " n'existe pas", exception.getMessage());
        verify(adminRepository).findById(adminId);
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
        professeur.setDepartement(new Departement());
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
        employeur.setDepartement(new Departement());
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

    @Test
    void testGetUtilisateurById_Professeur_NotFound() {
        Long id = 1L;
        when(professeurRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.getUtilisateurById(id, Role.PROFESSEUR);
        });
    }

    @Test
    void testGetUtilisateurById_Employeur_NotFound() {
        Long id = 1L;
        when(employeurRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.getUtilisateurById(id, Role.EMPLOYEUR);
        });
    }

    @Test
    void authenticate_ValidCredentials_ReturnsToken() {
        utilisateurService.authenticateUser("joe@doe.com", "1234");
        verify(authenticationManager).authenticate(any());
    }

    @Test
    void authenticate_InvalidCredentials_ThrowsException() {
        doThrow(new IllegalArgumentException("Invalid credentials")).when(authenticationManager).authenticate(any());
        Exception exception = assertThrows(IllegalArgumentException.class, () -> utilisateurService.authenticateUser("joe@doe.com", "1234"));
        assertEquals("Invalid credentials", exception.getMessage());
    }

    @Test
    void isEmailTaken_EmailExists_ReturnsTrue() {
        when(utilisateurRepository.findByEmail("joe@doe.com")).thenReturn(new Utilisateur());
        assertTrue(utilisateurService.isEmailTaken("joe@doe.com"));

    }

    @Test
    void isEmailTaken_EmailDoesNotExist_ReturnsFalse() {
        when(utilisateurRepository.findByEmail("joe@doe.com")).thenReturn(null);
        assertFalse(utilisateurService.isEmailTaken("joe@doe.com"));
    }

    @Test
    void idMatriculeTaken_MatriculeExists_ReturnsTrue() {
        when(utilisateurRepository.findByMatricule("1234567")).thenReturn(new Utilisateur());
        assertTrue(utilisateurService.isMatriculeTaken("1234567"));
    }

    @Test
    void isMatriculeTaken_MatriculeDoesNotExist_ReturnsFalse() {
        when(utilisateurRepository.findByMatricule("1234567")).thenReturn(null);
        assertFalse(utilisateurService.isMatriculeTaken("1234567"));
    }

    // ------------------- ADD UTILISATEUR ------------------- //

    @Test
    void testAddUtilisateur_Success() {
        UtilisateurDTO utilisateurDTO = new UtilisateurDTO();
        utilisateurDTO.setPassword("password123");
        utilisateurDTO.setRole(Role.ETUDIANT);
        utilisateurDTO.setDepartementDTO(new DepartementDTO());
        when(passwordEncoder.encode(utilisateurDTO.getPassword())).thenReturn("encodedPassword");

        utilisateurService.addUtilisateur(utilisateurDTO);

        verify(etudiantRepository, times(1)).save(any(Etudiant.class));
    }

    @Test
    void testAddUtilisateur_Professeur_Success() {
        ProfesseurDTO professeurDTO = new ProfesseurDTO();
        professeurDTO.setPassword("password123");
        professeurDTO.setRole(Role.PROFESSEUR);
        professeurDTO.setDepartementDTO(new DepartementDTO());
        when(passwordEncoder.encode(professeurDTO.getPassword())).thenReturn("encodedPassword");

        utilisateurService.addUtilisateur(professeurDTO);

        verify(professeurRepository, times(1)).save(any(Professeur.class));
    }

    @Test
    void testAddUtilisateur_Employeur_Success() {
        EmployeurDTO employeurDTO = new EmployeurDTO();
        employeurDTO.setPassword("password123");
        employeurDTO.setRole(Role.EMPLOYEUR);
        employeurDTO.setDepartementDTO(new DepartementDTO());
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
        etudiantDTO.setDepartementDTO(new DepartementDTO());
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
        professeurDTO.setDepartementDTO(new DepartementDTO());
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
        etudiant.setDepartement(new Departement());
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
        professeur.setDepartement(new Departement());
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
        employeur.setDepartement(new Departement());
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

    @Test
    void testDeleteUtilisateur_Admin_Success() {
        Long id = 1L;
        Admin admin = new Admin();
        admin.setId(id);
        admin.setCredentials(new Credentials("admin@example.com", "password123", Role.ADMIN));

        when(adminRepository.findById(id)).thenReturn(Optional.of(admin));

        utilisateurService.deleteUtilisateur(id, Role.ADMIN);

        verify(adminRepository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteUtilisateur_Admin_NotFound() {
        Long adminId = 1L;
        when(adminRepository.findById(adminId)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.deleteUtilisateur(adminId, Role.ADMIN);
        });

        assertEquals("Admin avec ID: " + adminId + " n'existe pas", exception.getMessage());
        verify(adminRepository).findById(adminId);
    }

    // ------------------- GET ALL UTILISATEURS ------------------- //

    @Test
    void testGetUtilisateurs() {

        Etudiant etudiant1 = new Etudiant();
        etudiant1.setCredentials(new Credentials("etudiant1@example.com", "password123", Role.ETUDIANT));
        etudiant1.setDepartement(new Departement());
        Etudiant etudiant2 = new Etudiant();
        etudiant2.setCredentials(new Credentials("etudiant2@example.com", "password123", Role.ETUDIANT));
        etudiant2.setDepartement(new Departement());
        List<Etudiant> etudiants = List.of(etudiant1,etudiant2);
        when(etudiantRepository.findAll()).thenReturn(etudiants);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs(Role.ETUDIANT);

        assertEquals(2, utilisateurs.size());
    }

    @Test
    void testGetUtilisateurs_Professeur() {
        Professeur professeur1 = new Professeur();
        professeur1.setCredentials(new Credentials("professeur1@example.com", "password123", Role.PROFESSEUR));
        professeur1.setDepartement(new Departement());
        Professeur professeur2 = new Professeur();
        professeur2.setCredentials(new Credentials("professeur2@example.com", "password123", Role.PROFESSEUR));
        professeur2.setDepartement(new Departement());

        List<Professeur> professeurs = List.of(professeur1, professeur2);
        when(professeurRepository.findAll()).thenReturn(professeurs);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs(Role.PROFESSEUR);

        assertEquals(2, utilisateurs.size());
    }

    @Test
    void testGetUtilisateurs_Admin() {
        Admin admin1 = new Admin();
        admin1.setCredentials(new Credentials("admin1@example.com", "password123", Role.ADMIN));
        Admin admin2 = new Admin();
        admin2.setCredentials(new Credentials("admin2@example.com", "password123", Role.ADMIN));

        List<Admin> admins = List.of(admin1, admin2);
        when(adminRepository.findAll()).thenReturn(admins);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs(Role.ADMIN);

        assertEquals(2, utilisateurs.size());
    }

    @Test
    void testGetUtilisateurs_Employeur() {

        Employeur employeur1 = new Employeur();
        employeur1.setCredentials(new Credentials("employeur1@example.com", "password123", Role.EMPLOYEUR));
        employeur1.setDepartement(new Departement());

        Employeur employeur2 = new Employeur();
        employeur2.setCredentials(new Credentials("employeur2@example.com", "password123", Role.EMPLOYEUR));
        employeur2.setDepartement(new Departement());

        List<Employeur> employeurs = List.of(employeur1,employeur2);
        when(employeurRepository.findAll()).thenReturn(employeurs);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs(Role.EMPLOYEUR);

        assertEquals(2, utilisateurs.size());
    }

    // ------------------- VALID ROLE ------------------- //

    @Test
    void testIsValidRole() {
        assertTrue(utilisateurService.isValidRole("ETUDIANT"));
        assertFalse(utilisateurService.isValidRole("InvalidRole"));
    }
    
    @Test
    void testGetUtilisateurByToken_Etudiant() {
        String token = "Bearer validToken";
        String email = "etudiant@example.com";
        Etudiant etudiant = new Etudiant();
        etudiant.setId(1L);
        etudiant.setCredentials(new Credentials(email, "password123", Role.ETUDIANT));
        etudiant.setDepartement(new Departement());

        when(jwtTokenProvider.getEmailFromJWT("validToken")).thenReturn(email);
        when(utilisateurRepository.findByEmail(email)).thenReturn(etudiant);
        when(etudiantRepository.findById(1L)).thenReturn(Optional.of(etudiant));
        
        UtilisateurDTO result = utilisateurService.getUtilisateurByToken(token);
        
        assertNotNull(result);
        assertEquals(email, result.getEmail());
    }
    
    @Test
    void testGetUtilisateurByToken_Employeur() {
        String token = "Bearer validToken";
        String email = "employeur@example.com";
        Employeur employeur = new Employeur();
        employeur.setId(1L);
        employeur.setCredentials(new Credentials(email, "password123", Role.EMPLOYEUR));
        employeur.setDepartement(new Departement());
        when(jwtTokenProvider.getEmailFromJWT("validToken")).thenReturn(email);
        when(utilisateurRepository.findByEmail(email)).thenReturn(employeur);
        when(employeurRepository.findById(1L)).thenReturn(Optional.of(employeur));
        
        UtilisateurDTO result = utilisateurService.getUtilisateurByToken(token);
        
        assertNotNull(result);
        assertEquals(email, result.getEmail());
    }
    
    @Test
    void testGetUtilisateurByToken_Professeur() {
        String token = "Bearer validToken";
        String email = "professeur@example.com";
        Professeur professeur = new Professeur();
        professeur.setId(1L);
        professeur.setCredentials(new Credentials(email, "password123", Role.PROFESSEUR));
        professeur.setDepartement(new Departement());
        when(jwtTokenProvider.getEmailFromJWT("validToken")).thenReturn(email);
        when(utilisateurRepository.findByEmail(email)).thenReturn(professeur);
        when(professeurRepository.findById(1L)).thenReturn(Optional.of(professeur));
        
        UtilisateurDTO result = utilisateurService.getUtilisateurByToken(token);
        
        assertNotNull(result);
        assertEquals(email, result.getEmail());
    }

    // Test non fonctionnel
    @Test
    void testGetUtilisateurByToken_InvalidRole() {
        String token = "Bearer validToken";
        String email = "admin@example.com";
        Utilisateur invalidUser = mock(Utilisateur.class);
        invalidUser.setDepartement(new Departement());
        when(jwtTokenProvider.getEmailFromJWT("validToken")).thenReturn(email);
        when(utilisateurRepository.findByEmail(email)).thenReturn(invalidUser);
        when(invalidUser.getRole()).thenReturn(null);

        assertThrows(NullPointerException.class, () -> {
            utilisateurService.getUtilisateurByToken(token);
        });
    }
    
    @Test
    void testValidationToken_ValidToken() {
        String token = "validToken";
        doNothing().when(jwtTokenProvider).validateToken(token);
        boolean result = utilisateurService.validationToken(token);
        assertTrue(result);
    }
    
    @Test
    void testValidationToken_InvalidToken() {
        String token = "invalidToken";
        doThrow(new InvalidJwtTokenException(HttpStatus.BAD_REQUEST, "Invalid token")).when(jwtTokenProvider).validateToken(token);
        boolean result = utilisateurService.validationToken(token);
        assertFalse(result);
    }

    @Test
    void testFindById_Admin_Success() {
        Long adminId = 1L;
        Admin admin = new Admin();
        admin.setId(adminId);
        when(adminRepository.findById(adminId)).thenReturn(Optional.of(admin));

        Admin result = adminRepository.findById(adminId).orElse(null);

        assertNotNull(result);
        assertEquals(adminId, result.getId());
        verify(adminRepository).findById(adminId);
    }
}