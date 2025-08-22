package com.planmanager.www.model.prefeituras;

import java.util.List;

import com.planmanager.www.model.propostas.Eixo;
import com.planmanager.www.model.propostas.OrgaoGestor;
import com.planmanager.www.model.propostas.Categoria;
import com.planmanager.www.model.propostas.Plano;
import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.users.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity(name = "prefeituras")
@Table(name = "prefeituras")
public class Prefeitura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    
    @Column(name = "logo_prefeitura")
    private String logoPrefeitura;

    @Column(name = "logo_cmdca")
    private String logoCMDCA;
    
    @OneToMany(mappedBy = "prefeitura", fetch=FetchType.LAZY, cascade=CascadeType.ALL)
    
    private List<Proposta> propostas;

    @OneToMany(mappedBy = "prefeitura", fetch=FetchType.LAZY, cascade=CascadeType.ALL)
    
    private List<Plano> planos;

    @OneToMany(mappedBy = "prefeitura", fetch=FetchType.LAZY, cascade=CascadeType.ALL)
    
    private List<Eixo> eixos;

    @OneToMany(mappedBy = "prefeitura", fetch=FetchType.LAZY, cascade=CascadeType.ALL)
    
    private List<Categoria> categorias;

    @OneToMany(mappedBy = "prefeitura", fetch=FetchType.LAZY, cascade=CascadeType.ALL)
    
    private List<OrgaoGestor> orgaosGestores;

    @OneToMany(mappedBy = "prefeitura", fetch=FetchType.LAZY, cascade=CascadeType.ALL)
    private List<User> users;   


    Prefeitura(){}

    

    // Getters e setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getLogoPrefeitura() {
        return logoPrefeitura;
    }
    
    public void setLogoPrefeitura(String logoPrefeitura) {
        this.logoPrefeitura = logoPrefeitura;
    }

    
    
    public List<Proposta> getPropostas() {
        return propostas;
    }
    
    public void setPropostas(List<Proposta> propostas) {
        this.propostas = propostas;
    }

    public String getLogoCMDCA() {
        return logoCMDCA;
    }

    public void setLogoCMDCA(String logoCMDCA) {
        this.logoCMDCA = logoCMDCA;
    }

    public List<Plano> getPlanos() {
        return planos;
    }

    public void setPlanos(List<Plano> planos) {
        this.planos = planos;
    }


    public List<Eixo> getEixos() {
        return eixos;
    }

    public void setEixos(List<Eixo> eixos) {
        this.eixos = eixos;
    }

    public List<Categoria> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<Categoria> categorias) {
        this.categorias = categorias;
    }

    public List<OrgaoGestor> getOrgaosGestores() {
        return orgaosGestores;
    }

    public void setOrgaosGestores(List<OrgaoGestor> orgaosGestores) {
        this.orgaosGestores = orgaosGestores;
    }
    
    
}
