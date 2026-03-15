package com.planmanager.www.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.planmanager.www.model.categorias.Categoria;
import com.planmanager.www.model.eixos.Eixo;
import com.planmanager.www.model.planos.Plano;
import com.planmanager.www.model.propostas.Proposta;

public interface PropostaRepository extends JpaRepository<Proposta, Integer> {
    Optional<Proposta> findByTitulo(String titulo);
    Optional<Proposta> findByPlano(Plano plano);
    Optional<Proposta> findByEixo(Eixo eixo);
    Optional<Proposta> findByCategoria(Categoria categoria);
    List<Proposta> findByPrefeituraId(int prefeituraId);
    List<Proposta> findByPlano_Prefeitura_Id(int prefeituraId);
    List<Proposta> findByPlanoIdOrderByEixo_TituloAscTituloAsc(int planoId);
    @Query("SELECT p FROM Proposta p JOIN FETCH p.plano pl JOIN FETCH pl.prefeitura pr WHERE pr.id = :prefeituraId AND p.ativa = true")
    List<Proposta> findAtivasByPrefeituraId(@Param("prefeituraId") int prefeituraId);
    @Query("SELECT DISTINCT p.plano.prefeitura.id FROM Proposta p WHERE p.ativa = true")
    List<Integer> findPrefeituraIdsWithPropostasAtivas();
    List<Proposta> findAll();
}
