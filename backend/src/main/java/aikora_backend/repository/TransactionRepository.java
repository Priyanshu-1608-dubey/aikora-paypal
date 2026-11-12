package aikora_backend.repository;

import aikora_backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
}