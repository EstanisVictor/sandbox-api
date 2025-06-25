package authsecurity.controllers;

import authsecurity.controllers.dto.CreateTweetDto;
import authsecurity.controllers.dto.FeedDto;
import authsecurity.controllers.dto.FeedItemDto;
import authsecurity.models.Role;
import authsecurity.models.Tweet;
import authsecurity.repositories.TweetRepository;
import authsecurity.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@AllArgsConstructor
public class TweetController {
    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;


    @PostMapping("/tweets/createTweet")
    public ResponseEntity<Void> createTweet(@RequestBody CreateTweetDto createTweetDto, JwtAuthenticationToken token) {
        var user = userRepository.findById(UUID.fromString(token.getName()));

        var tweet = new Tweet();
        tweet.setUser(user.get());
        tweet.setContent(createTweetDto.content());

        tweetRepository.save(tweet);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/feed")
    public ResponseEntity<FeedDto> feed(@RequestParam(value = "page", defaultValue = "0") int page , @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        var tweets = tweetRepository.findAll(PageRequest.of(page, pageSize, Sort.Direction.DESC, "createdAt"))
                .map(tweet ->
                                new FeedItemDto(
                                        tweet.getId(),
                                        tweet.getContent(),
                                        tweet.getUser().getUsername()
                                )
                );

        return ResponseEntity.ok(
                new FeedDto(
                    tweets.getContent(),
                    page,
                    pageSize,
                    tweets.getTotalPages(),
                    tweets.getTotalElements()
                )
        );
    }

    @DeleteMapping("/tweets/{id}")
    public ResponseEntity<Void> deleteTweet(@PathVariable("id") Long tweetId, JwtAuthenticationToken token) {
        var user = userRepository.findById(UUID.fromString(token.getName()));
        var tweet = tweetRepository.findById(tweetId).orElseThrow( () -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        var isAdmin = user.get().getRoles()
                .stream().anyMatch(role -> role.getName().equalsIgnoreCase(Role.Values.ADMIN.name()));

        if(isAdmin || tweet.getUser().getId().equals(UUID.fromString(token.getName()))) {
            tweetRepository.deleteById(tweetId);
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok().build();
    }
}
