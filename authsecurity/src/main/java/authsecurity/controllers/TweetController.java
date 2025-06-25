package authsecurity.controllers;

import authsecurity.dto.CreateTweetDto;
import authsecurity.dto.FeedDto;
import authsecurity.services.TweetService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@AllArgsConstructor
public class TweetController {

    private final TweetService tweetService;

    @PostMapping("/tweets/createTweet")
    public ResponseEntity<Void> createTweet(@RequestBody CreateTweetDto createTweetDto, JwtAuthenticationToken token) {
        var userId = UUID.fromString(token.getName());
        tweetService.createTweet(createTweetDto, userId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/feed")
    public ResponseEntity<FeedDto> feed(@RequestParam(value = "page", defaultValue = "0") int page,
                                        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {

        var feed = tweetService.listTweets(page, pageSize);
        return ResponseEntity.ok(feed);
    }

    @DeleteMapping("/tweets/{id}")
    public ResponseEntity<Void> deleteTweet(@PathVariable("id") Long tweetId, JwtAuthenticationToken token) {
        var userId = UUID.fromString(token.getName());
        tweetService.deleteTweet(tweetId, userId);

        return ResponseEntity.noContent().build();
    }
}