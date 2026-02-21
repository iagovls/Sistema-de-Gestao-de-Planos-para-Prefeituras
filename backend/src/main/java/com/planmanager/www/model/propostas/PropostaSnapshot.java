package com.planmanager.www.model.propostas;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "propostas_snapshot")
public class PropostaSnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "meta")
    private Date meta;

    @Column(name = "status")
    private StatusProposta status;

    @Column(name = "plano_titulo")
    private String planoTitulo;

    @Column(name = "eixo_titulo")
    private String eixoTitulo;

    @Column(name = "categoria_titulo")
    private String categoriaTitulo;

    @Column(name = "orgao_gestor_titulo")
    private String orgaoGestorTitulo;

    @Column(name = "data_modificacao")
    private Date dataModificacao;    

    @Column(name = "modificado_por")
    private String modificadoPor;

    @Column(name = "motivo")
    private String motivo;
    
    @Column(name = "meta_permanente")
    private Boolean metaPermanente;
    
    @Column(name = "proposta_cancelada")
    private Boolean propostaCancelada;
    
    @ManyToOne
    @JoinColumn(name = "proposta_id")
    private Proposta proposta;
    
    
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
    
    public String getMotivo() {
        return motivo;
    }
    
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
    
    public Boolean getMetaPermanente() {
        return metaPermanente;
    }
    
    public void setMetaPermanente(Boolean metaPermanente) {
        this.metaPermanente = metaPermanente;
    }
    
    public Boolean getPropostaCancelada() {
        return propostaCancelada;
    }
    
    public void setPropostaCancelada(Boolean propostaCancelada) {
        this.propostaCancelada = propostaCancelada;
    }
    
    public Long getId() {
        return id;
    }
    
    public String getPlanoTitulo() {
        return planoTitulo;
    }
    
    public void setPlanoTitulo(String planoTitulo) {
        this.planoTitulo = planoTitulo;
    }
    
    public String getEixoTitulo() {
        return eixoTitulo;
    }
    
    public void setEixoTitulo(String eixoTitulo) {
        this.eixoTitulo = eixoTitulo;
    }
    
    public String getCategoriaTitulo() {
        return categoriaTitulo;
    }
    
    public void setCategoriaTitulo(String categoriaTitulo) {
        this.categoriaTitulo = categoriaTitulo;
    }
    
    public String getOrgaoGestorTitulo() {
        return orgaoGestorTitulo;
    }

    public void setOrgaoGestorTitulo(String orgaoGestorTitulo) {
        this.orgaoGestorTitulo = orgaoGestorTitulo;
    }

    public Date getDataModificacao() {
        return dataModificacao;
    }

    public void setDataModificacao(Date dataModificacao) {
        this.dataModificacao = new Date();
    }

    public String getModificadoPor() {
        return modificadoPor;
    }

    public void setModificadoPor(String modificadoPor) {
        this.modificadoPor = modificadoPor;
    }

    public Proposta getProposta() {
        return proposta;
    }

    public void setProposta(Proposta proposta) {
        this.proposta = proposta;
    }
}
