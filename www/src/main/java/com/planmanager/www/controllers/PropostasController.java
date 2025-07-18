package com.planmanager.www.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.repositories.PropostaRepository;

@RestController
@RequestMapping("propostas")
public class PropostasController {

    @Autowired
    private PropostaRepository propostaRepository;
    
    @PostMapping
    public ResponseEntity<?> createProposta(@RequestBody Proposta proposta) {
        propostaRepository.save(proposta);
        return ResponseEntity.ok(proposta);
    }

    @PostMapping("/lote")
    public ResponseEntity<?> createPropostas(@RequestBody List<Proposta> propostas) {
        propostaRepository.saveAll(propostas);
        return ResponseEntity.ok(propostas);
    }

    @GetMapping
    public ResponseEntity<?> getProposta(@RequestBody Proposta proposta) {
        propostaRepository.findByPlano(proposta.getPlano());
        return ResponseEntity.ok(proposta);
    }

    @PutMapping
    public ResponseEntity<?> updateProposta(@RequestBody Proposta proposta) {
        propostaRepository.save(proposta);
        return ResponseEntity.ok(proposta);
    }

    @GetMapping("/lote")
    public ResponseEntity<?> getPropostas() {
        List<Proposta> propostas = propostaRepository.findAll();
        return ResponseEntity.ok(propostas);
    }
}
