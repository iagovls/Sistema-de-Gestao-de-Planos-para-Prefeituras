package com.planmanager.www.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.model.propostas.OrgaoGestor;
import com.planmanager.www.repositories.OrgaosGestoresRepository;
import com.planmanager.www.repositories.PrefeituraRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/orgaos-gestores")
public class OrgaosGestoresController {

    @Autowired 
    private OrgaosGestoresRepository orgaosGestoresRepository;

    @Autowired
    private PrefeituraRepository prefeituraRepository;

    @GetMapping
    public List<OrgaoGestor> getAll() {
        return orgaosGestoresRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<OrgaoGestorDTO> create(@Valid @RequestBody OrgaoGestorDTO dto) {
        Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId()).orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
        OrgaoGestor orgaoGestor = new OrgaoGestor();
        orgaoGestor.setTitulo(dto.titulo());
        orgaoGestor.setPrefeitura(prefeitura);
        orgaosGestoresRepository.save(orgaoGestor);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/lote")
    public ResponseEntity<List<OrgaoGestorDTO>> salvarEmLote(@Valid @RequestBody List<OrgaoGestorDTO> dtos){
        System.out.println("salvar orgaos em lote");
        List<OrgaoGestor> orgaos = dtos.stream().map(dto -> {
            Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId()).orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
            OrgaoGestor orgaoGestor = new OrgaoGestor();
            orgaoGestor.setTitulo(dto.titulo());
            orgaoGestor.setPrefeitura(prefeitura);
            return orgaoGestor;
        }).toList();
        orgaosGestoresRepository.saveAll(orgaos);
        return ResponseEntity.ok(dtos);

    }
}
