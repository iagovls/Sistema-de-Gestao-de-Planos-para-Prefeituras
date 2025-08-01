package com.planmanager.www.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.propostas.dto.PropostaGetDTO;
import com.planmanager.www.model.propostas.dto.PropostaRequestDTO;
import com.planmanager.www.repositories.PrefeituraRepository;
import com.planmanager.www.repositories.PropostaRepository;
import com.planmanager.www.utils.PropostaMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("propostas")
public class PropostasController {

    @Autowired
    private PropostaRepository propostaRepository;

    @Autowired
    private PrefeituraRepository prefeituraRepository;

    @PostMapping
    public ResponseEntity<Proposta> createProposta(@Valid @RequestBody PropostaRequestDTO dto) {
        Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId())
                .orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));

        Proposta proposta = PropostaMapper.toEntity(dto, prefeitura);
        return ResponseEntity.ok(propostaRepository.save(proposta));
    }

    @PostMapping("/lote")
    public ResponseEntity<List<Proposta>> salvarEmLote(@Valid @RequestBody List<PropostaRequestDTO> dtos) {
        List<Proposta> propostas = dtos.stream().map(dto -> {
            Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId())
                    .orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
            return PropostaMapper.toEntity(dto, prefeitura);
        }).toList();

        List<Proposta> salvas = propostaRepository.saveAll(propostas);
        return ResponseEntity.ok(salvas);
    }

    @GetMapping("/por-prefeitura")
    public ResponseEntity<List<PropostaGetDTO>> getPropostasPorPrefeitura(@RequestParam Long prefeituraId) {
        List<PropostaGetDTO> propostas = propostaRepository.findByPrefeituraId(prefeituraId)
        .stream()
        .map(p -> new PropostaGetDTO(
            p.getId(), 
            p.getTitulo(),  
            p.getMeta(), 
            p.getStatus().getDescricao(), 
            p.getPlano().getTitulo(), 
            p.getEixo().getTitulo(), 
            p.getCategoria().getTitulo(), 
            p.getOrgaoGestor().getTitulo(),
            p.getMotivo(), 
            prefeituraId)).toList();

        return ResponseEntity.ok(propostas);
}


    @GetMapping("/id")
    public ResponseEntity<?> getPropostasPorId(@RequestParam Long id) {
        Proposta proposta = propostaRepository.findById(id).orElseThrow(() -> new RuntimeException("Proposta não encontrada"));
        return ResponseEntity.ok(proposta);
    }

    @GetMapping("/todas")
    public ResponseEntity<List<PropostaGetDTO>> listarTodas() {
        
            
        List<PropostaGetDTO> propostas = propostaRepository.findAll()
        .stream()
        .map(p -> new PropostaGetDTO(
            p.getId(), 
            p.getTitulo(),  
            p.getMeta(), 
            p.getStatus().getDescricao(), 
            p.getPlano().getTitulo(), 
            p.getEixo().getTitulo(), 
            p.getCategoria().getTitulo(), 
            p.getOrgaoGestor().getTitulo(),
            p.getMotivo(),
            p.getPrefeitura().getId() 
            )).toList();

            return ResponseEntity.ok(propostas);
    }

    @PutMapping
    public ResponseEntity<?> updateProposta(@RequestBody Proposta proposta) {
        if (!propostaRepository.existsById(proposta.getId())) {
            return ResponseEntity.notFound().build();
        }
        Proposta atualizada = propostaRepository.save(proposta);
        return ResponseEntity.ok(atualizada);
    }
}
