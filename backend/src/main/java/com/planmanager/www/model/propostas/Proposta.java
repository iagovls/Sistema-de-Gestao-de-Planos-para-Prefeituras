package com.planmanager.www.model.propostas;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.planmanager.www.model.categorias.Categoria;
import com.planmanager.www.model.eixos.Eixo;
import com.planmanager.www.model.orgaos.OrgaoGestor;
import com.planmanager.www.model.planos.Plano;
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

    @ManyToOne
    @JoinColumn(name = "plano_id")
    private Plano plano;

    @ManyToOne
    @JoinColumn(name = "eixo_id")
    private Eixo eixo;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name= "orgao_gestor_id")
    private OrgaoGestor orgaoGestor;
    
    @Column(name = "motivo")
    private String motivo;
    
    @Column(name = "meta_permanente")
    private Boolean metaPermanente;
    
    @Column(name = "ativa")
    private Boolean ativa;
       
    
    @ManyToOne
    @JoinColumn(name = "prefeitura_id")
    @JsonBackReference
    private Prefeitura prefeitura;

    @OneToMany(mappedBy = "proposta", fetch= FetchType.LAZY, cascade=CascadeType.ALL)
    private List<PropostaSnapshot> snapshots;

    public Proposta() {
        
    }
    
    
    public void setId(Long id) {
        this.id = id;
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
        if(metaPermanente == null ){
            this.metaPermanente = false;
        } else {
            this.metaPermanente = metaPermanente;
        }
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


    public Boolean getAtiva() {
        return ativa;
    }


    public void setAtiva(Boolean ativa) {
        if(ativa == null){
            this.ativa = true;
        } else {
            this.ativa = ativa;
        }
    }

    
    
    

}
