package com.planmanager.www.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planmanager.www.model.propostas.Plano;

public interface PlanosRepository extends JpaRepository<Plano, Long> {

}
