package authsecurity.services;

import authsecurity.dto.CreateTweetDto;
import authsecurity.dto.FeedDto;
import authsecurity.dto.FeedItemDto;
import authsecurity.exceptions.OperationForbiddenException;
import authsecurity.exceptions.ResourceNotFoundException;
import authsecurity.models.Tweet;
import authsecurity.repositories.TweetRepository;
import authsecurity.repositories.UserRepository;
import authsecurity.services.Interfaces.ITweetService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class TweetService implements ITweetService {

    private final TweetRepository tweetRepository;
    private final UserRepository userRepository;

    @Override
    public void createTweet(CreateTweetDto dto, UUID userId) {
        var user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var tweet = new Tweet();
        tweet.setUser(user);
        tweet.setContent(dto.content());

        tweetRepository.save(tweet);
    }

    @Override
    public FeedDto listTweets(int page, int pageSize) {
        var tweetsPage = tweetRepository.findAll(
                PageRequest.of(page, pageSize, Sort.Direction.DESC, "createdAt")
        );

        var feedItems = tweetsPage.map(tweet ->
                new FeedItemDto(
                        tweet.getId(),
                        tweet.getContent(),
                        tweet.getUser().getUsername()
                )
        ).getContent();

        return new FeedDto(
                feedItems,
                page,
                pageSize,
                tweetsPage.getTotalPages(),
                tweetsPage.getTotalElements()
        );
    }

    @Override
    public void deleteTweet(Long tweetId, UUID userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new ResourceNotFoundException("Tweet not found"));

        boolean isOwner = tweet.getUser().getId().equals(userId);

        if (!user.isAdmin() && !isOwner) {
            throw new OperationForbiddenException("You are not allowed to delete this tweet.");
        }

        tweetRepository.deleteById(tweetId);
    }
}
