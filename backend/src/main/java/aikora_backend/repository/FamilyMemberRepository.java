package aikora_backend.repository;

import aikora_backend.entity.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {

    List<FamilyMember> findByFamilyCircleId(Long familyCircleId);

    boolean existsByFamilyCircleIdAndUserId(Long familyCircleId, Long userId);
}