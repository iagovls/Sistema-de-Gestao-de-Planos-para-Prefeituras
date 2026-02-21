package com.planmanager.www.swagger;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
// import io.swagger.v3.oas.models.Components;
// import io.swagger.v3.oas.models.security.SecurityScheme;
// import io.swagger.v3.oas.models.security.SecurityRequirement;

// import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info (
                title = "User Management API",
                version = "1.0",
                description = "API for user management with JWT authentication",
                contact = @io.swagger.v3.oas.annotations.info.Contact (
                        name = "API Support",
                        email = "support@example.com"
                ),
                license = @License(
                        name = "Apache 2.0",
                        url = "https://www.apache.org/licenses/LICENSE-2.0"
                )
        ),
        servers = {
                @Server(
                        url = "http://localhost:8080",
                        description = "Development server"
                )
        }
)
@io.swagger.v3.oas.annotations.security.SecurityScheme (
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class SwaggerConfig {

//     @Bean
//     public OpenAPI customOpenAPI() {
//         final String securitySchemeName = "bearerAuth";
        
//         return new OpenAPI()
//                 .info(new Info()
//                         .title("Sistema de Gestão de Planos para Prefeituras")
//                         .description("API para gerenciamento de propostas, planos e prefeituras")
//                         .version("1.0")
//                         .contact(new Contact()
//                                 .name("Iago Silva")
//                                 .email("iago@email.com")
//                                 .url("https://meusite.com")))
//                 .components(new Components()
//                         .addSecuritySchemes(securitySchemeName,
//                                 new SecurityScheme()
//                                         .type(SecurityScheme.Type.HTTP)
//                                         .scheme("bearer")
//                                         .bearerFormat("JWT")))
//                 .addSecurityItem(new SecurityRequirement().addList(securitySchemeName));
//     }
}
