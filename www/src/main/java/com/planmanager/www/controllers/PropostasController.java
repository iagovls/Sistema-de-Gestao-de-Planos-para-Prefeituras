package com.planmanager.www.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.planmanager.www.repositories.CategoriasRepository;
import com.planmanager.www.repositories.EixosRepository;
import com.planmanager.www.repositories.OrgaosGestoresRepository;
import com.planmanager.www.repositories.PlanosRepository;
import com.planmanager.www.repositories.PrefeituraRepository;
import com.planmanager.www.repositories.PropostaRepository;
import com.planmanager.www.service.PropostaSnapshotService;
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

        @Autowired
        private PropostaSnapshotService propostaSnapshotService;

        @PostMapping
        public ResponseEntity<PropostaRequestDTO> createProposta(@Valid @RequestBody PropostaRequestDTO dto,
                        @AuthenticationPrincipal UserDetails userDetails) {
                // verificar se o usuário está autenticado
                if (userDetails == null) {
                        throw new RuntimeException("Usuário não autenticado");
                }
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

                // salvar uma cópia da proposta no histórico em propostaSnapshot
                
                propostaSnapshotService.criarSnapshot(proposta, plano, eixo, categoria, orgaoGestor, userDetails.getUsername());

                return ResponseEntity.ok(dto);
        }

        @PostMapping("/lote")
        public ResponseEntity<List<PropostaRequestDTO>> salvarEmLote(
                        @Valid @RequestBody List<PropostaRequestDTO> dtos) {
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
                propostaSnapshotService.criarSnapshotEmLote(propostas);
                return ResponseEntity.ok(dtos);
        }

        @GetMapping("/por-prefeitura")
        public ResponseEntity<List<PropostaGetDTO>> getPropostasPorPrefeitura(
                        @RequestParam Long prefeituraId,
                        @AuthenticationPrincipal UserDetails userDetails) {

                // @AuthenticationPrincipal

                List<PropostaGetDTO> propostas = propostaRepository.findByPrefeituraId(prefeituraId)
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
        public ResponseEntity<PropostaGetDTO> getPropostasPorId(@PathVariable Long id) {
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
        public ResponseEntity<?> updateProposta(@Valid @RequestBody PropostaRequestDTO dto, @RequestParam Long id, @AuthenticationPrincipal UserDetails userDetails) {
                // se a meta não for permanente, e a meta for vazia, retorna erro
                if(!dto.metaPermanente() && dto.meta() == null) {
                        return ResponseEntity.badRequest().body("Se a meta não for permanente, informe a meta.");
                }
                if(userDetails == null) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado");
                }
                if (!propostaRepository.existsById(id)) {
                        return ResponseEntity.notFound().build();
                }
                Proposta proposta = propostaRepository.findById(id).get();
                Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId())
                                .orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
                Plano plano = planosRepository.findById(dto.planoId())
                                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));
                Eixo eixo = eixosRepository.findById(dto.eixoId())
                                .orElseThrow(() -> new RuntimeException("Eixo não encontrado"));
                Categoria categoria = categoriasRepository.findById(dto.categoriaId())
                                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
                OrgaoGestor orgaoGestor = orgaosGestoresRepository.findById(dto.orgaoGestorId())
                                .orElseThrow(() -> new RuntimeException("Órgão gestor não encontrado"));
                proposta = PropostaMapper.toEntity(dto, prefeitura, plano, eixo, categoria, orgaoGestor);
                proposta.setId(id); // Mantém o ID original
                propostaRepository.save(proposta);
                
                propostaSnapshotService.criarSnapshot(proposta, plano, eixo, categoria, orgaoGestor, userDetails.getUsername());
                return ResponseEntity.ok(dto);
        }

        // private boolean isUserLoggedIn(){
        // return SecurityContextHolder.getContext().getAuthentication() != null &&
        // SecurityContextHolder.getContext().getAuthentication().isAuthenticated() &&
        // SecurityContextHolder.getContext().getAuthentication().getPrincipal() !=
        // "anonymousUser";
        // }

        
}
