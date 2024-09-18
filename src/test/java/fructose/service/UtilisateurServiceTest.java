package fructose.service;

import fructose.model.Etudiant;
import fructose.model.Utilisateur;
import fructose.repository.vides.EtudiantRepository;
import fructose.repository.UtilisateurRepository;
import fructose.service.dto.EtudiantDTO;
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
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        utilisateurService = new UtilisateurService(etudiantRepository, null, null, passwordEncoder, utilisateurRepository);
    }

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
    void testGetUtilisateurById_Success() {
        Long id = 1L;
        Etudiant etudiant = new Etudiant();
        etudiant.setId(id);
        when(etudiantRepository.findById(id)).thenReturn(Optional.of(etudiant));

        UtilisateurDTO result = utilisateurService.getUtilisateurById(id, "Etudiant");
        assertNotNull(result);
    }

    @Test
    void testGetUtilisateurById_NotFound() {
        Long id = 1L;
        when(etudiantRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.getUtilisateurById(id, "Etudiant");
        });
    }

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
    void testDeleteUtilisateur_Success() {
        Long id = 1L;
        Etudiant etudiant = new Etudiant();
        etudiant.setId(id);
        when(etudiantRepository.findById(id)).thenReturn(Optional.of(etudiant));

        utilisateurService.deleteUtilisateur(id, "Etudiant");

        verify(etudiantRepository, times(1)).deleteById(id);
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


    @Test
    void testGetUtilisateurs() {
        List<Etudiant> etudiants = List.of(new Etudiant(), new Etudiant());
        when(etudiantRepository.findAll()).thenReturn(etudiants);

        List<UtilisateurDTO> utilisateurs = utilisateurService.getUtilisateurs("Etudiant");

        assertEquals(2, utilisateurs.size());
    }

    @Test
    void testIsValidRole() {
        assertTrue(utilisateurService.isValidRole("Etudiant"));
        assertFalse(utilisateurService.isValidRole("InvalidRole"));
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
}