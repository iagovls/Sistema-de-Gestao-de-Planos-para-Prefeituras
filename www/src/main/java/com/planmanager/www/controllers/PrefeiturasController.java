package com.planmanager.www.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.model.prefeituras.dto.PrefeituraDTO;
import com.planmanager.www.repositories.PrefeituraRepository;

@RestController
@RequestMapping("/prefeituras")
public class PrefeiturasController {

    @Autowired
    PrefeituraRepository prefeituraRepository;

    @GetMapping
    public ResponseEntity<List<PrefeituraDTO>> getAll() {
        List<PrefeituraDTO> dtos = prefeituraRepository.findAll().stream()
                .map(p -> new PrefeituraDTO(p.getId(), p.getName(), p.getLogoPrefeitura(), p.getLogoCMDCA()))
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/logo-prefeitura")
    public ResponseEntity<PrefeituraDTO> updateLogoPrefeitura(@PathVariable Long id, @RequestBody String logoPrefeitura) {
        return prefeituraRepository.findById(id)
                .map(prefeitura -> {
                    prefeitura.setLogoPrefeitura(logoPrefeitura);
                    Prefeitura saved = prefeituraRepository.save(prefeitura);
                    return ResponseEntity.ok(new PrefeituraDTO(saved.getId(), saved.getName(), saved.getLogoPrefeitura(), saved.getLogoCMDCA()));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/logo-cmdca")
    public ResponseEntity<PrefeituraDTO> updateLogoCMDCA(@PathVariable Long id, @RequestBody String logoCMDCA){
        return prefeituraRepository.findById(id).map(prefeitura -> {
            prefeitura.setLogoCMDCA(logoCMDCA);
            Prefeitura saved = prefeituraRepository.save(prefeitura);
            return ResponseEntity.ok(new PrefeituraDTO(saved.getId(), saved.getName(), saved.getLogoPrefeitura(), saved.getLogoCMDCA()));
        })
        .orElse(ResponseEntity.notFound().build());
    }

}
