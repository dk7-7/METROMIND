package com.example.demo;

import com.example.demo.config.SecurityConfig;
import com.example.demo.controller.*;
import org.testng.Assert;
import org.testng.annotations.Test;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.mock.web.MockHttpServletRequest;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

public class CorsValidationTest {

    @Test
    public void testSecurityConfigCorsBean() throws Exception {
        SecurityConfig config = new SecurityConfig(null, null);
        Method corsMethod = null;
        for (Method m : SecurityConfig.class.getDeclaredMethods()) {
            if (m.getName().toLowerCase().contains("cors") && CorsConfigurationSource.class.isAssignableFrom(m.getReturnType())) {
                corsMethod = m;
                break;
            }
        }
        Assert.assertNotNull(corsMethod, "CorsConfigurationSource bean method must exist in SecurityConfig");
        
        CorsConfigurationSource source = (CorsConfigurationSource) corsMethod.invoke(config);
        Assert.assertNotNull(source, "CorsConfigurationSource returned cannot be null");
        
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/incidents");
        CorsConfiguration corsConfig = source.getCorsConfiguration(request);
        Assert.assertNotNull(corsConfig, "CorsConfiguration for /api/incidents must not be null");
        
        Assert.assertEquals(corsConfig.getAllowedOrigins(), List.of("http://localhost:3000", "http://localhost:5173"));
        Assert.assertEquals(corsConfig.getAllowedMethods(), List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        Assert.assertEquals(corsConfig.getAllowedHeaders(), List.of("*"));
    }

    @Test
    public void testControllerCrossOriginAnnotations() {
        Class<?>[] controllers = new Class<?>[] {
            AuthController.class,
            TrafficIncidentController.class,
            TrafficZoneController.class,
            UtilityGridController.class,
            AlertNotificationController.class,
            DashboardController.class,
            FieldObservationController.class,
            UtilityOutageController.class
        };

        for (Class<?> controller : controllers) {
            CrossOrigin crossOrigin = controller.getAnnotation(CrossOrigin.class);
            Assert.assertNotNull(crossOrigin, controller.getSimpleName() + " must have @CrossOrigin annotation");
            List<String> origins = Arrays.asList(crossOrigin.origins());
            Assert.assertTrue(origins.contains("http://localhost:3000"), controller.getSimpleName() + " must allow http://localhost:3000");
            Assert.assertTrue(origins.contains("http://localhost:5173"), controller.getSimpleName() + " must allow http://localhost:5173");
        }
    }
}
