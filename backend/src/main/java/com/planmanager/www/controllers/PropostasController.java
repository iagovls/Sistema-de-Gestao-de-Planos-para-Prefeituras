package com.planmanager.www.controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.planmanager.www.model.categorias.Categoria;
import com.planmanager.www.model.categorias.CategoriaDTO;
import com.planmanager.www.model.eixos.Eixo;
import com.planmanager.www.model.eixos.EixoDTO;
import com.planmanager.www.model.orgaos.OrgaoGestor;
import com.planmanager.www.model.orgaos.OrgaoGestorDTO;
import com.planmanager.www.model.planos.Plano;
import com.planmanager.www.model.planos.PlanoDTO;
import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.propostas.dto.PropostaGetDTO;
import com.planmanager.www.model.propostas.dto.PropostaRequestDTO;
import com.planmanager.www.repositories.PropostaRepository;
import com.planmanager.www.services.PropostaService;
import com.planmanager.www.utils.PropostaMapper;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/propostas")
public class PropostasController {

        @Autowired
        private PropostaRepository propostaRepository;

        @Autowired
        private PropostaService propostaService;

        @PostMapping
        public ResponseEntity<?> createProposta(@Valid @RequestBody PropostaRequestDTO dto,
                        @AuthenticationPrincipal UserDetails userDetails) {
                return propostaService.createProposta(dto, userDetails);
        }

        @PostMapping("/lote")
        public ResponseEntity<?> salvarEmLote
                (
                        @Valid @RequestBody List<PropostaRequestDTO> dtos
                ) {
                return propostaService.salvarEmLote(dtos);
        }

        @GetMapping("/por-prefeitura")
        public ResponseEntity<List<PropostaGetDTO>> getPropostasPorPrefeitura(
                        @RequestParam Integer prefeituraId,
                        @AuthenticationPrincipal UserDetails userDetails) {

                // @AuthenticationPrincipal

                List<Proposta> propostasFiltradas = propostaRepository.findByPlano_Prefeitura_Id(prefeituraId);
                List<Proposta> propostasPorPrefeitura = propostaRepository.findByPrefeituraId(prefeituraId);

                Map<Integer, Proposta> propostasUnicas = propostasFiltradas.stream()
                                .collect(Collectors.toMap(Proposta::getId, p -> p, (a, b) -> a));
                propostasPorPrefeitura.forEach(p -> propostasUnicas.putIfAbsent(p.getId(), p));

                List<PropostaGetDTO> propostas = propostasUnicas.values().stream()
                                .filter(p -> {
                                        // Se o usuário não estiver logado, filtra propostas canceladas
                                        if (userDetails == null && !p.getAtiva()) {
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
                                                p.getAtiva(),
                                                new PlanoDTO(p.getPlano().getId(), p.getPlano().getTitulo(), prefeituraId), 
                                                new EixoDTO(p.getEixo().getId(), p.getEixo().getTitulo(), prefeituraId),
                                                new CategoriaDTO(p.getCategoria().getId(), p.getCategoria().getTitulo(), prefeituraId),
                                                new OrgaoGestorDTO(p.getOrgaoGestor().getId(), p.getOrgaoGestor().getTitulo(), prefeituraId),
                                                p.getMotivo(),
                                                p.getMetaPermanente(),
                                                prefeituraId))
                                .toList();

                return ResponseEntity.ok(propostas);
        }

        @GetMapping("/{id}")
        public ResponseEntity<PropostaGetDTO> getPropostasPorId(@PathVariable Integer id) {
                System.out.println("proId chamada");
                Proposta proposta = propostaRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Proposta não encontrada"));
                PropostaGetDTO propostaGetDTO = new PropostaGetDTO(
                        id, 
                        proposta.getTitulo(), 
                        proposta.getMeta(), 
                        proposta.getStatus().getDescricao(), 
                        proposta.getAtiva(),
                        proposta.getPlano() != null ? new PlanoDTO(proposta.getPlano().getId(), proposta.getPlano().getTitulo(), proposta.getPrefeitura().getId()) : null,
                        proposta.getEixo() != null ? new EixoDTO(proposta.getEixo().getId(), proposta.getEixo().getTitulo(), proposta.getPrefeitura().getId()) : null,
                        proposta.getCategoria() != null ? new CategoriaDTO(proposta.getCategoria().getId(), proposta.getCategoria().getTitulo(), proposta.getPrefeitura().getId()) : null,
                        proposta.getOrgaoGestor() != null ? new OrgaoGestorDTO(proposta.getOrgaoGestor().getId(), proposta.getOrgaoGestor().getTitulo(), proposta.getPrefeitura().getId()) : null,
                        proposta.getMotivo(), 
                        proposta.getMetaPermanente(), 
                        proposta.getPrefeitura().getId()
                );
                return ResponseEntity.ok(propostaGetDTO);
        }

        @GetMapping("/todas")
        public ResponseEntity<List<PropostaGetDTO>> listarTodas(@AuthenticationPrincipal UserDetails userDetails) {
                // Verifica se o usuário está autenticado
                System.out.println("listarTodas chamada");

                List<PropostaGetDTO> propostas = propostaRepository.findAll()
                                .stream()
                                .filter(p -> {
                                        // Se o usuário não estiver logado, filtra propostas canceladas
                                        if (userDetails == null && !p.getAtiva()) {
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
                                                p.getAtiva(),
                                                p.getPlano() != null ? new PlanoDTO(p.getPlano().getId(), p.getPlano().getTitulo(), p.getPrefeitura() != null ? p.getPrefeitura().getId() : null) : null,
                                                p.getEixo() != null ? new EixoDTO(p.getEixo().getId(), p.getEixo().getTitulo(), p.getPrefeitura() != null ? p.getPrefeitura().getId() : null) : null,
                                                p.getCategoria() != null ? new CategoriaDTO(p.getCategoria().getId(), p.getCategoria().getTitulo(), p.getPrefeitura() != null ? p.getPrefeitura().getId() : null) : null,
                                                p.getOrgaoGestor() != null ? new OrgaoGestorDTO(p.getOrgaoGestor().getId(), p.getOrgaoGestor().getTitulo(), p.getPrefeitura() != null ? p.getPrefeitura().getId() : null) : null,
                                                p.getMotivo(),
                                                p.getMetaPermanente(),
                                                p.getPrefeitura() != null ? p.getPrefeitura().getId() : null))
                                .toList();

                return ResponseEntity.ok(propostas);
        }

        @PutMapping
        public ResponseEntity<?> updateProposta
                (
                        @Valid
                        @RequestBody
                        PropostaRequestDTO dto,
                        @RequestParam Integer id,
                        @AuthenticationPrincipal
                        UserDetails userDetails
                ) {
                return propostaService.updateProposta(dto, id, userDetails);
        }

        // private boolean isUserLoggedIn(){
        // return SecurityContextHolder.getContext().getAuthentication() != null &&
        // SecurityContextHolder.getContext().getAuthentication().isAuthenticated() &&
        // SecurityContextHolder.getContext().getAuthentication().getPrincipal() !=
        // "anonymousUser";
        // }

        
}
