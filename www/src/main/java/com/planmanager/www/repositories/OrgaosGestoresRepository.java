package com.planmanager.www.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planmanager.www.model.propostas.OrgaoGestor;

public interface OrgaosGestoresRepository extends JpaRepository<OrgaoGestor, Long> {

}
