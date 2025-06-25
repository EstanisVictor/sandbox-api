package authsecurity.services.Interfaces;

import authsecurity.dto.LoginRequest;
import authsecurity.dto.LoginResponse;

public interface ITokenService {
    LoginResponse generateToken(LoginRequest loginRequest);
}
