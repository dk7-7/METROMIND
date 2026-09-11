package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.example.demo.exception.IllegalStateException;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BusinessValidationException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessValidation(BusinessValidationException ex) {
        Map<String, Object> body = new HashMap<>();
        String message = ex.getMessage();
        body.put("error", message);
        body.put("message", message);
        body.put("status", HttpStatus.CONFLICT.value());
        if (message != null) {
            String lower = message.toLowerCase();
            if (lower.contains("username")) {
                body.put("field", "username");
            } else if (lower.contains("badge")) {
                body.put("field", "badgeNumber");
            } else if (lower.contains("role")) {
                body.put("field", "role");
            }
        }
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler({
        org.springframework.security.core.AuthenticationException.class,
        org.springframework.security.authentication.BadCredentialsException.class
    })
    public ResponseEntity<Map<String, Object>> handleAuthentication(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Invalid username or password");
        body.put("message", "Invalid username or password");
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(org.springframework.security.access.AccessDeniedException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Access denied: insufficient permissions");
        body.put("message", "Access denied: insufficient permissions");
        body.put("status", HttpStatus.FORBIDDEN.value());
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotSupported(org.springframework.web.HttpRequestMethodNotSupportedException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        body.put("message", ex.getMessage());
        body.put("status", HttpStatus.METHOD_NOT_ALLOWED.value());
        return new ResponseEntity<>(body, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(org.springframework.web.bind.MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, Object>> handleMissingParams(org.springframework.web.bind.MissingServletRequestParameterException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", ex.getMessage());
        body.put("message", ex.getMessage());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleNotReadable(org.springframework.http.converter.HttpMessageNotReadableException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Invalid request body or parameter format");
        body.put("message", "Invalid request body or parameter format");
        body.put("status", HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        org.springframework.validation.FieldError firstError = ex.getBindingResult().getFieldError();
        String field = firstError != null ? firstError.getField() : "unknown";
        String defaultMsg = firstError != null ? firstError.getDefaultMessage() : "Validation failed";
        String errorMsg = firstError != null ? (field + " " + defaultMsg) : "Validation failed";
        body.put("error", errorMsg);
        body.put("message", errorMsg);
        body.put("field", field);
        body.put("status", HttpStatus.BAD_REQUEST.value());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(org.springframework.dao.DataIntegrityViolationException ex) {
        Map<String, Object> body = new HashMap<>();
        String rootMsg = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : "";
        String lower = rootMsg.toLowerCase();
        if (lower.contains("username")) {
            body.put("error", "Username already exists");
            body.put("message", "Username already exists");
            body.put("field", "username");
            body.put("status", HttpStatus.CONFLICT.value());
            return new ResponseEntity<>(body, HttpStatus.CONFLICT);
        } else if (lower.contains("badge") || lower.contains("badge_number")) {
            body.put("error", "Badge number already exists");
            body.put("message", "Badge number already exists");
            body.put("field", "badgeNumber");
            body.put("status", HttpStatus.CONFLICT.value());
            return new ResponseEntity<>(body, HttpStatus.CONFLICT);
        } else {
            body.put("error", "Data constraint violation. Please verify the submitted data.");
            body.put("message", "Data constraint violation. Please verify the submitted data.");
            body.put("status", HttpStatus.CONFLICT.value());
            return new ResponseEntity<>(body, HttpStatus.CONFLICT);
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred");
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}