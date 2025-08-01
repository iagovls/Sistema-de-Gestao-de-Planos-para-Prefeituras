package com.planmanager.www.model.propostas;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.planmanager.www.model.prefeituras.Prefeitura;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


@Entity
@Table(name = "propostas")
public class Proposta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is mandatory")
    @Size(min = 3, message = "Title must be at least 3 characters")
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

    @Column(name= "orgao_gestor")
    private OrgaoGestor orgaoGestor;
    
    @Column(name = "motivo")
    private String motivo;    
    
    @ManyToOne
    @JoinColumn(name = "prefeitura_id")
    @JsonBackReference
    private Prefeitura prefeitura;

    @OneToMany(mappedBy = "proposta", fetch= FetchType.LAZY, cascade=CascadeType.ALL)
    private List<PropostaSnapshot> snapshots;    
    
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

    

    public OrgaoGestor getOrgaoGestor() {
        return orgaoGestor;
    }

    public void setOrgaoGestor(OrgaoGestor orgaoGestor) {
        this.orgaoGestor = orgaoGestor;
    }

    public Prefeitura getPrefeitura() {
        return prefeitura;
    }

    public void setPrefeitura(Prefeitura prefeitura) {
        this.prefeitura = prefeitura;
    }

    
    
    

}
