package com.planmanager.www;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.planos.Plano;
import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.repositories.PrefeituraRepository;
import com.planmanager.www.repositories.PropostaRepository;
import com.planmanager.www.repositories.PlanosRepository;

@SpringBootTest
class SistemaDeGestaoDePlanosParaPrefeiturasApplicationTests {

	@Mock
	PrefeituraRepository prefeituraRepository;

	@Mock
	PlanosRepository planoRepository;

	@Mock
	PropostaRepository propostaRepository;
	
	Prefeitura prefeitura = new Prefeitura();

	Plano plano = new Plano();

	@BeforeEach
	void setUp() {

		prefeitura.setId(1);
		plano.setId(5);
		plano.setPrefeitura(prefeitura);
	}


	@Test
	void contextLoads() {
	}

	@Test
	void validatePlanoBelongsToPrefeitura() {
		

		Proposta proposta = new Proposta();
		proposta.setPlano(plano);
		proposta.setPrefeitura(prefeitura);

		
		

	}

}
