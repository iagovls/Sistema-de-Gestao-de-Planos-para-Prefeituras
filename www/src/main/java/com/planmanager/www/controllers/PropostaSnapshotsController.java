package com.planmanager.www.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planmanager.www.model.propostas.PropostaSnapshot;
import com.planmanager.www.model.propostas.dto.PropostaSnapshotDTO;
import com.planmanager.www.repositories.PropostaSnapshotRepository;

@RestController
@RequestMapping("/propostas/historico")
public class PropostaSnapshotsController {

    @Autowired
    private PropostaSnapshotRepository propostaSnapshotRepository;

    @GetMapping("/{propostaId}")
    public List<PropostaSnapshotDTO> getHistoricoProposta(@PathVariable Long propostaId) {
        return propostaSnapshotRepository.findByPropostaId(propostaId).stream()
                .map(snapshot -> new PropostaSnapshotDTO(
                    snapshot.getId(),
                    snapshot.getTitulo(),
                    snapshot.getMeta(),
                    snapshot.getPlanoTitulo(),
                    snapshot.getEixoTitulo(),
                    snapshot.getCategoriaTitulo(),
                    snapshot.getOrgaoGestorTitulo(),
                    snapshot.getStatus(),
                    snapshot.getMotivo(),
                    snapshot.getMetaPermanente(),
                    snapshot.getModificadoPor(),
                    snapshot.getDataModificacao()
                ))
                .toList();
    }
}
