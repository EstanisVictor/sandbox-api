package authsecurity.dto;

import java.time.Instant;

public record ErrorResponse(Instant timestamp, Integer status, String error, String message, String path) {
}
