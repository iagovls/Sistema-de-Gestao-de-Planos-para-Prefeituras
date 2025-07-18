package com.planmanager.www.controllers;

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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.planmanager.www.model.propostas.Proposta;
import com.planmanager.www.model.users.User;
import com.planmanager.www.model.users.UserRole;
import com.planmanager.www.model.users.dto.AuthenticationDTO;
import com.planmanager.www.model.users.dto.LoginResponseDTO;
import com.planmanager.www.model.users.dto.RegisterDTO;
import com.planmanager.www.model.users.dto.UpdatePasswordDTO;
import com.planmanager.www.model.users.dto.UserResponseDTO;
import com.planmanager.www.repositories.UserRepository;
import com.planmanager.www.security.TokenService;
import com.planmanager.www.repositories.PropostaRepository;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository repository;
    @Autowired
    private TokenService tokenService;
    

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody AuthenticationDTO data) {
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
    public ResponseEntity register(@RequestBody RegisterDTO data) {
        if (this.repository.findByEmail(data.email()) != null)
            return ResponseEntity.badRequest().build();

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        // Sempre define a role como USER ao registrar
        User newUser = new User(data.userName(), data.email(), encryptedPassword, UserRole.USER);

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
        
        UserResponseDTO responseDTO = new UserResponseDTO(user.getCompleteName(), user.getEmail());
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody UpdatePasswordDTO data) {
        System.out.println(data);
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
}
