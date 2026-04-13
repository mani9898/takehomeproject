package org.example.authzservice.controller;

import org.example.authzservice.dtos.LoginDto;
import org.example.authzservice.dtos.RegisterRequest;
import org.example.authzservice.entity.MediaUser;
import org.example.authzservice.exceptions.InvalidUserCred;
import org.example.authzservice.exceptions.UserAlreadyExistsException;
import org.example.authzservice.service.SocialMediaUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://164.92.77.90", "http://164.92.77.90:5173"})
public class AuthController {

    @Autowired
    SocialMediaUserService socialMediaUserService;

    @PostMapping("/register")
    public ResponseEntity<MediaUser> registerUser(@RequestBody RegisterRequest registerRequest) throws UserAlreadyExistsException {
        MediaUser mediaUser = new MediaUser();
        mediaUser.setUsername(registerRequest.getUsername());
        mediaUser.setEmail(registerRequest.getEmail());
        mediaUser.setPassword(registerRequest.getPassword());
        mediaUser = socialMediaUserService.register(mediaUser);
        mediaUser.setPassword(null); // Keep it safe

        return new ResponseEntity<>(mediaUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public Map<String, String> loginUser(@Validated @RequestBody LoginDto loginDto) throws InvalidUserCred {
        return socialMediaUserService.login(loginDto.getUsername(), loginDto.getPassword());
    }
}
