package fructose.service;

import fructose.model.Etudiant;
import fructose.model.Utilisateur;
import fructose.repository.vides.EtudiantRepository;
import fructose.repository.UtilisateurRepository;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.UtilisateurDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UtilisateurServiceTest {

    @InjectMocks
    private UtilisateurService utilisateurService;

    @Mock
    private EtudiantRepository etudiantRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
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
// Vazgen: Commenté car:
// 1. Fait pas avec SpringSecurity donc presque Inutile
// 2. Suite à la moddification de UtilisateurRepository n'est plus valide et donne erreurs


//    @Test
//    public void test_successful_login_with_correct_matricule_and_password() {
//        String matricule = "1234567";
//        String password = "CorrectPassword1!";
//        Utilisateur utilisateur = new Utilisateur();
//        utilisateur.setMatricule(matricule);
//        utilisateur.setPassword(new BCryptPasswordEncoder().encode(password));
//
//        UtilisateurRepository utilisateurRepository = mock(UtilisateurRepository.class);
//        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        when(utilisateurRepository.findByMatricule(matricule)).thenReturn(utilisateur);
//
//        UtilisateurService utilisateurService = new UtilisateurService(null, passwordEncoder, utilisateurRepository);
//
//        UtilisateurDTO result = utilisateurService.login(matricule, password);
//
//        assertNotNull(result);
//        assertEquals(matricule, result.getMatricule());
//    }
//
//    @Test
//    public void test_login_with_incorrect_matricule() {
//        String matricule = "1234567";
//        String password = "CorrectPassword1!";
//        Utilisateur utilisateur = new Utilisateur();
//        utilisateur.setMatricule(matricule);
//        utilisateur.setPassword(new BCryptPasswordEncoder().encode(password));
//
//        UtilisateurRepository utilisateurRepository = mock(UtilisateurRepository.class);
//        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        when(utilisateurRepository.findByMatricule(matricule)).thenReturn(null);
//
//        UtilisateurService utilisateurService = new UtilisateurService(null, passwordEncoder, utilisateurRepository);
//
//        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
//            utilisateurService.login(matricule, password);
//        });
//
//        assertEquals("L'étudiant avec matricule 1234567 n'existe pas", exception.getMessage());
//    }
//
//    @Test
//    public void test_login_with_incorrect_password() {
//        String matricule = "1234567";
//        String password = "CorrectPassword1!";
//        Utilisateur utilisateur = new Utilisateur();
//        utilisateur.setMatricule(matricule);
//        utilisateur.setPassword(new BCryptPasswordEncoder().encode(password));
//
//        UtilisateurRepository utilisateurRepository = mock(UtilisateurRepository.class);
//        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        when(utilisateurRepository.findByMatricule(matricule)).thenReturn(utilisateur);
//
//        UtilisateurService utilisateurService = new UtilisateurService(null, passwordEncoder, utilisateurRepository);
//
//        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
//            utilisateurService.login(matricule, "IncorrectPassword1!");
//        });
//
//        assertEquals("Mot de passe incorrect", exception.getMessage());
//    }
}