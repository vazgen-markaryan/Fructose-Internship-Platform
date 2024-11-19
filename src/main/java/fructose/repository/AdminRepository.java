package fructose.repository;

import fructose.model.Admin;

public interface AdminRepository extends UtilisateurRepository<Admin, Long> {
	Admin findByEmail(String email);
}