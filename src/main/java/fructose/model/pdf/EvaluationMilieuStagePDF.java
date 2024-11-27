package fructose.model.pdf;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import fructose.model.Utilisateur;
import fructose.model.evaluation.CritereEvaluation;
import fructose.model.evaluation.EvaluationMilieuStage;
import fructose.model.evaluation.SectionEvaluation;

import java.io.FileOutputStream;
import java.time.format.DateTimeFormatter;

public class EvaluationMilieuStagePDF {

    public static void generatePdf(EvaluationMilieuStage evaluation, String dest) {

        // Create critere and section tables
        SectionEvaluation section1 = new SectionEvaluation();
        section1.setName("Évaluation");

        CritereEvaluation critere1 = new CritereEvaluation();
        critere1.setQuestion("Les tâches confiées au stagiaire sont conformes aux tâches annoncées dans l’entente de stage.");
        section1.addCritere(critere1);

        CritereEvaluation critere2 = new CritereEvaluation();
        critere2.setQuestion("Des mesures d’accueil facilitent l’intégration du nouveau stagiaire.");
        section1.addCritere(critere2);

        CritereEvaluation critere3 = new CritereEvaluation();
        critere3.setQuestion("Le temps réel consacré à l’encadrement du stagiaire est suffisant.\nPréciser le nombre d’heures/semaine :\nPremier mois : ____________\nDeuxième mois : __________\nTroisième mois : ___________");
        section1.addCritere(critere3);

        CritereEvaluation critere4 = new CritereEvaluation();
        critere4.setQuestion("L’environnement de travail respecte les normes d’hygiène et de sécurité au travail.");
        section1.addCritere(critere4);

        CritereEvaluation critere5 = new CritereEvaluation();
        critere5.setQuestion("Le climat de travail est agréable.");
        section1.addCritere(critere5);

        CritereEvaluation critere6 = new CritereEvaluation();
        critere6.setQuestion("Le milieu de stage est accessible par transport en commun.");
        section1.addCritere(critere6);

        CritereEvaluation critere7 = new CritereEvaluation();
        critere7.setQuestion("Le salaire offert est intéressant pour le stagiaire.\nPréciser : _______________ /l’heure.");
        section1.addCritere(critere7);

        CritereEvaluation critere8 = new CritereEvaluation();
        critere8.setQuestion("La communication avec le superviseur de stage facilite le déroulement du stage.");
        section1.addCritere(critere8);

        CritereEvaluation critere9 = new CritereEvaluation();
        critere9.setQuestion("L’équipement fourni est adéquat pour réaliser les tâches confiées.");
        section1.addCritere(critere9);

        CritereEvaluation critere10 = new CritereEvaluation();
        critere10.setQuestion("Le volume de travail est acceptable.");
        section1.addCritere(critere10);

        try {
            // Initialize PDF writer and document
            PdfWriter writer = new PdfWriter(new FileOutputStream(dest));
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            Utilisateur employeur = evaluation.getCandidature().getOffreStage().getOwner();

            // Title section
            document.add(new Paragraph("Alternance travail-études").setTextAlignment(TextAlignment.CENTER).setBold().setFontSize(14));
            document.add(new Paragraph("\nÉVALUATION DU MILIEU DE STAGE").setTextAlignment(TextAlignment.CENTER).setBold().setFontSize(18));

            // Section: Identification de l’entreprise
            document.add(new Paragraph("\nIDENTIFICATION DE L’ENTREPRISE").setBold().setFontSize(12));
            Table entrepriseTable = new Table(UnitValue.createPercentArray(new float[]{1, 3})).useAllAvailableWidth();
            entrepriseTable.addCell("Nom de l’entreprise :").addCell(employeur.getCompanyName());
            entrepriseTable.addCell("Personne contact :").addCell(employeur.getFullName());
            entrepriseTable.addCell("Adresse :").addCell("Adresse Entreprise");
            entrepriseTable.addCell("Ville :").addCell("Ville Entreprise");
            document.add(entrepriseTable);

            // Section: Identification du stagiaire
            document.add(new Paragraph("\nIDENTIFICATION DU STAGIAIRE").setBold().setFontSize(12));
            Table stagiaireTable = new Table(UnitValue.createPercentArray(new float[]{1, 3})).useAllAvailableWidth();
            stagiaireTable.addCell("Nom du stagiaire :").addCell(evaluation.getCandidature().getEtudiant().getFullName());
            stagiaireTable.addCell("Date du stage :").addCell(evaluation.getCandidature().getOffreStage().getDateDebut() + " - " + evaluation.getCandidature().getOffreStage().getDateFin());
            stagiaireTable.addCell("Stage (encercler) :").addCell(evaluation.getStageType().name());
            document.add(stagiaireTable);

            // Section: Évaluation
            document.add(new Paragraph("\nÉVALUATION").setBold().setFontSize(12));
            for (SectionEvaluation section : evaluation.getSections()) {
                document.add(new Paragraph(section.getName()).setBold());

                Table criteresTable = new Table(UnitValue.createPercentArray(new float[]{4, 1})).useAllAvailableWidth();
                criteresTable.addHeaderCell("Critère");
                criteresTable.addHeaderCell("Réponse");

                for (CritereEvaluation critere : section.getCriteres()) {
                    criteresTable.addCell(critere.getQuestion());
                    criteresTable.addCell(critere.getReponse().getLabel());
                }
                document.add(criteresTable);
                document.add(new Paragraph("\nCOMMENTAIRES").setBold().setFontSize(12));
                document.add(new Paragraph(section.getCommentaireSection()));
            }

            // Section: Observations générales
            document.add(new Paragraph("\nOBSERVATIONS GÉNÉRALES").setBold().setFontSize(12));
            Table observationsTable = new Table(UnitValue.createPercentArray(new float[]{2, 3})).useAllAvailableWidth();
            observationsTable.addCell("Milieu à privilégier pour :").addCell(evaluation.getMilieuStageAPrivilegierPour().name());
            observationsTable.addCell("Capacité de stagiaires :").addCell(evaluation.getCapaciteEtudiant().name());
            observationsTable.addCell("Mêmes stagiaires pour prochain stage :").addCell(evaluation.isMemeStagiaireProchainStage() ? "OUI" : "NON");
            document.add(observationsTable);

            // Section: Signature
            document.add(new Paragraph("\nSIGNATURE").setBold().setFontSize(12));
            Table signatureTable = new Table(UnitValue.createPercentArray(new float[]{1, 3})).useAllAvailableWidth();
            signatureTable.addCell("Signature de l’enseignant :").addCell(evaluation.getSignatureSuperviseur());
            signatureTable.addCell("Date :").addCell(evaluation.getDateSignatureSuperviseur().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            document.add(signatureTable);

            // Close document
            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}