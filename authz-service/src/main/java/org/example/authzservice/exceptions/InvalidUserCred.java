package org.example.authzservice.exceptions;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InvalidUserCred extends Exception {
    public InvalidUserCred(String message) {
        super(message);
    }
}
