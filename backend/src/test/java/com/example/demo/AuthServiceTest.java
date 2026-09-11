package com.example.demo;

import com.example.demo.config.JwtService;
import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.CityUser;
import com.example.demo.entity.Role;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.repository.CityUserRepository;
import com.example.demo.service.AuthService;
import org.mockito.ArgumentCaptor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    private CityUserRepository cityUserRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthenticationManager authenticationManager;
    private AuthService authService;

    @BeforeMethod
    public void setUp() {
        cityUserRepository = mock(CityUserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        authenticationManager = mock(AuthenticationManager.class);

        authService = new AuthService(
                cityUserRepository,
                passwordEncoder,
                jwtService,
                authenticationManager
        );

        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("mockJwtToken");
        when(cityUserRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(cityUserRepository.findByBadgeNumber(anyString())).thenReturn(Optional.empty());
    }

    // 1. Register a completely new valid user with CITY_ADMINISTRATOR and null/empty district/badge
    @Test
    public void testRegisterNewCityAdministrator_Success() {
        RegisterDto dto = new RegisterDto(
                "john_admin",
                "secret123",
                "John Admin",
                "CITY_ADMINISTRATOR",
                "",
                ""
        );

        when(cityUserRepository.findByUsername("john_admin")).thenReturn(Optional.empty());

        AuthResponseDto response = authService.register(dto);

        Assert.assertNotNull(response);
        Assert.assertEquals(response.getUsername(), "john_admin");
        Assert.assertEquals(response.getRole(), "CITY_ADMINISTRATOR");
        Assert.assertEquals(response.getToken(), "mockJwtToken");

        ArgumentCaptor<CityUser> captor = ArgumentCaptor.forClass(CityUser.class);
        verify(cityUserRepository, times(1)).save(captor.capture());
        CityUser saved = captor.getValue();
        Assert.assertEquals(saved.getUsername(), "john_admin");
        Assert.assertEquals(saved.getRole(), Role.CITY_ADMINISTRATOR);
        Assert.assertNull(saved.getDistrict());
        Assert.assertNull(saved.getBadgeNumber());
    }

    // 2 & 3. Register the same username again -> throws BusinessValidationException
    @Test(expectedExceptions = BusinessValidationException.class, expectedExceptionsMessageRegExp = ".*Username already exists.*")
    public void testRegisterDuplicateUsername_ThrowsConflict() {
        RegisterDto dto = new RegisterDto(
                "existing_user",
                "secret123",
                "Existing User",
                "TRAFFIC_CONTROLLER",
                "Downtown",
                "TC-101"
        );

        when(cityUserRepository.findByUsername("existing_user")).thenReturn(Optional.of(new CityUser()));

        authService.register(dto);
    }

    // 4 & 5. Test district-level roles with district
    @Test
    public void testRegisterDistrictLevelRole_Success() {
        RegisterDto dto = new RegisterDto(
                "traffic_officer",
                "secret123",
                "Traffic Officer",
                "TRAFFIC_CONTROLLER",
                "North District",
                "TC-202"
        );

        when(cityUserRepository.findByUsername("traffic_officer")).thenReturn(Optional.empty());
        when(cityUserRepository.findByBadgeNumber("TC-202")).thenReturn(Optional.empty());

        AuthResponseDto response = authService.register(dto);

        Assert.assertNotNull(response);
        Assert.assertEquals(response.getUsername(), "traffic_officer");
        Assert.assertEquals(response.getRole(), "TRAFFIC_CONTROLLER");

        ArgumentCaptor<CityUser> captor = ArgumentCaptor.forClass(CityUser.class);
        verify(cityUserRepository, times(1)).save(captor.capture());
        CityUser saved = captor.getValue();
        Assert.assertEquals(saved.getDistrict(), "North District");
        Assert.assertEquals(saved.getBadgeNumber(), "TC-202");
    }

    // 6. Test missing / empty district is normalized to null
    @Test
    public void testRegisterMissingDistrict_NormalizedToNull() {
        RegisterDto dto = new RegisterDto(
                "field_tech",
                "secret123",
                "Field Tech",
                "FIELD_TECHNICIAN",
                "   ",
                null
        );

        when(cityUserRepository.findByUsername("field_tech")).thenReturn(Optional.empty());

        authService.register(dto);

        ArgumentCaptor<CityUser> captor = ArgumentCaptor.forClass(CityUser.class);
        verify(cityUserRepository, times(1)).save(captor.capture());
        Assert.assertNull(captor.getValue().getDistrict());
    }

    // 7. Test invalid role -> throws BusinessValidationException
    @Test(expectedExceptions = BusinessValidationException.class, expectedExceptionsMessageRegExp = ".*Invalid role.*")
    public void testRegisterInvalidRole_ThrowsException() {
        RegisterDto dto = new RegisterDto(
                "bad_role_user",
                "secret123",
                "Bad User",
                "SUPERHERO",
                "Central",
                "SH-999"
        );

        when(cityUserRepository.findByUsername("bad_role_user")).thenReturn(Optional.empty());

        authService.register(dto);
    }

    // 8. Test duplicate badge number
    @Test(expectedExceptions = BusinessValidationException.class, expectedExceptionsMessageRegExp = ".*Badge number already exists.*")
    public void testRegisterDuplicateBadgeNumber_ThrowsException() {
        RegisterDto dto = new RegisterDto(
                "new_officer",
                "secret123",
                "New Officer",
                "TRAFFIC_CONTROLLER",
                "Central",
                "BADGE-001"
        );

        when(cityUserRepository.findByUsername("new_officer")).thenReturn(Optional.empty());
        when(cityUserRepository.findByBadgeNumber("BADGE-001")).thenReturn(Optional.of(new CityUser()));

        authService.register(dto);
    }

    // 9. Verify login functionality still works
    @Test
    public void testLogin_Success() {
        AuthRequestDto loginDto = new AuthRequestDto("john_admin", "secret123");

        CityUser user = CityUser.builder()
                .userId(1L)
                .username("john_admin")
                .passwordHash("encodedPassword")
                .role(Role.CITY_ADMINISTRATOR)
                .fullName("John Admin")
                .isActive(true)
                .build();

        when(cityUserRepository.findByUsername("john_admin")).thenReturn(Optional.of(user));

        AuthResponseDto response = authService.login(loginDto);

        Assert.assertNotNull(response);
        Assert.assertEquals(response.getUsername(), "john_admin");
        Assert.assertEquals(response.getRole(), "CITY_ADMINISTRATOR");
        Assert.assertEquals(response.getToken(), "mockJwtToken");
    }
}
