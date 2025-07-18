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

    @Column(name = "plano")
    private Plano plano;

    @Column(name = "eixo")
    private Eixo eixo;

    @Column(name = "categoria")
    private Categoria categoria;

    @Column(name = "data_modificacao")
    private Date dataModificacao;    

    @Column(name = "modificado_por")
    private String modificadoPor;

    @Column(name = "motivo")
    private String motivo;    
    
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
    
    public Date getDataModificacao() {
        return dataModificacao;
    }

    public void setDataModificacao(Date dataModificacao) {
        // 
        this.dataModificacao = new Date();
    }

    public String getModificadoPor() {
        return modificadoPor;
    }

    public void setModificadoPor(String modificadoPor) {
        this.modificadoPor = modificadoPor;
    }

    

}
