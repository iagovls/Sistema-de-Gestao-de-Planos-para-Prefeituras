package com.planmanager.www.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import com.planmanager.www.model.eixos.Eixo;
import com.planmanager.www.model.eixos.EixoDTO;
import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.repositories.EixosRepository;
import com.planmanager.www.repositories.PrefeituraRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/eixos")   
public class EixosController {

    @Autowired
    private EixosRepository eixosRepository;

    @Autowired
    private PrefeituraRepository prefeituraRepository;

    @GetMapping
    public ResponseEntity<List<EixoDTO>> getAll() {
        List<EixoDTO> dtos = eixosRepository.findAll().stream().map(e -> {
            EixoDTO eixo = new EixoDTO(e.getId(), e.getTitulo(), e.getPrefeitura().getId());    
            return eixo;
        }).toList();
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<EixoDTO> create(@Valid @RequestBody EixoDTO dto) {
        Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId()).orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
        Eixo eixo = new Eixo();
        eixo.setTitulo(dto.titulo());
        eixo.setPrefeitura(prefeitura);
        eixosRepository.save(eixo);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/lote")
    public ResponseEntity<List<EixoDTO>> salvarEmLote(@Valid @RequestBody List<EixoDTO> dtos){
        List<Eixo> eixos = dtos.stream().map(dto -> {
            Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId()).orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
            Eixo eixo = new Eixo();
            eixo.setTitulo(dto.titulo());
            eixo.setPrefeitura(prefeitura);
            return eixo;
        }).toList();
        eixosRepository.saveAll(eixos);
        return ResponseEntity.ok(dtos);
    }
}
