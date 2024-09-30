package fructose.model.auth;

import java.util.HashSet;
import java.util.Set;

public enum Role{
	ETUDIANT("ROLE_ETUDIANT"),
	EMPLOYEUR("ROLE_EMPLOYEUR"),
	PROFESSEUR("ROLE_PROFESSEUR"),
	ADMIN("ROLE_ADMIN"),
	;

	private final String string;
	private final Set<Role> managedRoles = new HashSet<>();

	static{
		ADMIN.managedRoles.add(ETUDIANT);
		ADMIN.managedRoles.add(EMPLOYEUR);
		ADMIN.managedRoles.add(PROFESSEUR);
	}

	Role(String string){
		this.string = string;
	}

	@Override
	public String toString(){
		return string;
	}

}
