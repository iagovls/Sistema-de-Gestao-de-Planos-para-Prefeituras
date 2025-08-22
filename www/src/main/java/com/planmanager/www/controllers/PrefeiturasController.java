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
                .map(p -> new PrefeituraDTO(
                    p.getId(), 
                    p.getName(), 
                    p.getLogoPrefeitura(), 
                    p.getLogoCMDCA() 
                    // p.getPlanos().stream().map(plano -> {
                    //     PlanoDTO dto = new PlanoDTO(plano.getTitulo(), p.getId());
                    //     return dto;
                    // }).toList(), 
                    // p.getEixos().stream().map(e -> {
                    //     EixoDTO dto = new EixoDTO(e.getTitulo(), p.getId());
                    //     return dto;
                    // }).toList(), 
                    // p.getCategorias().stream().map(c -> {
                    //     CategoriaDTO dto = new CategoriaDTO(c.getTitulo(), p.getId());
                    //     return dto;
                    // }).toList(), 
                    // p.getOrgaosGestores().stream().map(o -> {
                    //     OrgaoGestorDTO dto = new OrgaoGestorDTO(o.getTitulo(), p.getId());
                    //     return dto;
                    // }).toList()
                    ))
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/logo-prefeitura")
    public ResponseEntity<PrefeituraDTO> updateLogoPrefeitura(@PathVariable Long id, @RequestBody String logoPrefeitura) {
        Prefeitura prefeitura = prefeituraRepository.findById(id).orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
        prefeitura.setLogoPrefeitura(logoPrefeitura);
        prefeituraRepository.save(prefeitura);

        PrefeituraDTO prefeituraDTO = new PrefeituraDTO(
            prefeitura.getId(), 
            prefeitura.getName(), 
            prefeitura.getLogoPrefeitura(), 
            prefeitura.getLogoCMDCA() 
            // prefeitura.getPlanos().stream().map(p -> {
            //     PlanoDTO dto = new PlanoDTO(p.getTitulo(), prefeitura.getId());
            //     return dto;
            // }).toList(), 
            // prefeitura.getEixos().stream().map(e -> {
            //     EixoDTO dto = new EixoDTO(e.getTitulo(), prefeitura.getId());
            //     return dto;
            // }).toList(), 
            // prefeitura.getCategorias().stream().map(c -> {
            //     CategoriaDTO dto = new CategoriaDTO(c.getTitulo(), prefeitura.getId());
            //     return dto;
            // }).toList(), 
            // prefeitura.getOrgaosGestores().stream().map(o -> {
            //     OrgaoGestorDTO dto = new OrgaoGestorDTO(o.getTitulo(), prefeitura.getId());
            //     return dto;
            // }).toList()
        );

        return ResponseEntity.ok(prefeituraDTO);
    }

    @PutMapping("/{id}/logo-cmdca")
    public ResponseEntity<PrefeituraDTO> updateLogoCMDCA(@PathVariable Long id, @RequestBody String logoCMDCA){

        Prefeitura prefeitura = prefeituraRepository.findById(id).orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
        prefeitura.setLogoCMDCA(logoCMDCA);
        prefeituraRepository.save(prefeitura);

        PrefeituraDTO prefeituraDTO = new PrefeituraDTO(
            prefeitura.getId(), 
            prefeitura.getName(), 
            prefeitura.getLogoPrefeitura(), 
            prefeitura.getLogoCMDCA() 
            // prefeitura.getPlanos().stream().map(p -> {
            //     PlanoDTO dto = new PlanoDTO(p.getTitulo(), prefeitura.getId());
            //     return dto;
            // }).toList(), 
            // prefeitura.getEixos().stream().map(e -> {
            //     EixoDTO dto = new EixoDTO(e.getTitulo(), prefeitura.getId());
            //     return dto;
            // }).toList(), 
            // prefeitura.getCategorias().stream().map(c -> {
            //     CategoriaDTO dto = new CategoriaDTO(c.getTitulo(), prefeitura.getId());
            //     return dto;
            // }).toList(), 
            // prefeitura.getOrgaosGestores().stream().map(o -> {
            //     OrgaoGestorDTO dto = new OrgaoGestorDTO(o.getTitulo(), prefeitura.getId());
            //     return dto;
            // }).toList()
        );

        return ResponseEntity.ok(prefeituraDTO);
    }
}
