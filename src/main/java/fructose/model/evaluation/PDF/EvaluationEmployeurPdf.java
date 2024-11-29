package fructose.model.evaluation.PDF;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import fructose.model.evaluation.CritereEvaluation;
import fructose.model.evaluation.EvaluationEmployeur;
import fructose.model.evaluation.SectionEvaluation;
import fructose.service.dto.UtilisateurDTO;

import java.util.Date;


public class EvaluationEmployeurPdf {

    private final EvaluationEmployeur evaluation;
    private UtilisateurDTO etudiantDTO;

    public EvaluationEmployeurPdf(EvaluationEmployeur evaluation, UtilisateurDTO etudiantDTO) {
        this.evaluation = evaluation;
        this.etudiantDTO = etudiantDTO;
    }

    public String createPdf() {
        String dest = "evaluation_stagiaire_" + ".pdf";

        try {
            PdfWriter writer = new PdfWriter(dest);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("FICHE D’ÉVALUATION DU STAGIAIRE").setBold().setFontSize(16));

            document.add(new Paragraph("Nom de l'élève : " + etudiantDTO.getFullName()));
            document.add(new Paragraph("Programme d’études :" + etudiantDTO.getDepartementDTO().getNom()));
            document.add(new Paragraph("Nom de l’entreprise : " + evaluation.getCandidature().getOffreStage().getCompagnie()));
            document.add(new Paragraph("Nom du superviseur : " + evaluation.getCandidature().getOffreStage().getOwner().getFullName()));
            document.add(new Paragraph("Fonction : " + evaluation.getCandidature().getOffreStage().getNom()));

            for (SectionEvaluation section : evaluation.getSections()) {
                document.add(new Paragraph("\n" + section.getName().toUpperCase()).setBold());

                Table table = new Table(2);
                table.addCell("Critère");
                table.addCell("Réponse");

                for (CritereEvaluation critere : section.getCriteres()) {
                    table.addCell(critere.getQuestion());
                    table.addCell(critere.getReponse().getLabel());
                }
                document.add(table);

                document.add(new Paragraph("Commentaires : " + (section.getCommentaire().isEmpty() ? "N/A" : section.getCommentaire())));
            }

            document.add(new Paragraph("\nAPPRÉCIATION GLOBALE DU STAGIAIRE").setBold());
            document.add(new Paragraph("Les habiletés démontrées : " + evaluation.getAppreciationGlobale()));
            document.add(new Paragraph("Commentaires : " + (evaluation.getCommentaireAppreciationGlobale().isEmpty() ? "N/A" : evaluation.getCommentaireAppreciationGlobale())));

            document.add(new Paragraph("\nNombre d’heures d’encadrement : " + evaluation.getNombreHeureEncadrement()));
            document.add(new Paragraph("L'entreprise souhaite accueillir l'élève pour un prochain stage : " + (evaluation.getAcceuilleEleveProchainStage())));

            document.add(new Paragraph("\nNom : " + evaluation.getCandidature().getOffreStage().getOwner().getFullName()));
            document.add(new Paragraph("Signature : " + evaluation.getSignature()));
            document.add(new Paragraph("Date : " +new Date() ));

            document.close();
            return dest;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("PDF creation failed: " + e.getMessage());
        }
    }
}
