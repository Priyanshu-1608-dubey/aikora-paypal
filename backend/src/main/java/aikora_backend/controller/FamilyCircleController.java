package aikora_backend.controller;

import aikora_backend.entity.FamilyCircle;
import aikora_backend.entity.User;
import aikora_backend.repository.FamilyCircleRepository;
import aikora_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/family-circles")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class FamilyCircleController {

    private final FamilyCircleRepository familyCircleRepository;
    private final UserRepository userRepository;

    public FamilyCircleController(
            FamilyCircleRepository familyCircleRepository,
            UserRepository userRepository) {
        this.familyCircleRepository = familyCircleRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<FamilyCircle>> getAllFamilyCircles() {
        return ResponseEntity.ok(familyCircleRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FamilyCircle> getFamilyCircleById(@PathVariable Long id) {
        return familyCircleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createFamilyCircle(@RequestBody CreateFamilyCircleRequest request) {
        if (request.name == null || request.name.isBlank() || request.createdBy == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Circle name and creator ID are required."));
        }

        User creator = userRepository.findById(request.createdBy).orElse(null);
        if (creator == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Creator user was not found."));
        }

        FamilyCircle circle = new FamilyCircle();
        circle.setName(request.name.trim());
        circle.setCreatedBy(creator);

        FamilyCircle saved = familyCircleRepository.save(circle);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.getId(),
                "name", saved.getName(),
                "createdBy", creator.getId(),
                "createdAt", saved.getCreatedAt()
        ));
    }

    public static class CreateFamilyCircleRequest {
        public String name;
        public Long createdBy;
    }
}
