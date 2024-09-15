package fructose.service;

import fructose.model.Etudiant;
import fructose.model.Utilisateur;
import fructose.repository.EtudiantRepository;
import fructose.service.dto.EtudiantDTO;
import fructose.service.dto.UtilisateurDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
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

    @Test
    void testLogin_Success() {
        String matricule = "1234567";
        String password = "PourquoiMoi?123";
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setMatricule(matricule);
        utilisateur.setPassword(password);
        UtilisateurDTO result = utilisateurService.login(matricule, password);

        assertNotNull(result);
    }
}