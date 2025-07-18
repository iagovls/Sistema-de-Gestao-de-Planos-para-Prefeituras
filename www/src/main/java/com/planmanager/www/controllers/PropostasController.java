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

import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.propostas.dto.PropostaRequestDTO;
import com.planmanager.www.repositories.PrefeituraRepository;
import com.planmanager.www.repositories.PropostaRepository;

@RestController
@RequestMapping("propostas")
public class PropostasController {

    @Autowired
    private PropostaRepository propostaRepository;
    
    @Autowired
    private PrefeituraRepository prefeituraRepository;

    @PostMapping
    public ResponseEntity<?> createProposta(@RequestBody PropostaRequestDTO dto) {
        Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId())
                .orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
        
        
        Proposta proposta = new Proposta();
        proposta.setTitulo(dto.titulo());
        proposta.setMeta(dto.meta());
        proposta.setStatus(dto.status());
        proposta.setPlano(dto.plano());
        proposta.setEixo(dto.eixo());
        proposta.setCategoria(dto.categoria());
        proposta.setMotivo(dto.motivo());
        proposta.setPrefeitura(prefeitura);

        return ResponseEntity.ok(propostaRepository.save(proposta));
        
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
