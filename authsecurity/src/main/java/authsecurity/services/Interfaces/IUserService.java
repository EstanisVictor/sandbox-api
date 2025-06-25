package authsecurity.services.Interfaces;

import authsecurity.dto.CreateUserDto;
import authsecurity.models.User;

import java.util.List;

public interface IUserService {
    void createUser(CreateUserDto createUserDto);

    List<User> listUsers();
}
