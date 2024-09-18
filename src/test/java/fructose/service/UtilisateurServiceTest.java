package fructose.service;

import fructose.model.Etudiant;
import fructose.model.Utilisateur;
import fructose.repository.EtudiantRepository;
import fructose.repository.UtilisateurRepository;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.UtilisateurDTO;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
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

    private Utilisateur utilisateur;

    @BeforeEach
    public void setUp() {
        utilisateur = Utilisateur.createUtilisateur("Etudiant", "Vazgen Markaryan", "vazgen@gmail.com", "Vazgen123!", "(123) 456-7890", "1234 rue Pomme", "1111111", "Etudiant");
        utilisateur.setPassword(new BCryptPasswordEncoder().encode(utilisateur.getPassword()));
        reset(utilisateurRepository, passwordEncoder);
    }

    @Test
    public void test_successful_login_with_correct_matricule_and_password() {
        String password = "Vazgen123!";
        when(utilisateurRepository.findByMatricule("1111111")).thenReturn(utilisateur);
        doReturn(true).when(passwordEncoder).matches(password, utilisateur.getPassword());

        UtilisateurDTO result = utilisateurService.login(utilisateur.getMatricule(), password);
        System.out.println(result);

        assertNotNull(result);
        assertEquals(utilisateur.getMatricule(), result.getMatricule());
        verify(utilisateurRepository).findByMatricule(utilisateur.getMatricule());
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
    void testUpdateUtilisateur_Success() {
        Long id = 1L;
        EtudiantDTO utilisateurDTO = new EtudiantDTO();
        utilisateurDTO.setId(id);
        Etudiant etudiant = new Etudiant();
        etudiant.setId(id);
        when(etudiantRepository.existsById(id)).thenReturn(true);
        when(etudiantRepository.save(any(Etudiant.class))).thenReturn(etudiant);

        utilisateurService.updateUtilisateur(utilisateurDTO, "Etudiant");

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
    public void test_login_with_incorrect_matricule() {
        String matricule = "1234567";
        String password = "CorrectPassword1!";
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setMatricule(matricule);
        utilisateur.setPassword(new BCryptPasswordEncoder().encode(password));

        when(utilisateurRepository.findByMatricule(matricule)).thenReturn(null);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.login(matricule, password);
        });

        assertEquals("L'étudiant avec matricule 1234567 n'existe pas", exception.getMessage());
    }

    @Test
    public void test_login_with_incorrect_password() {
        when(utilisateurRepository.findByMatricule(utilisateur.getMatricule())).thenReturn(utilisateur);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            utilisateurService.login(utilisateur.getMatricule(), "IncorrectPassword1!");
        });

        assertEquals("Mot de passe incorrect", exception.getMessage());
    }
}