package aikora_backend.controller;
import aikora_backend.entity.User;
import aikora_backend.repository.UserRepository;
import aikora_backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    public UserController(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    private Map<String, Object> publicUser(User user) {
        return Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "createdAt", user.getCreatedAt()
        );
    }
    @GetMapping
    public ResponseEntity<List<?>> getAllUsers() {
        var users = userRepository.findAll()
                .stream()
                .map(this::publicUser)
                .toList();
        return ResponseEntity.ok(users);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(publicUser(user)))
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        String name = (request.fullName != null && !request.fullName.isBlank()) ? request.fullName : request.name;
        if (name == null || name.isBlank()
                || request.email == null || request.email.isBlank()
                || request.password == null || request.password.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Name, email, and password (at least 6 characters) are required."));
        }
        String email = request.email.trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email is already registered."));
        }
        User user = new User();
        user.setFullName(name.trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password));
        User savedUser = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(publicUser(savedUser));
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        if (request.email == null || request.email.isBlank()
                || request.password == null || request.password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email and password are required."));
        }
        String email = request.email.trim().toLowerCase();
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(request.password, user.getPassword()))
                .map(user -> {
                    String token = jwtService.generateToken(user.getEmail());
                    return ResponseEntity.ok(Map.of(
                            "token", token,
                            "user", publicUser(user)
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password.")));
    }
    public static class RegisterRequest {
        public String fullName;
        public String name;
        public String email;
        public String password;
    }
    public static class LoginRequest {
        public String email;
        public String password;
    }
}

