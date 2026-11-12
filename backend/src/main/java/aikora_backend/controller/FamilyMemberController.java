package aikora_backend.controller;

import aikora_backend.entity.*;
import aikora_backend.repository.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/family-members")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class FamilyMemberController {
    private final FamilyMemberRepository memberRepo;
    private final FamilyCircleRepository circleRepo;
    private final UserRepository userRepo;

    public FamilyMemberController(FamilyMemberRepository memberRepo, FamilyCircleRepository circleRepo, UserRepository userRepo) {
        this.memberRepo = memberRepo;
        this.circleRepo = circleRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/circle/{circleId}")
    public ResponseEntity<?> getMembers(@PathVariable Long circleId) {
        if (!circleRepo.existsById(circleId)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(memberRepo.findByFamilyCircleId(circleId));
    }

    @PostMapping
    public ResponseEntity<?> addMember(@RequestBody AddMemberRequest request) {
        if (request.familyCircleId == null || request.userId == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Circle ID and user ID are required."));
        FamilyCircle circle = circleRepo.findById(request.familyCircleId).orElse(null);
        User user = userRepo.findById(request.userId).orElse(null);
        if (circle == null || user == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Circle or user not found."));
        if (memberRepo.existsByFamilyCircleIdAndUserId(circle.getId(), user.getId()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "User is already a member."));
        FamilyMember member = new FamilyMember();
        member.setFamilyCircle(circle);
        member.setUser(user);
        member.setRole(request.role == null || request.role.isBlank() ? "MEMBER" : request.role.trim());
        FamilyMember saved = memberRepo.save(member);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", saved.getId(), "familyCircleId", circle.getId(), "userId", user.getId(), "role", saved.getRole()));
    }

    public static class AddMemberRequest {
        public Long familyCircleId;
        public Long userId;
        public String role;
    }
}
