package com.planmanager.www.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planmanager.www.model.propostas.PropostaSnapshot;

public interface PropostaSnapshotRepository extends JpaRepository<PropostaSnapshot, Long> {
    @Override
    public List<PropostaSnapshot> findAll();
    
    public List<PropostaSnapshot> findByPropostaId(Long propostaId);
}
