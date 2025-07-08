package com.planmanager.www.model.propostas;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;


@Entity
@Table(name = "propostas")
public class Proposta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "meta")
    private Date meta;

    @Column(name = "status")
    private StatusProposta status;

    @Column(name = "plano")
    private Plano plano;

    @Column(name = "eixo")
    private Eixo eixo;

    @Column(name = "categoria")
    private Categoria categoria;

    @Column(name = "data_criacao")
    private Date dataCriacao;

    @Column(name = "data_atualizacao")
    private Date dataAtualizacao;

    @Column(name = "data_conclusao")
    private Date dataConclusao;

    @Column(name = "data_cancelamento")
    private Date dataCancelamento;

    @Column(name = "data_vencimento")
    private Date dataVencimento;

    @Column(name = "data_renovacao")
    private Date dataRenovacao;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "justificativa")
    private String justificativa;

    @Column(name = "observacoes")
    private String observacoes;

    @PrePersist
    protected void onCreate() {
        this.dataCriacao = new Date();  // Define a data atual se não for fornecida
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Date getMeta() {
        return meta;
    }

    public void setMeta(Date meta) {
        this.meta = meta;
    }

    public StatusProposta getStatus() {
        return status;
    }

    public void setStatus(StatusProposta status) {
        this.status = status;
    }

    public Date getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(Date dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public Date getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(Date dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    public Date getDataConclusao() {
        return dataConclusao;
    }

    public void setDataConclusao(Date dataConclusao) {
        this.dataConclusao = dataConclusao;
    }

    public Date getDataCancelamento() {
        return dataCancelamento;
    }

    public void setDataCancelamento(Date dataCancelamento) {
        this.dataCancelamento = dataCancelamento;
    }

    public Date getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(Date dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public Date getDataRenovacao() {
        return dataRenovacao;
    }

    public void setDataRenovacao(Date dataRenovacao) {
        this.dataRenovacao = dataRenovacao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }   

    public Long getId() {
        return id;
    }

    public Plano getPlano() {
        return plano;
    }
    
    public void setPlano(Plano plano) {
        this.plano = plano;
    }

    public Eixo getEixo() {
        return eixo;
    }
    
    public void setEixo(Eixo eixo) {
        this.eixo = eixo;
    }

    public Categoria getCategoria() {
        return categoria;
    }
    
    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }


}
