package org.example.authzservice.service;

import org.example.authzservice.entity.MediaUser;
import org.example.authzservice.exceptions.InvalidUserCred;
import org.example.authzservice.exceptions.UserAlreadyExistsException;
import org.example.authzservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class SocialMediaUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtEncoder jwtEncoder;

    public MediaUser register(MediaUser mediaUser) throws UserAlreadyExistsException {
        if (userRepository.findByUsername(mediaUser.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("User already exists with username: " + mediaUser.getUsername());
        }
        mediaUser.setPassword(passwordEncoder.encode(mediaUser.getPassword()));
        return userRepository.save(mediaUser);
    }

    public Map<String, String> login(String username, String password) throws InvalidUserCred {
        Optional<MediaUser> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            throw new InvalidUserCred("Invalid username or password");
        }

        MediaUser user = userOpt.get();

        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("http://localhost:9000") // Matches the resource server application.yml
                .issuedAt(now)
                .expiresAt(now.plus(1, ChronoUnit.HOURS))
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        
        return response;
    }
}
