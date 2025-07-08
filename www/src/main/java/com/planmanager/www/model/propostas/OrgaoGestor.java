package com.planmanager.www.model.propostas;

public enum OrgaoGestor {
    GESTAO("Gestão"),
    ADMINISTRACAO("Administração"),
    CMDCA("CMDCA"),
    SEMAS("SEMAS"),
    CONTROLE_SOCIAL("Controle Social"),
    SGD("SGD"),
    CT("CT"),
    CAMARA_MUNICIPAL("Camara Municipal"),
    SEMDS("SEMDS"),
    JUSTICA("Justiça (Vara da Infância e Juventude)"),
    ASSISTENCIA_SOCIAL("Assistência Social"),
    ESPORTE("Esporte"),
    CULTURA("Cultura"),
    EDUCACAO("Educação"),
    SECRETARIA_DE_DESENVOLVIMENTO_ECONOMICO("Secretaria de Desenvolvimento Econômico"),
    SECRETARIA_DE_DESENVOLVIMENTO_SOCIAL("Secretaria de Desenvolvimento Social"),
    SECRETARIA_DE_INFRAESTRUTURA("Secretaria de Infraestrutura"),
    SECRETARIA_DE_EDUCACAO("Secretaria de Educação"),
    CREAS("CREAS"),
    SAUDE("Saúde"),
    DIRETORIA_DE_MEIO_AMBIENTE("Diretoria de Meio Ambiente"),
    MEIO_AMBIENTE("Meio Ambiente");

    private final String titulo;

    OrgaoGestor(String titulo) {
        this.titulo = titulo;
    }

    public String getTitulo() {
        return titulo;
    }
}
