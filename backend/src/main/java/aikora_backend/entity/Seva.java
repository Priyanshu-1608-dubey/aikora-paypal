package aikora_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "sevas")
public class Seva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_circle_id")
    private FamilyCircle familyCircle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, length = 30)
    private String status = "OPEN";

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Seva() {
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
