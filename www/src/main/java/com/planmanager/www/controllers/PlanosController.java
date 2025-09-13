package com.planmanager.www.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import com.planmanager.www.model.planos.Plano;
import com.planmanager.www.model.planos.PlanoDTO;
import com.planmanager.www.model.planos.PlanoRequestDTO;
import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.repositories.PlanosRepository;
import com.planmanager.www.repositories.PrefeituraRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/planos")
public class PlanosController {

    @Autowired
    private PlanosRepository planosRepository;

    @Autowired
    private PrefeituraRepository prefeituraRepository;

    @GetMapping
    public List<PlanoDTO> getAll() {
        // retornar dto
        List<Plano> planos = planosRepository.findAll();
        return planos.stream().map(plano -> new PlanoDTO(plano.getId(), plano.getTitulo(), plano.getPrefeitura().getId())).toList();
        
    }

    @PostMapping
    public ResponseEntity<PlanoRequestDTO> create(@Valid @RequestBody PlanoRequestDTO dto) {
        Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId()).orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
        Plano plano = new Plano();
        plano.setTitulo(dto.titulo());
        plano.setPrefeitura(prefeitura);
        planosRepository.save(plano);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/lote")
    public ResponseEntity<List<PlanoDTO>> salvarEmLote(@Valid @RequestBody List<PlanoDTO> dtos){
        List<Plano> planos = dtos.stream().map(dto -> {
            Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId())
            .orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
            Plano plano = new Plano();
            plano.setTitulo(dto.titulo());
            plano.setPrefeitura(prefeitura);
            return plano;
        }).toList();
        planosRepository.saveAll(planos);
        return ResponseEntity.ok(dtos);
    }
}
