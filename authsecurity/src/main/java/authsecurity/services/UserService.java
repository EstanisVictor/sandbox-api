package authsecurity.services;

import authsecurity.dto.CreateUserDto;
import authsecurity.exceptions.UserAlreadyExistsException;
import authsecurity.models.Role;
import authsecurity.models.User;
import authsecurity.repositories.RoleRepository;
import authsecurity.repositories.UserRepository;
import authsecurity.services.Interfaces.IUserService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public void createUser(CreateUserDto dto) {
        var basicRole = roleRepository.findByName(Role.Values.BASIC.name());

        if (userRepository.findByUsername(dto.username()).isPresent()) {
            throw new UserAlreadyExistsException("Username '" + dto.username() + "' is already taken.");
        }

        if(userRepository.findByEmail(dto.email()).isPresent()) {
            throw new UserAlreadyExistsException("Email '" + dto.email() + "' is already registered.");
        }

        var user = new User();
        user.setUsername(dto.username());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRoles(Set.of(basicRole));
        user.setEmail(dto.email());

        userRepository.save(user);
    }

    @Override
    public List<User> listUsers() {
        return userRepository.findAll();
    }
}
