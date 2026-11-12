package aikora_backend.controller;

import aikora_backend.entity.*;
import aikora_backend.repository.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class TransactionController {
    private final TransactionRepository transactionRepo;
    private final WalletRepository walletRepo;

    public TransactionController(TransactionRepository transactionRepo, WalletRepository walletRepo) {
        this.transactionRepo = transactionRepo;
        this.walletRepo = walletRepo;
    }

    @GetMapping("/wallet/{walletId}")
    public ResponseEntity<?> getTransactions(@PathVariable Long walletId) {
        if (!walletRepo.existsById(walletId)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(transactionRepo.findByWalletIdOrderByCreatedAtDesc(walletId));
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request) {
        if (request.walletId == null || request.amount == null || request.amount.compareTo(BigDecimal.ZERO) <= 0 || request.type == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Wallet ID, positive amount, and transaction type are required."));
        Wallet wallet = walletRepo.findById(request.walletId).orElse(null);
        if (wallet == null) return ResponseEntity.badRequest().body(Map.of("message", "Wallet not found."));
        TransactionType type;
        try { type = TransactionType.valueOf(request.type.toUpperCase()); }
        catch (IllegalArgumentException ex) { return ResponseEntity.badRequest().body(Map.of("message", "Invalid transaction type.")); }

        BigDecimal balance = wallet.getBalance();
        if (type == TransactionType.DEPOSIT || type == TransactionType.REFUND) {
            wallet.setBalance(balance.add(request.amount));
        } else {
            if (balance.compareTo(request.amount) < 0)
                return ResponseEntity.badRequest().body(Map.of("message", "Insufficient wallet balance."));
            wallet.setBalance(balance.subtract(request.amount));
        }
        walletRepo.save(wallet);
        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setAmount(request.amount);
        transaction.setType(type);
        transaction.setDescription(request.description == null ? "" : request.description.trim());
        Transaction saved = transactionRepo.save(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", saved.getId(), "walletId", wallet.getId(), "amount", saved.getAmount(), "type", saved.getType(), "description", saved.getDescription(), "balance", wallet.getBalance(), "createdAt", saved.getCreatedAt()));
    }

    public static class TransactionRequest {
        public Long walletId;
        public BigDecimal amount;
        public String type;
        public String description;
    }
}
