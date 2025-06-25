package authsecurity.services.Interfaces;

import authsecurity.dto.CreateTweetDto;
import authsecurity.dto.FeedDto;

import java.util.UUID;

public interface ITweetService{
    void createTweet(CreateTweetDto dto, UUID userId);
    FeedDto listTweets(int page, int pageSize);
    void deleteTweet(Long tweetId, UUID userId);
}
