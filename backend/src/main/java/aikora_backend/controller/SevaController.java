package aikora_backend.controller;

import aikora_backend.entity.*;
import aikora_backend.repository.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/sevas")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class SevaController {
    private final SevaRepository sevaRepo;
    private final FamilyCircleRepository circleRepo;
    private final UserRepository userRepo;

    public SevaController(SevaRepository sevaRepo, FamilyCircleRepository circleRepo, UserRepository userRepo) {
        this.sevaRepo = sevaRepo;
        this.circleRepo = circleRepo;
        this.userRepo = userRepo;
    }

    @GetMapping
    public ResponseEntity<?> getAllSevas() {
        return ResponseEntity.ok(sevaRepo.findAll());
    }

    @GetMapping("/circle/{circleId}")
    public ResponseEntity<?> getCircleSevas(@PathVariable Long circleId) {
        if (!circleRepo.existsById(circleId)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(sevaRepo.findByFamilyCircleIdOrderByCreatedAtDesc(circleId));
    }

    @PostMapping
    public ResponseEntity<?> createSeva(@RequestBody CreateSevaRequest request) {
        if (request.createdBy == null || request.title == null || request.title.isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Creator ID and title are required."));
        User creator = userRepo.findById(request.createdBy).orElse(null);
        if (creator == null) return ResponseEntity.badRequest().body(Map.of("message", "Creator user not found."));
        FamilyCircle circle = null;
        if (request.familyCircleId != null) {
            circle = circleRepo.findById(request.familyCircleId).orElse(null);
            if (circle == null) return ResponseEntity.badRequest().body(Map.of("message", "Family circle not found."));
        }
        Seva seva = new Seva();
        seva.setCreatedBy(creator);
        seva.setFamilyCircle(circle);
        seva.setTitle(request.title.trim());
        seva.setDescription(request.description == null ? "" : request.description.trim());
        Seva saved = sevaRepo.save(seva);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", saved.getId(), "title", saved.getTitle(), "createdBy", creator.getId(), "status", saved.getStatus()));
    }

    public static class CreateSevaRequest {
        public Long familyCircleId;
        public Long createdBy;
        public String title;
        public String description;
    }
}
