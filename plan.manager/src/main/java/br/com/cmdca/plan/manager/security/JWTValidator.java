package br.com.cmdca.plan.manager.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

public class JWTValidator {

    public static JWTObject create(String token, String key) {
        // Remove o prefixo (ex: "Bearer ")
        token = token.replace(JWTCreator.PREFIX, "").trim();

        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();

        JWTObject jwtObject = new JWTObject();
        jwtObject.setSubject(claims.getSubject());
        jwtObject.setIssuedAt(claims.getIssuedAt());
        jwtObject.setExpiration(claims.getExpiration());

        String roles = (String) claims.get("roles");
        jwtObject.setRoles(Arrays.asList(roles.split(",")));

        return jwtObject;
    }
}
