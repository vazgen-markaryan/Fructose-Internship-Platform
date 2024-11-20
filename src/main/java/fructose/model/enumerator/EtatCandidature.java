package fructose.model.enumerator;

public enum EtatCandidature {
	// Phase de candidature initiale
	EN_ATTENTE,                                                    // Nouvelle candidature en attente de traitement par l'employeur
	
	// Phase de décision de l'employeur
	REFUSEE,                                                           // Candidature refusée par l'employeur avant entrevue
	ENTREVUE_PROPOSE,                                     // Candidature approuvée, et doit accepter ou rejeter la Date d'Entrevue Porposé
	
	// Phase de décision de l'étudiant
	ENTREVUE_ACCEPTE_ETUDIANT,                // En entrevue avec l'employeur
	ENTREVUE_REFUSE_ETUDIANT,                  // Étudiant refuse de poursuivre ce stage car il aime pas la date d'Entrevue
	
	// Phase d'après l'entrevue
	ACCEPTE_APRES_ENTREVUE,                         // Offre accepte par l'employeur après entrevue
	REFUSEE_APRES_ENTREVUE,                         // Offre refusée par l'étudiant après entrevue
	CONTRAT_SIGNE_EMPLOYEUR,                     // Contrat signé par l'employeur et proposé à l'étudiant
	
	// Phase de décision de l'étudiant
	CONTRAT_SIGNE_ETUDIANT,                        // Offre acceptée par l'étudiant et attend la signature du professeur
	CONTRAT_REFUSE_ETUDIANT,                    // Offre refusée par l'étudiant
	
	// Phase de fin de processus
	CONTRAT_SIGNE_TOUS,                                // Contrat signé par tous et le procès est terminé
}