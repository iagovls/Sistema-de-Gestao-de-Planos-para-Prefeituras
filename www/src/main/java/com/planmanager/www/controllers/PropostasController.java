package com.planmanager.www.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.model.propostas.Categoria;
import com.planmanager.www.model.propostas.Eixo;
import com.planmanager.www.model.propostas.OrgaoGestor;
import com.planmanager.www.model.propostas.Plano;
import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.propostas.StatusProposta;
import com.planmanager.www.model.propostas.dto.PropostaGetDTO;
import com.planmanager.www.model.propostas.dto.PropostaRequestDTO;
import com.planmanager.www.repositories.CategoriasRepository;
import com.planmanager.www.repositories.EixosRepository;
import com.planmanager.www.repositories.OrgaosGestoresRepository;
import com.planmanager.www.repositories.PlanosRepository;
import com.planmanager.www.repositories.PrefeituraRepository;
import com.planmanager.www.repositories.PropostaRepository;
import com.planmanager.www.utils.PropostaMapper;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("propostas")
public class PropostasController {

    @Autowired
    private PropostaRepository propostaRepository;

    @Autowired
    private PrefeituraRepository prefeituraRepository;

    @Autowired
    private PlanosRepository planosRepository;

    @Autowired
    private EixosRepository eixosRepository;

    @Autowired
    private CategoriasRepository categoriasRepository;

    @Autowired
    private OrgaosGestoresRepository orgaosGestoresRepository;

    @PostMapping
    public ResponseEntity<PropostaRequestDTO> createProposta(@Valid @RequestBody PropostaRequestDTO dto) {
        Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId())
                .orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
        Plano plano = planosRepository.findById(dto.planoId())
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));
        Eixo eixo = eixosRepository.findById(dto.eixoId())
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));
        Categoria categoria = categoriasRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));
        OrgaoGestor orgaoGestor = orgaosGestoresRepository.findById(dto.orgaoGestorId())
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));

        Proposta proposta = PropostaMapper.toEntity(dto, prefeitura, plano, eixo, categoria, orgaoGestor);
        propostaRepository.save(proposta);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/lote")
    public ResponseEntity<List<PropostaRequestDTO>> salvarEmLote(@Valid @RequestBody List<PropostaRequestDTO> dtos) {
        List<Proposta> propostas = dtos.stream().map(dto -> {
            Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId())
                    .orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
            Plano plano = planosRepository.findById(dto.planoId())
                    .orElseThrow(() -> new RuntimeException("Plano não encontrado"));
            Eixo eixo = eixosRepository.findById(dto.eixoId())
                    .orElseThrow(() -> new RuntimeException("Plano não encontrado"));
            Categoria categoria = categoriasRepository.findById(dto.categoriaId())
                    .orElseThrow(() -> new RuntimeException("Plano não encontrado"));
            OrgaoGestor orgaoGestor = orgaosGestoresRepository.findById(dto.orgaoGestorId())
                    .orElseThrow(() -> new RuntimeException("Plano não encontrado"));
            return PropostaMapper.toEntity(dto, prefeitura, plano, eixo, categoria, orgaoGestor);
        }).toList();

        propostaRepository.saveAll(propostas);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/por-prefeitura")
    public ResponseEntity<List<PropostaGetDTO>> getPropostasPorPrefeitura(@RequestParam Long prefeituraId, @AuthenticationPrincipal UserDetails userDetails) {
        
        // @AuthenticationPrincipal 

        System.out.println("porPrefeitura chamada");

        
        List<PropostaGetDTO> propostas = propostaRepository.findByPrefeituraId(prefeituraId)
                .stream()
                .filter(p -> {
                    // Se o usuário não estiver logado, filtra propostas canceladas
                    if (userDetails == null && p.getStatus() == StatusProposta.CANCELADA) {
                        // System.out.println(userDetails);
                        return false;
                    }
                    return true;
                })
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
                        prefeituraId))
                .toList();

        return ResponseEntity.ok(propostas);
    }

    @GetMapping("/id")
    public ResponseEntity<?> getPropostasPorId(@RequestParam Long id) {
        System.out.println("proId chamada");
        Proposta proposta = propostaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposta não encontrada"));
        return ResponseEntity.ok(proposta);
    }

    @GetMapping("/todas")
    public ResponseEntity<List<PropostaGetDTO>> listarTodas(@AuthenticationPrincipal UserDetails userDetails) {
        // Verifica se o usuário está autenticado
        System.out.println("listarTodas chamada");

        List<PropostaGetDTO> propostas = propostaRepository.findAll()
                .stream()
                .filter(p -> {
                    // Se o usuário não estiver logado, filtra propostas canceladas
                    if (userDetails == null && p.getStatus() == StatusProposta.CANCELADA) {
                        // System.out.println(userDetails);
                        return false;
                    }
                    return true;
                })
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
                        p.getPrefeitura().getId()))
                .toList();

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

//     private boolean isUserLoggedIn(){
//         return SecurityContextHolder.getContext().getAuthentication() != null &&
//                 SecurityContextHolder.getContext().getAuthentication().isAuthenticated() &&
//                 SecurityContextHolder.getContext().getAuthentication().getPrincipal() != "anonymousUser";
//     }
}
