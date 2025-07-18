package com.planmanager.www.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.planmanager.www.model.prefeituras.Prefeitura;

public interface PrefeituraRepository extends JpaRepository<Prefeitura, Long> {
    Optional<Prefeitura> findById(Long id);
}
