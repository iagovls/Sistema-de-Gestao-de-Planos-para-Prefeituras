package com.planmanager.www.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.planmanager.www.model.categorias.Categoria;
import com.planmanager.www.model.eixos.Eixo;
import com.planmanager.www.model.orgaos.OrgaoGestor;
import com.planmanager.www.model.planos.Plano;
import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.propostas.PropostaSnapshot;
import com.planmanager.www.repositories.PropostaSnapshotRepository;

@Service
public class PropostaSnapshotService {

    @Autowired
    private PropostaSnapshotRepository propostaSnapshotRepository;

    public void criarSnapshot(Proposta proposta, Plano plano, Eixo eixo, 
                             Categoria categoria, OrgaoGestor orgaoGestor, 
                             String modificadoPor) {
        
        PropostaSnapshot propostaSnapshot = new PropostaSnapshot();
        propostaSnapshot.setPlanoTitulo(plano.getTitulo());
        propostaSnapshot.setEixoTitulo(eixo.getTitulo());
        propostaSnapshot.setCategoriaTitulo(categoria.getTitulo());
        propostaSnapshot.setOrgaoGestorTitulo(orgaoGestor.getTitulo());
        
        // ajustar para horário de brasilia
        propostaSnapshot.setDataModificacao(new Date());
        propostaSnapshot.setModificadoPor(modificadoPor);
        
        propostaSnapshot.setProposta(proposta);
        propostaSnapshot.setStatus(proposta.getStatus());
        propostaSnapshot.setMotivo(proposta.getMotivo());
        propostaSnapshot.setTitulo(proposta.getTitulo());
        propostaSnapshot.setMeta(proposta.getMeta());
        propostaSnapshot.setMetaPermanente(proposta.getMetaPermanente());
        
        propostaSnapshotRepository.save(propostaSnapshot);
    }
    
    public void criarSnapshotEmLote(Iterable<Proposta> propostas) {
        for (Proposta proposta : propostas) {
            criarSnapshot(proposta, proposta.getPlano(), proposta.getEixo(), 
                         proposta.getCategoria(), proposta.getOrgaoGestor(), 
                         "System");
        }
    }
}