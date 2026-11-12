package aikora_backend.repository;

import aikora_backend.entity.Seva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SevaRepository extends JpaRepository<Seva, Long> {

    List<Seva> findByFamilyCircleIdOrderByCreatedAtDesc(Long familyCircleId);
}