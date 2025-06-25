package authsecurity.controllers;

import authsecurity.dto.LoginRequest;
import authsecurity.dto.LoginResponse;
import authsecurity.services.TokenService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class TokenController {
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        var loginResponse = tokenService.generateToken(loginRequest);
        return ResponseEntity.ok(loginResponse);
    }
}