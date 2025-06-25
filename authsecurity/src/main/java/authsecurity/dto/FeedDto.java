package authsecurity.dto;

import java.util.List;

public record FeedDto(List<FeedItemDto> items, int page, int pageSize, int totalPages, long totalElements) {
}
