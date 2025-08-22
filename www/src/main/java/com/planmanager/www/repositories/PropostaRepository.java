package com.planmanager.www.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planmanager.www.model.propostas.Categoria;
import com.planmanager.www.model.propostas.Eixo;
import com.planmanager.www.model.propostas.Plano;
import com.planmanager.www.model.propostas.Proposta;

public interface PropostaRepository extends JpaRepository<Proposta, Long> {
    Optional<Proposta> findByTitulo(String titulo);
    Optional<Proposta> findByPlano(Plano plano);
    Optional<Proposta> findByEixo(Eixo eixo);
    Optional<Proposta> findByCategoria(Categoria categoria);
    List<Proposta> findByPrefeituraId(Long prefeituraId);
    List<Proposta> findAll();
}
