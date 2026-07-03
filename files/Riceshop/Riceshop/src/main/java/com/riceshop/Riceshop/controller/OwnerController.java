package com.riceshop.Riceshop.controller;

import com.riceshop.Riceshop.model.Owner;
import com.riceshop.Riceshop.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    @Autowired
    private OwnerRepository ownerRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerOwner(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String storeName = body.get("storeName");
        String password = body.get("password");

        if (name == null || storeName == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Missing parameters."));
        }

        Optional<Owner> existing = ownerRepository.findByStoreName(storeName);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Owner Store Name is already registered."));
        }

        Owner owner = Owner.builder()
                .name(name)
                .storeName(storeName)
                .password(password)
                .build();
        ownerRepository.save(owner);

        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginOwner(@RequestBody Map<String, String> body) {
        String storeName = body.get("storeName");
        String password = body.get("password");

        if (storeName == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Missing parameters."));
        }

        Optional<Owner> existing = ownerRepository.findByStoreName(storeName);
        if (existing.isPresent() && existing.get().getPassword().equals(password)) {
            Owner owner = existing.get();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "name", owner.getName(),
                    "storeName", owner.getStoreName()
            ));
        }

        return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid Store Name or Password."));
    }
}
