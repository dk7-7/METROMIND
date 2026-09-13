package com.example.demo.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutageDto {

    private String outageType;
    private String affectedArea;
    private String severity;

    @JsonDeserialize(using = FlexibleLocalDateTimeDeserializer.class)
    private LocalDateTime estimatedRestorationTime;

    private Long gridId;

    public static class FlexibleLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
        @Override
        public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            String value = p.getText();
            if (value == null || value.trim().isEmpty()) {
                return null;
            }
            value = value.trim();
            try {
                return LocalDateTime.parse(value);
            } catch (Exception ignored) {}
            try {
                return LocalDateTime.parse(value, DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception ignored) {}
            Pattern pattern = Pattern.compile("(\\d+)\\s*(?:hour|h)?s?", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(value);
            if (matcher.find()) {
                try {
                    long hours = Long.parseLong(matcher.group(1));
                    return LocalDateTime.now().plusHours(hours);
                } catch (Exception ignored) {}
            }
            return null;
        }
    }
}