package com.planmanager.www.model.propostas;

public enum Eixo {
    UM("PROMOÇÃO DOS DIREITOS DE CRIANÇAS E ADOLESCENTES"),
    DOIS("PROTEÇÃO E DEFESA DOS DIREITOS"),
    TRES("PROTAGONISMO E PARTICIPAÇÃO DE CRIANÇAS E ADOLESCENTES"),
    QUATRO("CONTROLE SOCIAL DA EFETIVAÇÃO DOS DIREITOS"),
    CINCO("GESTÃO DA POLÍTICA NACIONAL DOS DIREITOS HUMANOS DE CRIANÇAS E ADOLESCENTES"),
    SEIS("GESTÃO DA POLÍTICA NACIONAL DOS DIREITOS HUMANOS DE CRIANÇAS E ADOLESCENTES");

    private final String titulo;

    Eixo(String titulo) {
        this.titulo = titulo;
    }

    public String getTitulo() {
        return titulo;
    }
}
