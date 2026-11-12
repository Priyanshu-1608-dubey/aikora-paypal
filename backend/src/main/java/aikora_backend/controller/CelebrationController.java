package aikora_backend.controller;

import aikora_backend.entity.*;
import aikora_backend.repository.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/celebrations")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CelebrationController {
    private final CelebrationRepository celebrationRepo;
    private final FamilyCircleRepository circleRepo;
    private final UserRepository userRepo;

    public CelebrationController(CelebrationRepository celebrationRepo, FamilyCircleRepository circleRepo, UserRepository userRepo) {
        this.celebrationRepo = celebrationRepo;
        this.circleRepo = circleRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/circle/{circleId}")
    public ResponseEntity<?> getCelebrations(@PathVariable Long circleId) {
        if (!circleRepo.existsById(circleId)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(celebrationRepo.findByFamilyCircleIdOrderByCelebrationDateAsc(circleId));
    }

    @PostMapping
    public ResponseEntity<?> createCelebration(@RequestBody CreateCelebrationRequest request) {
        if (request.familyCircleId == null || request.createdBy == null || request.title == null || request.title.isBlank() || request.celebrationDate == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Circle ID, creator ID, title, and date are required."));
        FamilyCircle circle = circleRepo.findById(request.familyCircleId).orElse(null);
        User creator = userRepo.findById(request.createdBy).orElse(null);
        if (circle == null || creator == null) return ResponseEntity.badRequest().body(Map.of("message", "Circle or user not found."));
        Celebration celebration = new Celebration();
        celebration.setFamilyCircle(circle);
        celebration.setCreatedBy(creator);
        celebration.setTitle(request.title.trim());
        celebration.setCelebrationDate(request.celebrationDate);
        celebration.setDescription(request.description == null ? "" : request.description.trim());
        Celebration saved = celebrationRepo.save(celebration);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", saved.getId(), "familyCircleId", circle.getId(), "title", saved.getTitle(), "celebrationDate", saved.getCelebrationDate(), "createdBy", creator.getId()));
    }

    public static class CreateCelebrationRequest {
        public Long familyCircleId;
        public Long createdBy;
        public String title;
        public java.time.LocalDate celebrationDate;
        public String description;
    }
}
