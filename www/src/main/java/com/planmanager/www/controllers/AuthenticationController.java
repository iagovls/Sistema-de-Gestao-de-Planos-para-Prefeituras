package com.planmanager.www.controllers;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.planmanager.www.model.passwordToken.PasswordResetToken;
import com.planmanager.www.model.prefeituras.Prefeitura;
import com.planmanager.www.model.users.User;
import com.planmanager.www.model.users.UserRole;
import com.planmanager.www.model.users.dto.AuthenticationDTO;
import com.planmanager.www.model.users.dto.LoginResponseDTO;
import com.planmanager.www.model.users.dto.RegisterDTO;
import com.planmanager.www.model.users.dto.ResetPasswordDTO;
import com.planmanager.www.model.users.dto.ResetPasswordMailDTO;
import com.planmanager.www.model.users.dto.UpdatePasswordDTO;
import com.planmanager.www.model.users.dto.UserResponseDTO;
import com.planmanager.www.repositories.PrefeituraRepository;
import com.planmanager.www.repositories.UserRepository;
import com.planmanager.www.security.PasswordGenerator;
import com.planmanager.www.security.TokenService;
import com.planmanager.www.services.EmailService;
import com.planmanager.www.services.PasswordResetTokenService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;

@RestController
@CrossOrigin
@RequestMapping("/api/auth")
@Tag(name = "Users", description = "User management API")
@SecurityRequirement(name = "bearerAuth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository repository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private PrefeituraRepository prefeituraRepository;
    @Autowired
    private PasswordResetTokenService passwordResetTokenService;
    @Autowired
    private EmailService emailService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password()); // Cria um token
                                                                                                       // de
                                                                                                       // autenticação
                                                                                                       // (login +
                                                                                                       // senha) para o
                                                                                                       // Spring
                                                                                                       // Security
                                                                                                       // validar.

        var auth = this.authenticationManager.authenticate(usernamePassword); // Pede para o AuthenticationManager
                                                                              // validar o token. Se for inválido, lança
                                                                              // exceção automaticamente
                                                                              // (BadCredentialsException). Se for
                                                                              // válido, retorna um objeto
                                                                              // Authentication com o usuário
                                                                              // autenticado.

        var token = tokenService.generateToken((User) auth.getPrincipal()); // auth.getPrincipal() retorna o usuario
                                                                            // logado

        return ResponseEntity.ok(new LoginResponseDTO(token)); // Retorna uma resposta HTTP 200 OK com o token JWT no
                                                               // corpo, como JSON.
    }

    @PostMapping("/register")
    @Operation(summary = "Create a new user")
    public ResponseEntity<?> register(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody RegisterDTO data) {
        Long prefeituraId = ((User) userDetails).getPrefeitura() != null ? ((User) userDetails).getPrefeitura().getId() : null;
              
        if (((User) userDetails).getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        }

        if (prefeituraId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Prefeitura não informada");
        }
        
        Prefeitura prefeitura = prefeituraRepository.findById(prefeituraId).orElseThrow(() -> new RuntimeException("Prefeitura não encontrada"));
        
        // gerar uma senha aleatória
        String password = PasswordGenerator.generateRandomPassword(); // Gera uma senha aleatória
        String encryptedPassword = new BCryptPasswordEncoder().encode(password); // Encripta a senha usando BCrypt

        // Sempre define a role como USER ao registrar
        User newUser = new User(
            data.userName(), 
            data.email(), 
            encryptedPassword, 
            UserRole.USER, 
            prefeitura);


        this.repository.save(newUser);

        return ResponseEntity.ok().build();
    }

   


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado");
        }

        User user = (User) repository.findByEmail(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserResponseDTO responseDTO = new UserResponseDTO(user.getId(), user.getCompleteName(), user.getEmail(), user.getRole(), user.getPrefeitura() != null ? user.getPrefeitura().getId() : null);
        // var auth = SecurityContextHolder.getContext().getAuthentication();
        // boolean userIsNull = auth.getPrincipal() == null;
        // System.out.println("User is null? " + userIsNull);
        // System.out.println("Authorities: " + auth.getAuthorities());
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/update-password")
    @Operation(summary = "Update user password")
    public ResponseEntity<?> updatePassword(@RequestBody @Valid UpdatePasswordDTO data) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = repository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (!encoder.matches(data.oldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha antiga incorreta");
        }

        user.setPassword(encoder.encode(data.newPassword()));
        repository.save(user);

        return ResponseEntity.ok("Senha atualizada com sucesso");
    }

    @GetMapping("/get-all")
    @Operation(summary = "Get all users")
    public ResponseEntity<?> getAllUsers(@AuthenticationPrincipal UserDetails userDetails) {

        // se o usuário for admin, retorna todos os usuarios e filtra por prefeitura
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado");
        }

        if (userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            List<User> users = repository.findAll();            

            List<UserResponseDTO> userResponses = users.stream().map( u -> {
                if (u.getPrefeitura() == null) { 
                    return null;
                }
                // Se o usuário for da mesma prefeitura do usuário autenticado, retorna o DTO
                if (u.getPrefeitura().getId() != null && 
                    ((User) userDetails).getPrefeitura() != null && 
                    !u.getId().equals(((User) userDetails).getId()) &&
                    u.getPrefeitura().getId().equals(((User) userDetails).getPrefeitura().getId())) {
                    return new UserResponseDTO(u.getId(), u.getCompleteName(), u.getEmail(), u.getRole(), u.getPrefeitura() != null ? u.getPrefeitura().getId() : null);
                }
                return null;
            }).filter(u -> u != null).collect(Collectors.toList());
            return ResponseEntity.ok(userResponses);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado"); 
        }   
    }

    @DeleteMapping("/delete")
    @Operation(summary = "Delete a user")
    public ResponseEntity<?> deleteUserById(@RequestParam String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = repository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }

        if (user.getRole() != UserRole.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        }

        User userToDelete = repository.findById(id).orElse(null);
        if (userToDelete == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }

        repository.delete(userToDelete);
        return ResponseEntity.ok("Usuário deletado com sucesso");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDTO data) {
        try {
            passwordResetTokenService.validateToken(data.token());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
        if (!data.password().equals(data.confirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("As senhas não coincidem");
        }

        PasswordResetToken resetToken = passwordResetTokenService.getByToken(data.token());
        User user = resetToken.getUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(data.password()));
        repository.save(user);
        passwordResetTokenService.markAsUsed(resetToken);
        return ResponseEntity.ok("Senha redefinida com sucesso");
    }
    
    @PostMapping("/send-reset-password-email")
    @Operation(summary = "Send reset password email")
    public ResponseEntity<?> sendEmailResetPassword(@RequestBody ResetPasswordMailDTO data) {
        User user = repository.findByEmail(data.email());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }
        PasswordResetToken token = passwordResetTokenService.createToken(user);
        try {
            emailService.sendResetPasswordEmail(user.getCompleteName(), user.getEmail(), token.getToken());
        } catch (MessagingException | IOException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao enviar email");
        }
        return ResponseEntity.ok("Email de redefinição de senha enviado");
    }
}
