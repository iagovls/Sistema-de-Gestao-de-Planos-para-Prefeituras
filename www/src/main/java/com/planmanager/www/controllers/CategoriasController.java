package com.planmanager.www.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import com.planmanager.www.model.categorias.Categoria;
import com.planmanager.www.model.categorias.CategoriaDTO;
import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.repositories.CategoriasRepository;
import com.planmanager.www.repositories.PrefeituraRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categorias")
public class CategoriasController {

    @Autowired
    private CategoriasRepository categoriasRepository;

    @Autowired
    private PrefeituraRepository prefeituraRepository;

    @GetMapping
    public List<CategoriaDTO> getAll() {
        return categoriasRepository.findAll().stream().map(categoria -> {
            return new CategoriaDTO(categoria.getId(), categoria.getTitulo(), categoria.getPrefeitura().getId());
        }).toList();
    }

    @PostMapping
    public ResponseEntity<CategoriaDTO> create(@RequestBody CategoriaDTO dto) {
        Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId()).orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
        Categoria categoria = new Categoria();
        categoria.setTitulo(dto.titulo());
        categoria.setPrefeitura(prefeitura);
        categoriasRepository.save(categoria);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/lote")
    public ResponseEntity<List<CategoriaDTO>> salvarEmLote(@Valid @RequestBody List<CategoriaDTO> dtos){
        List<Categoria> categorias = dtos.stream().map(dto -> {
            Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId()).orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
            Categoria categoria = new Categoria();
            categoria.setTitulo(dto.titulo());
            categoria.setPrefeitura(prefeitura);
            return categoria;
        }).toList();
        categoriasRepository.saveAll(categorias);
        return ResponseEntity.ok(dtos);
    }

}
