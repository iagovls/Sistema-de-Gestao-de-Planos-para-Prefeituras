package com.planmanager.www.model.propostas;

public enum Categoria {
    ASSISTENCIA_SOCIAL("Assistência Social"),
    EDUCACAO("Educação"),
    CULTURA("Cultura"),
    ESPORTE("Esporte"),
    MEIO_AMBIENTE("Meio Ambiente"),
    SAUDE("Saúde"),
    DESENVOLVIMENTO_ECONOMICO("Desenvolvimento Econômico"),
    CONSELHO_TUTELAR("Conselho Tutelar"),
    JUSTICA("Sistema de Justiça: Defensoria, Promotoria e Vara da Infância e Juventude"),
    CMDCA("Conselho Municipal dos Direitos da Criança e do Adolescente");

    private final String titulo;

    Categoria(String titulo) {
        this.titulo = titulo;
    }

    public String getTitulo() {
        return titulo;
    }
}
