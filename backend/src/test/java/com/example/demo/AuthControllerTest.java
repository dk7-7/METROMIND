package com.example.demo;

import com.example.demo.controller.AuthController;
import com.example.demo.controller.GlobalExceptionHandler;
import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.service.AuthService;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class AuthControllerTest {

    private AuthService authService;
    private AuthController authController;
    private GlobalExceptionHandler exceptionHandler;

    @BeforeMethod
    public void setUp() {
        authService = Mockito.mock(AuthService.class);
        authController = new AuthController(authService);
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    public void testRegister_Success() {
        RegisterDto dto = new RegisterDto(
                "new_admin",
                "secret123",
                "New Admin",
                "CITY_ADMINISTRATOR",
                null,
                null
        );

        when(authService.register(any(RegisterDto.class)))
                .thenReturn(new AuthResponseDto("jwt-token", "new_admin", "CITY_ADMINISTRATOR"));

        ResponseEntity<AuthResponseDto> response = authController.register(dto);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.CREATED);
        Assert.assertNotNull(response.getBody());
        Assert.assertEquals(response.getBody().getUsername(), "new_admin");
        Assert.assertEquals(response.getBody().getRole(), "CITY_ADMINISTRATOR");
        Assert.assertEquals(response.getBody().getToken(), "jwt-token");
    }

    @Test
    public void testRegister_DuplicateUsername_HandledByGlobalExceptionHandler() {
        BusinessValidationException ex = new BusinessValidationException("Username already exists");
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleBusinessValidation(ex);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.CONFLICT);
        Assert.assertNotNull(response.getBody());
        Assert.assertEquals(response.getBody().get("message"), "Username already exists");
        Assert.assertEquals(response.getBody().get("field"), "username");
        Assert.assertEquals(response.getBody().get("status"), 409);
    }

    @Test
    public void testLogin_Success() {
        AuthRequestDto dto = new AuthRequestDto("new_admin", "secret123");

        when(authService.login(any(AuthRequestDto.class)))
                .thenReturn(new AuthResponseDto("jwt-token", "new_admin", "CITY_ADMINISTRATOR"));

        ResponseEntity<AuthResponseDto> response = authController.login(dto);

        Assert.assertEquals(response.getStatusCode(), HttpStatus.OK);
        Assert.assertNotNull(response.getBody());
        Assert.assertEquals(response.getBody().getUsername(), "new_admin");
        Assert.assertEquals(response.getBody().getToken(), "jwt-token");
    }
}
