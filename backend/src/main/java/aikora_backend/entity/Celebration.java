package aikora_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "celebrations")
public class Celebration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_circle_id", nullable = false)
    private FamilyCircle familyCircle;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String title;

    @NotNull
    @Column(nullable = false)
    private LocalDate celebrationDate;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Celebration() {
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getCelebrationDate() {
        return celebrationDate;
    }

    public void setCelebrationDate(LocalDate celebrationDate) {
        this.celebrationDate = celebrationDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}