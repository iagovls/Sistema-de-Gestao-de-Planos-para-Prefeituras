package br.com.cmdca.plan.manager.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

public class JWTCreator {

    public static final String PREFIX = "Bearer ";
    public static final String HEADER_AUTHORIZATION = "Authorization";

    public static String create(String prefix, String key, JWTObject jwtObject) {
        String token = Jwts.builder()
                .setSubject(jwtObject.getSubject()) // Usuário (ID ou username)
                .setIssuedAt(jwtObject.getIssuedAt()) // Data de criação do token
                .setExpiration(jwtObject.getExpiration()) // Expiração
                .claim("roles", jwtObject.getRoles().stream().collect(Collectors.joining(","))) // Lista de papéis (roles)
                .signWith(SignatureAlgorithm.HS512, key) // Algoritmo + chave secreta
                .compact();

        return prefix + " " + token;
    }
}

