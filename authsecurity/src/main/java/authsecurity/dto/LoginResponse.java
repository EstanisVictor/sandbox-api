package authsecurity.dto;

public record LoginResponse(String accessToken, Long expiresIn) {
    
}
