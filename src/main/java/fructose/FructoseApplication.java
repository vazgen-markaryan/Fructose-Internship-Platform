package fructose;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FructoseApplication {
	public static void main(String[] args) {
		SpringApplication.run(FructoseApplication.class, args);
		
//		TO RUN THE APPLICATION:
//		1. Run this file
//		2. Go to CMD, Change Directory into front-end/fructose and run "npm start"
//		3. Go to browser and type "localhost:3000"


//		Connexion à la BD avec console
//		psql -U team24 -d fructose
//		user team24
//		password team24
//		team 24 est SUPERUSER

//		package.json a été modifié. Le proxy sur la ligne 5 est ajouté pour le future redirect
	}
}
