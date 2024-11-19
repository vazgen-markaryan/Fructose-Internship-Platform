package fructose.model;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;

public class ContratPdf {

    private final Contrat contrat;

    public ContratPdf(Contrat contrat) {
        this.contrat = contrat;
    }
    
    public String returnPdf() {
        OffreStage offreStage = contrat.getCandidature().getOffreStage();
        Utilisateur employeur = offreStage.getOwner();
        Utilisateur etudiant = contrat.getCandidature().getEtudiant();
        Utilisateur gestionnaire = contrat.getGestionnaire();
        
        String dest = "contract_stage" + contrat.getCandidature().getId() + ".pdf";
        try {
            PdfWriter writer = new PdfWriter(dest);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // Add content
            document.add(new Paragraph("Le gestionnaire de stage: " + gestionnaire.getFullName()));
            document.add(new Paragraph("L'employeur: " + employeur.getFullName()));
            document.add(new Paragraph("L'étudiant(e): " + etudiant.getFullName()));
            
            Table table = new Table(2);
            table.addCell("ENDROIT DU STAGE");
            table.addCell(offreStage.getAdresse());
            table.addCell("DUREE DU STAGE");
            table.addCell("Date de début: " + offreStage.getDateDebut() + "\nDate de fin: " + offreStage.getDateFin() +
                    "\nNombre total de semaines: " + offreStage.getDureeEnSemaines());
            table.addCell("HORAIRE DE TRAVAIL");
            table.addCell("Horaire de travail: " + offreStage.getTypeEmploi() + ", " + offreStage.getModaliteTravail() +
                    "\nNombre total d'heures par semaine: " + offreStage.getNombreHeuresSemaine() + "h");
            table.addCell("SALAIRE");
            table.addCell("Salaire horaire: " + offreStage.getTauxHoraire() + "$");
            document.add(table);
            
            document.add(new Paragraph("TACHES ET RESPONSABILITES DU STAGIAIRE"));
            document.add(new Paragraph(offreStage.getDescription()));
            document.add(new Paragraph("RESPONSABILITES"));
            document.add(new Paragraph("Le Collège s'engage à:\n..."));
            document.add(new Paragraph("L’entreprise s’engage à:\n..."));
            document.add(new Paragraph("L’étudiant s’engage à:\n..."));
            document.add(new Paragraph("SIGNATURES"));
            document.add(new Paragraph("Signature de l’étudiant(e): " + (contrat.getSignatureEtudiant() != null ? contrat.getSignatureEtudiant() : "_______________________")+  "\n " +  "Date de signature : "  + (contrat.getDateSignatureEmployeur() != null ? contrat.getDateSignatureEtudiant() : "_______________________")));
            document.add(new Paragraph("Signature de l’employeur: " + (contrat.getSignatureEmployeur() != null ? contrat.getSignatureEmployeur() : "_______________________") +  "\n " + "Date de signature : "  + (contrat.getDateSignatureEmployeur() != null ? contrat.getDateSignatureEmployeur() : "_______________________")));
            document.add(new Paragraph("Signature du gestionnaire de stage: " + (contrat.getSignatureGestionnaire() != null ? contrat.getSignatureGestionnaire() : "_______________________") +  "\n " +  " Date de signature : " + (contrat.getDateSignatureGestionnaire() != null ? contrat.getDateSignatureGestionnaire().toString() : "_______________________")));
            
            document.close();
            System.out.println("PDF created successfully!");
            return dest; // Return the file path
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("PDF creation failed: " + e.getMessage());
        }
    }

    
    }