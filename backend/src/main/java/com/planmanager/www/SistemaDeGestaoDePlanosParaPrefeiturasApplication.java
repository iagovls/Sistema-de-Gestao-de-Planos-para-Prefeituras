package com.planmanager.www;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;



@SpringBootApplication
@EnableScheduling
public class SistemaDeGestaoDePlanosParaPrefeiturasApplication {

	public static void main(String[] args) {
		SpringApplication.run(SistemaDeGestaoDePlanosParaPrefeiturasApplication.class, args);
		
	}

}
