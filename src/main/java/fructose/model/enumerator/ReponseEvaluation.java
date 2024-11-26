package fructose.model.enumerator;

public enum ReponseEvaluation {
    TOTAL_AGREE("Totalement en accord"),
    MOSTLY_AGREE("Plutôt en accord"),
    MOSTLY_DISAGREE("Plutôt en désaccord") ,
    TOTAL_DISAGREE("Totalement en désaccord");

    private final String label;

    ReponseEvaluation(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
