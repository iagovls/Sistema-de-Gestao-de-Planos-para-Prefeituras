package com.planmanager.www.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planmanager.www.model.propostas.Categoria;

public interface CategoriasRepository extends JpaRepository<Categoria, Long> {

}
