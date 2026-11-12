package aikora_backend.repository;

import aikora_backend.entity.Celebration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CelebrationRepository extends JpaRepository<Celebration, Long> {

    List<Celebration> findByFamilyCircleIdOrderByCelebrationDateAsc(Long familyCircleId);
}