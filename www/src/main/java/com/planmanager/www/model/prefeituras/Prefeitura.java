package com.planmanager.www.model.prefeituras;

import com.planmanager.www.model.propostas.Proposta;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity(name = "prefeituras")
@Table(name = "prefeituras")
public class Prefeitura {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false)
    private String name;
    private Proposta proposta;

}
