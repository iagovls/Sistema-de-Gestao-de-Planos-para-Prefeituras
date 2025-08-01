package com.planmanager.www.model.propostas;

public enum Plano {
    UM("Plano Municipal de Promoção, Proteção e Defesa do Direito de Convivência Familiar e Comunitária de Crianças e Adolescentes"),
    DOIS("Plano da Primeira Infância"),
    TRES("Plano de Prevenção e Erradicação do Trabalho Infantil e Proteção ao Adolescente Trabalhador"),
    QUATRO("Plano de Enfrentamento da Violência Sexual contra Crianças e Adolescentes"),
    CINCO("Plano Municipal de Atendimento Socioeducativo"),
    SEIS("Plano Municipal de Prevenção e Atendimento de Crianças e Adolescentes Vítimas ou Testemunhas de Violência");

    private final String titulo;

    Plano(String titulo) {
        this.titulo = titulo;
    }

    public String getTitulo() {
        return titulo;
    }
}