package com.planmanager.www.model.prefeituras;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.planmanager.www.model.propostas.Proposta;

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
    @JsonManagedReference
    private List<Proposta> propostas;
    
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
}
