package authsecurity.config;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import authsecurity.models.Role;
import authsecurity.models.User;
import authsecurity.repositories.RoleRepository;
import authsecurity.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class AdminUserCOnfig implements CommandLineRunner {

    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;

    
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        var roleAdmin = roleRepository.findByName(Role.Values.ADMIN.name());
        var userAdmin = userRepository.findByUsername("EstanisAdmin");

        userAdmin.ifPresentOrElse(
            user -> {
                System.out.println("Admin user already exists, skipping creation.");
            },
            () -> {
                var newUser = new User();
                newUser.setUsername("EstanisAdmin");
                newUser.setPassword(passwordEncoder.encode("admin"));
                newUser.setRoles(Set.of(roleAdmin));
                newUser.setEmail("victorestanislau1@gmail.com");
                userRepository.save(newUser);
            }
        );
    }
}
