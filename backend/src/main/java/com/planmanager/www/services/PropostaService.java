package com.planmanager.www.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.propostas.dto.PropostaRequestDTO;
import com.planmanager.www.model.categorias.Categoria;
import com.planmanager.www.model.eixos.Eixo;
import com.planmanager.www.model.orgaos.OrgaoGestor;
import com.planmanager.www.model.planos.Plano;
import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.repositories.CategoriasRepository;
import com.planmanager.www.repositories.EixosRepository;
import com.planmanager.www.repositories.OrgaosGestoresRepository;
import com.planmanager.www.repositories.PlanosRepository;
import com.planmanager.www.repositories.PrefeituraRepository;
import com.planmanager.www.repositories.PropostaRepository;
import com.planmanager.www.utils.PropostaMapper;
import org.springframework.stereotype.Service;

@Service
public class PropostaService {

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

    public ResponseEntity<PropostaRequestDTO> createProposta(PropostaRequestDTO dto, UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("Usuário não autenticado");
        }

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

        if (!validarCategoriaDaMesmaPrefeitura(dto.prefeituraId(), categoria)){
                return ResponseEntity.badRequest().build();
        }
        if (!validarEixoDaMesmaPrefeitura(dto.prefeituraId(), eixo)){
                return ResponseEntity.badRequest().build();
        }
        if (!validarPlanoDaMesmaPrefeitura(dto.prefeituraId(), plano)){
                return ResponseEntity.badRequest().build();
        }
        if (!validarOrgaoGestorDaMesmaPrefeitura(dto.prefeituraId(), orgaoGestor)){
                return ResponseEntity.badRequest().build();
        }

        Proposta proposta = PropostaMapper.toEntity(dto, prefeitura, plano, eixo, categoria, orgaoGestor);
        propostaRepository.save(proposta);
        propostaSnapshotService.criarSnapshot(proposta, plano, eixo, categoria, orgaoGestor, userDetails.getUsername());

        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<List<PropostaRequestDTO>> salvarEmLote(List<PropostaRequestDTO> dtos) {
        List<Proposta> propostas;
        try {
            propostas = dtos.stream().map(dto -> {
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

                if (!validarCategoriaDaMesmaPrefeitura(dto.prefeituraId(), categoria)){
                    throw new IllegalArgumentException();
                }
                if (!validarEixoDaMesmaPrefeitura(dto.prefeituraId(), eixo)){
                    throw new IllegalArgumentException();
                }
                if (!validarPlanoDaMesmaPrefeitura(dto.prefeituraId(), plano)){
                    throw new IllegalArgumentException();
                }
                if (!validarOrgaoGestorDaMesmaPrefeitura(dto.prefeituraId(), orgaoGestor)){
                    throw new IllegalArgumentException();
                }

                return PropostaMapper.toEntity(dto, prefeitura, plano, eixo, categoria, orgaoGestor);
            }).toList();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        propostaRepository.saveAll(propostas);
        propostaSnapshotService.criarSnapshotEmLote(propostas);
        return ResponseEntity.ok(dtos);
    }

    public ResponseEntity<?> updateProposta(PropostaRequestDTO dto, Integer id, UserDetails userDetails) {
        if (!Boolean.TRUE.equals(dto.metaPermanente()) && dto.meta() == null) {
            return ResponseEntity.badRequest().body("Se a meta não for permanente, informe a meta.");
        }
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado");
        }
        if (!propostaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Prefeitura prefeitura = prefeituraRepository.findById(dto.prefeituraId())
                .orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
        Plano plano = planosRepository.findById(dto.planoId())
                .orElseThrow(() -> new RuntimeException("Plano não encontrado"));
        Eixo eixo = eixosRepository.findById(dto.eixoId())
                .orElseThrow(() -> new RuntimeException("Eixo não encontrado"));
        if (!validarEixoDaMesmaPrefeitura(dto.prefeituraId(), eixo)){
                return ResponseEntity.badRequest().build();
        }
        Categoria categoria = categoriasRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        if (!validarCategoriaDaMesmaPrefeitura(dto.prefeituraId(), categoria)){
                return ResponseEntity.badRequest().build();
        }
        OrgaoGestor orgaoGestor = orgaosGestoresRepository.findById(dto.orgaoGestorId())
                .orElseThrow(() -> new RuntimeException("Órgão gestor não encontrado"));

        if (!validarPlanoDaMesmaPrefeitura(dto.prefeituraId(), plano)){
                return ResponseEntity.badRequest().build();
        }
        if (!validarOrgaoGestorDaMesmaPrefeitura(dto.prefeituraId(), orgaoGestor)){
                return ResponseEntity.badRequest().build();
        }

        Proposta proposta = PropostaMapper.toEntity(dto, prefeitura, plano, eixo, categoria, orgaoGestor);
        proposta.setId(id);
        propostaRepository.save(proposta);

        propostaSnapshotService.criarSnapshot(
                proposta,
                plano,
                eixo,
                categoria,
                orgaoGestor,
                userDetails.getUsername());
        return ResponseEntity.ok(dto);
    }

    private boolean validarPlanoDaMesmaPrefeitura(int prefeituraId, Plano plano) {
        return plano.getPrefeitura().getId() == prefeituraId;
    }

    private boolean validarEixoDaMesmaPrefeitura(int prefeituraId, Eixo eixo) {
        return eixo.getPrefeitura().getId() == prefeituraId;
    }

    private boolean validarCategoriaDaMesmaPrefeitura(int prefeituraId, Categoria categoria) {
        return categoria.getPrefeitura().getId() == prefeituraId;
    }

    private boolean validarOrgaoGestorDaMesmaPrefeitura(int prefeituraId, OrgaoGestor orgaoGestor) {
        return orgaoGestor.getPrefeitura().getId() == prefeituraId;
    }


}


