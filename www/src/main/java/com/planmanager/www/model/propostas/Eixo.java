package com.planmanager.www.model.propostas;

public enum Eixo {
    UM("Promoção dos Direitos de Crianças e Adolescentes"),
    DOIS("Proteção e Defesa dos Direitos"),
    TRES("Protagonismo e Participação de Crianças e Adolescentes"),
    QUATRO("Controle Social da Efetivação dos Direitos"),
    CINCO("Gestão da Política Nacional dos Direitos Humanos de Crianças e Adolescentes"),
    SEIS("Gestão da Política Nacional dos Direitos Humanos de Crianças e Adolescentes");

    private final String titulo;

    Eixo(String titulo) {
        this.titulo = titulo;
    }

    public String getTitulo() {
        return titulo;
    }
}