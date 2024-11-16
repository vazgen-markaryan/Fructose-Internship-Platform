package fructose.model;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

public class ContratPdf {
    public static void main(String[] args) {
        try {
            String dest = "contract_stage.pdf"; // Output file name
            PdfWriter writer = new PdfWriter(dest);
            // Initialize the PDF document
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            // Add title
            document.add(new Paragraph("CONTRAT DE STAGE").setBold().setFontSize(20));
            // Add introduction
            document.add(new Paragraph("ENTENTE DE STAGE INTERVENUE ENTRE LES PARTIES SUIVANTES"));
            // Add placeholders
            document.add(new Paragraph("Le gestionnaire de stage: [nom_gestionnaire]"));
            document.add(new Paragraph("L'employeur: [nom_employeur]"));
            document.add(new Paragraph("L'étudiant(e): [nom_etudiant]"));
            // Add internship details in a table
            Table table = new Table(2);
            table.addCell("ENDROIT DU STAGE");
            table.addCell("[offre_lieuStage]");
            table.addCell("DUREE DU STAGE");
            table.addCell("Date de début: xx\nDate de fin: xx\nNombre total de semaines: xx");
            table.addCell("HORAIRE DE TRAVAIL");
            table.addCell("Horaire de travail: xx\nNombre total d'heures par semaine: xxh");
            table.addCell("SALAIRE");
            table.addCell("Salaire horaire: [offre_tauxHoraire]");
            document.add(table);
            // Add description
            document.add(new Paragraph("TACHES ET RESPONSABILITES DU STAGIAIRE"));
            document.add(new Paragraph("[offre_description]"));
            // Add responsibilities
            document.add(new Paragraph("RESPONSABILITES"));
            document.add(new Paragraph("Le Collège s'engage à:\n..."));
            document.add(new Paragraph("L’entreprise s’engage à:\n..."));
            document.add(new Paragraph("L’étudiant s’engage à:\n..."));
            // Add signature fields
            document.add(new Paragraph("SIGNATURES"));
            document.add(new Paragraph("L’étudiant(e):\n\n[signature_etudiant]\n[date_signature_etudiant]\n[nom_etudiant]"));
            document.add(new Paragraph("L’employeur:\n\n[signature_employeur]\n[date_signature_employeur]\n[nom_employeur]"));
            document.add(new Paragraph("Le gestionnaire de stage:\n\n[signature_gestionnaire]\n[date_signature_gestionnaire]\n[nom_gestionnaire]"));
            // Close the document
            document.close();
            System.out.println("PDF created successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

