package aikora_backend.controller;

import aikora_backend.entity.*;
import aikora_backend.repository.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/wallets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class WalletController {
    private final WalletRepository walletRepo;
    private final UserRepository userRepo;

    public WalletController(WalletRepository walletRepo, UserRepository userRepo) {
        this.walletRepo = walletRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getWallet(@PathVariable Long userId) {
        return walletRepo.findByUserId(userId)
                .<ResponseEntity<?>>map(w -> ResponseEntity.ok(Map.of("id", w.getId(), "userId", userId, "balance", w.getBalance(), "currency", w.getCurrency(), "createdAt", w.getCreatedAt())))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createWallet(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body(Map.of("message", "User not found."));
        if (walletRepo.findByUserId(userId).isPresent()) return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Wallet already exists."));
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        Wallet saved = walletRepo.save(wallet);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", saved.getId(), "userId", userId, "balance", saved.getBalance(), "currency", saved.getCurrency()));
    }
}
