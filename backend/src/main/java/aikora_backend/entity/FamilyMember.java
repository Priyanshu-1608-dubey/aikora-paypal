package aikora_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "family_members",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"family_circle_id", "user_id"}
        )
    }
)
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_circle_id", nullable = false)
    private FamilyCircle familyCircle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 30)
    private String role = "MEMBER";

    @Column(nullable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public FamilyMember() {
    }

    public Long getId() {
        return id;
    }

    public FamilyCircle getFamilyCircle() {
        return familyCircle;
    }

    public void setFamilyCircle(FamilyCircle familyCircle) {
        this.familyCircle = familyCircle;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }
}